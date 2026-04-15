"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { money, pct } from "@/lib/utils";
import { MetricCard, NumberSliderInput } from "@/components/panel-ui";
import { useSuretyStore } from "@/lib/store";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

type BondType = {
  id: number;
  name: string;
  category: string;
  avg_premium_rate: number | string;
  avg_bond_amount: number | string;
  loss_ratio: number | string;
  renewal_rate: number | string;
};

type RevenueView = "total-premium" | "nick-gross" | "nick-net";

// Credit score multiplier — same formula as Panel 1
function creditMultiplier(score: number) {
  const normalized = (score - 550) / (800 - 550);
  return 1.5 - normalized * 0.8;
}

type MonthRow = {
  month: number;
  newPremium: number;
  renewalPremium: number;
  totalPremium: number;
  nickGross: number;
  nickNet: number;
  cumulativePremium: number;
  cumulativeNickNet: number;
};

/**
 * Cohort-based simulation, aware of per-bond-type premiums and renewal rates.
 * Each "cohort" is a batch of the same portfolio mix issued in a single month.
 * Volume grows each year by (1 + yoyGrowth).
 */
function simulatePortfolio(params: {
  cohorts: { premiumPerBond: number; quantity: number; renewalRate: number }[];
  churn: number;
  yoyGrowth: number;
  horizonYears: number;
  nickTakeRate: number;
  costPctOfPremium: number; // CAC + OpEx + team (applied on premium)
}): MonthRow[] {
  const { cohorts, churn, yoyGrowth, horizonYears, nickTakeRate, costPctOfPremium } = params;
  const months = horizonYears * 12;
  const rows: MonthRow[] = [];
  let cumulativePremium = 0;
  let cumulativeNickNet = 0;

  // Precompute "base" cohort economics (premium per month for a single cohort, by type)
  // One cohort = one month of issuance

  for (let m = 1; m <= months; m++) {
    // Volume scaler: bonds this month = base × (1 + yoyGrowth)^(years elapsed)
    const monthScaler = Math.pow(1 + yoyGrowth, (m - 1) / 12);

    // New premium: all cohort types issued this month
    let newPremium = 0;
    for (const c of cohorts) {
      newPremium += c.premiumPerBond * c.quantity * monthScaler;
    }

    // Renewal premium: sum over all past cohort-months c where (m - c) is multiple of 12
    let renewalPremium = 0;
    for (let cMonth = 1; cMonth < m; cMonth++) {
      if ((m - cMonth) % 12 !== 0) continue;
      const ageYears = (m - cMonth) / 12;
      const originalMonthScaler = Math.pow(1 + yoyGrowth, (cMonth - 1) / 12);
      const survival = Math.pow(1 - churn, ageYears);
      for (const c of cohorts) {
        renewalPremium +=
          c.premiumPerBond *
          c.quantity *
          originalMonthScaler *
          c.renewalRate *
          survival;
      }
    }

    const totalPremium = newPremium + renewalPremium;
    const nickGross = totalPremium * nickTakeRate;
    const nickNet = totalPremium * (nickTakeRate - costPctOfPremium);
    cumulativePremium += totalPremium;
    cumulativeNickNet += nickNet;

    rows.push({
      month: m,
      newPremium,
      renewalPremium,
      totalPremium,
      nickGross,
      nickNet,
      cumulativePremium,
      cumulativeNickNet,
    });
  }

  return rows;
}

export default function Panel2Page() {
  // ─── Shared store state ───
  const portfolio = useSuretyStore((s) => s.portfolio);
  const mode = useSuretyStore((s) => s.mode);
  const setMode = useSuretyStore((s) => s.setMode);
  const timeHorizonYears = useSuretyStore((s) => s.timeHorizonYears);
  const churn = useSuretyStore((s) => s.churn);
  const setChurn = useSuretyStore((s) => s.setChurn);
  const yoyGrowth = useSuretyStore((s) => s.yoyGrowth);
  const setYoyGrowth = useSuretyStore((s) => s.setYoyGrowth);
  const subAgentOverride = useSuretyStore((s) => s.subAgentOverride);
  const primaryCommission = useSuretyStore((s) => s.primaryCommission);
  const cacPct = useSuretyStore((s) => s.cacPct);
  const opexPct = useSuretyStore((s) => s.opexPct);

  const nickTakeRate = mode === "sub-agent" ? subAgentOverride : primaryCommission;
  const costPctOfPremium = cacPct + opexPct + 0.003; // + fixed team 0.3%

  // ─── Local state ───
  const [bondTypes, setBondTypes] = useState<BondType[]>([]);
  const [usePortfolio, setUsePortfolio] = useState(true);
  const [manualBondsPerMonth, setManualBondsPerMonth] = useState(500);
  const [manualPremiumPerBond, setManualPremiumPerBond] = useState(1000);
  const [manualRenewal, setManualRenewal] = useState(0.8);
  const [revenueView, setRevenueView] = useState<RevenueView>("nick-gross");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("bond_types")
      .select("*")
      .order("id")
      .then(({ data }) => {
        if (data) setBondTypes(data as BondType[]);
      });
  }, []);

  // Build cohorts from portfolio (using real premiums + real renewal rates per bond type)
  const portfolioCohorts = useMemo(() => {
    if (portfolio.length === 0 || bondTypes.length === 0) return null;
    const cohorts = portfolio
      .map((b) => {
        const bt = bondTypes.find((t) => t.id === b.bondTypeId);
        if (!bt) return null;
        const rate = Number(bt.avg_premium_rate) * creditMultiplier(b.creditScore);
        return {
          name: bt.name,
          category: bt.category,
          premiumPerBond: b.bondAmount * rate,
          quantity: b.quantity,
          renewalRate: Number(bt.renewal_rate),
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
    const totalQty = cohorts.reduce((s, c) => s + c.quantity, 0);
    const blendedPremium =
      totalQty > 0
        ? cohorts.reduce((s, c) => s + c.premiumPerBond * c.quantity, 0) / totalQty
        : 0;
    const blendedRenewal =
      totalQty > 0
        ? cohorts.reduce((s, c) => s + c.renewalRate * c.quantity, 0) / totalQty
        : 0;
    const commercialQty = cohorts
      .filter((c) => c.category === "commercial")
      .reduce((s, c) => s + c.quantity, 0);
    return {
      cohorts,
      totalQty,
      blendedPremium,
      blendedRenewal,
      commercialMix: totalQty > 0 ? commercialQty / totalQty : 0,
    };
  }, [portfolio, bondTypes]);

  // Effective cohorts (portfolio OR manual single-cohort)
  const cohorts = useMemo(() => {
    if (usePortfolio && portfolioCohorts) {
      return portfolioCohorts.cohorts;
    }
    return [
      {
        name: "Manual",
        category: "manual",
        premiumPerBond: manualPremiumPerBond,
        quantity: manualBondsPerMonth,
        renewalRate: manualRenewal,
      },
    ];
  }, [usePortfolio, portfolioCohorts, manualBondsPerMonth, manualPremiumPerBond, manualRenewal]);

  const rows = useMemo(
    () =>
      simulatePortfolio({
        cohorts,
        churn,
        yoyGrowth,
        horizonYears: timeHorizonYears,
        nickTakeRate,
        costPctOfPremium,
      }),
    [cohorts, churn, yoyGrowth, timeHorizonYears, nickTakeRate, costPctOfPremium],
  );

  // Same simulation but for the OTHER mode — for comparison
  const altNickTake = mode === "sub-agent" ? primaryCommission : subAgentOverride;
  const altRows = useMemo(
    () =>
      simulatePortfolio({
        cohorts,
        churn,
        yoyGrowth,
        horizonYears: timeHorizonYears,
        nickTakeRate: altNickTake,
        costPctOfPremium,
      }),
    [cohorts, churn, yoyGrowth, timeHorizonYears, altNickTake, costPctOfPremium],
  );

  // Derived metrics
  const totalMonths = timeHorizonYears * 12;
  const finalMonth = rows[rows.length - 1];
  const finalAlt = altRows[altRows.length - 1];
  const renewalShareFinal = finalMonth
    ? finalMonth.renewalPremium / (finalMonth.totalPremium || 1)
    : 0;

  const mrrAt = (m: number) => rows[m - 1]?.totalPremium ?? 0;
  const mrr12 = mrrAt(Math.min(12, totalMonths));
  const mrrFinal = mrrAt(totalMonths);

  const cumulativePremium = finalMonth?.cumulativePremium ?? 0;
  const cumulativeNickNet = finalMonth?.cumulativeNickNet ?? 0;
  const cumulativeAltNickNet = finalAlt?.cumulativeNickNet ?? 0;

  // Year-by-year aggregation
  const yearlyRows = useMemo(() => {
    const years: {
      year: number;
      premium: number;
      newPremium: number;
      renewalPremium: number;
      nickNet: number;
    }[] = [];
    for (let y = 1; y <= timeHorizonYears; y++) {
      const from = (y - 1) * 12;
      const to = y * 12;
      const slice = rows.slice(from, to);
      years.push({
        year: y,
        premium: slice.reduce((s, r) => s + r.totalPremium, 0),
        newPremium: slice.reduce((s, r) => s + r.newPremium, 0),
        renewalPremium: slice.reduce((s, r) => s + r.renewalPremium, 0),
        nickNet: slice.reduce((s, r) => s + r.nickNet, 0),
      });
    }
    return years;
  }, [rows, timeHorizonYears]);

  // Chart data based on revenueView
  const chartData = useMemo(() => {
    if (revenueView === "total-premium") {
      return {
        labels: rows.map((r) => `M${r.month}`),
        datasets: [
          {
            label: "New bonds premium",
            data: rows.map((r) => r.newPremium),
            borderColor: "#0ea5e9",
            backgroundColor: "rgba(14, 165, 233, 0.4)",
            fill: true,
            stack: "revenue",
            pointRadius: 0,
          },
          {
            label: "Renewal premium",
            data: rows.map((r) => r.renewalPremium),
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.6)",
            fill: true,
            stack: "revenue",
            pointRadius: 0,
          },
        ],
      };
    }
    if (revenueView === "nick-gross") {
      return {
        labels: rows.map((r) => `M${r.month}`),
        datasets: [
          {
            label: "Nick gross revenue",
            data: rows.map((r) => r.nickGross),
            borderColor: "#0ea5e9",
            backgroundColor: "rgba(14, 165, 233, 0.5)",
            fill: true,
            pointRadius: 0,
          },
        ],
      };
    }
    // nick-net
    return {
      labels: rows.map((r) => `M${r.month}`),
      datasets: [
        {
          label: "Nick net income",
          data: rows.map((r) => r.nickNet),
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.5)",
          fill: true,
          pointRadius: 0,
        },
      ],
    };
  }, [rows, revenueView]);

  const chartOptions = {
    responsive: true,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text:
          revenueView === "total-premium"
            ? "Monthly premium volume — new vs renewals (stacked)"
            : revenueView === "nick-gross"
              ? `Nick gross revenue over time (${pct(nickTakeRate)} of premium)`
              : `Nick net income over time (after CAC + OpEx + team)`,
      },
      tooltip: {
        callbacks: {
          label: (ctx: {
            dataset: { label?: string };
            parsed: { y: number | null };
          }) => {
            const y = ctx.parsed.y ?? 0;
            return `${ctx.dataset.label}: ${money(y)}`;
          },
        },
      },
    },
    scales: {
      y: {
        stacked: revenueView === "total-premium",
        ticks: { callback: (v: string | number) => money(Number(v)) },
      },
    },
  };

  // Delta for mode comparison
  const deltaCumulative = cumulativeAltNickNet - cumulativeNickNet;
  const deltaMultiplier = cumulativeNickNet > 0 ? cumulativeAltNickNet / cumulativeNickNet : 0;

  return (
    <div className="mx-auto max-w-6xl p-6 md:p-10 space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-emerald-600 font-semibold">
          Panel 2
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Renewal Revenue Engine
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          If Panel 1 shows the economics of a single bond, this panel shows
          what a whole book of business looks like over time. Each bond issued
          is a <strong>cohort</strong> that renews annually; stack years of
          those and you get compounding revenue.
        </p>
      </header>

      {/* Data source banner */}
      <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm font-semibold">
              🔗 Running simulation on:{" "}
              {usePortfolio && portfolioCohorts
                ? `Panel 1 portfolio — ${portfolioCohorts.totalQty.toLocaleString()} bonds/mo, avg premium ${money(portfolioCohorts.blendedPremium)}, blended renewal ${pct(portfolioCohorts.blendedRenewal)}`
                : `Manual input — ${manualBondsPerMonth} bonds/mo × ${money(manualPremiumPerBond)} premium`}
            </p>
            <p className="text-xs text-muted-foreground">
              Acting as <strong>{mode === "sub-agent" ? "sub-agent" : "primary agent"}</strong>{" "}
              ({pct(nickTakeRate)} of premium) · Horizon: <strong>{timeHorizonYears} years</strong>
              {usePortfolio && portfolioCohorts && (
                <> · Commercial mix: {pct(portfolioCohorts.commercialMix)}</>
              )}
            </p>
          </div>
          <div className="flex gap-1 rounded-lg border p-1 bg-background">
            <button
              onClick={() => setUsePortfolio(true)}
              disabled={!portfolioCohorts}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                usePortfolio
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted disabled:opacity-40"
              }`}
            >
              Use portfolio
            </button>
            <button
              onClick={() => setUsePortfolio(false)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                !usePortfolio
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Manual
            </button>
          </div>
        </div>
        {!portfolioCohorts && usePortfolio && (
          <p className="text-xs text-amber-700 dark:text-amber-400">
            No portfolio configured in Panel 1 yet —{" "}
            <Link href="/panel1" className="underline font-medium">
              go to Panel 1
            </Link>{" "}
            and load a preset, or switch to Manual.
          </p>
        )}
      </div>

      {/* Hero: the moat number */}
      <div className="rounded-lg border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/20 p-6">
        <p className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold mb-2">
          💎 The moat, in one number
        </p>
        <div className="flex items-baseline gap-4 flex-wrap">
          <span className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">
            {pct(renewalShareFinal)}
          </span>
          <p className="text-sm max-w-xl">
            of revenue at month {totalMonths} comes from{" "}
            <strong>renewals of bonds sold in prior months</strong>. If Nick
            stopped originating new bonds tomorrow, this percentage of revenue
            would still arrive next month. That&apos;s the compounding moat.
          </p>
        </div>
      </div>

      {/* Primary metric grid */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label={`Premium volume cumulative (${timeHorizonYears}y)`}
          value={money(cumulativePremium)}
          sublabel="what customers pay over horizon"
        />
        <MetricCard
          label={`Nick net cumulative (${timeHorizonYears}y)`}
          value={money(cumulativeNickNet)}
          sublabel={`as ${mode === "sub-agent" ? "sub-agent" : "primary"}`}
          accent="emerald"
        />
        <MetricCard
          label={`Monthly premium at M${totalMonths}`}
          value={money(mrrFinal)}
          sublabel={`vs ${money(mrr12)} at M12`}
        />
        <MetricCard
          label={`Monthly Nick net at M${totalMonths}`}
          value={money(mrrFinal * (nickTakeRate - costPctOfPremium))}
          accent="sky"
        />
      </section>

      {/* Mode comparison card — pulls from the "alt" simulation */}
      <div className="rounded-lg border border-sky-600/30 bg-sky-50 dark:bg-sky-950/20 p-5 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm uppercase tracking-widest text-sky-700 dark:text-sky-400 font-semibold">
              🚀 Sub-agent → Primary agent over the full horizon
            </p>
            <p className="text-xs text-muted-foreground">
              Same portfolio, same volume, same assumptions — only the
              regulatory status changes.
            </p>
          </div>
          <div className="flex gap-1 rounded-lg border p-1 bg-background">
            <button
              onClick={() => setMode("sub-agent")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                mode === "sub-agent"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Sub-agent
            </button>
            <button
              onClick={() => setMode("primary-agent")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                mode === "primary-agent"
                  ? "bg-emerald-600 text-white"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Primary agent
            </button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3 text-sm">
          <div className="rounded-md border bg-background p-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Current — {mode === "sub-agent" ? "Sub-agent" : "Primary"} ({pct(nickTakeRate)})
            </p>
            <p className="text-xl font-semibold mt-1">
              {money(cumulativeNickNet)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Nick net cumulative over {timeHorizonYears}y
            </p>
          </div>
          <div className="rounded-md border bg-background p-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Other mode — {mode === "sub-agent" ? "Primary" : "Sub-agent"} ({pct(altNickTake)})
            </p>
            <p className="text-xl font-semibold mt-1">
              {money(cumulativeAltNickNet)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Nick net cumulative over {timeHorizonYears}y
            </p>
          </div>
          <div
            className={`rounded-md border p-3 ${
              deltaCumulative >= 0
                ? "bg-emerald-100 dark:bg-emerald-950/30 border-emerald-600/40"
                : "bg-rose-100 dark:bg-rose-950/30 border-rose-600/40"
            }`}
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Delta
            </p>
            <p
              className={`text-xl font-semibold mt-1 ${
                deltaCumulative >= 0
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-rose-700 dark:text-rose-300"
              }`}
            >
              {deltaCumulative >= 0 ? "+" : ""}
              {money(deltaCumulative)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {deltaMultiplier.toFixed(1)}x if switching mode
            </p>
          </div>
        </div>
      </div>

      {/* Controls + Chart */}
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-5 rounded-lg border p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Assumptions (shared with Panel 1)
          </p>

          <NumberSliderInput
            label="Annual churn rate"
            value={churn * 100}
            min={0}
            max={30}
            step={1}
            onChange={(v) => setChurn(v / 100)}
            suffix="%"
            sublabel="shared"
          />

          <NumberSliderInput
            label="YoY volume growth"
            value={yoyGrowth * 100}
            min={-10}
            max={100}
            step={5}
            onChange={(v) => setYoyGrowth(v / 100)}
            suffix="%"
            sublabel="per year"
          />

          {!usePortfolio && (
            <>
              <div className="h-px bg-border" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Manual inputs
              </p>
              <NumberSliderInput
                label="New bonds per month"
                value={manualBondsPerMonth}
                min={10}
                max={10000}
                step={10}
                onChange={setManualBondsPerMonth}
              />
              <NumberSliderInput
                label="Premium per bond"
                value={manualPremiumPerBond}
                min={50}
                max={10000}
                step={50}
                onChange={setManualPremiumPerBond}
                suffix="USD"
              />
              <NumberSliderInput
                label="Renewal rate"
                value={manualRenewal * 100}
                min={30}
                max={95}
                step={1}
                onChange={(v) => setManualRenewal(v / 100)}
                suffix="%"
              />
            </>
          )}

          {usePortfolio && portfolioCohorts && (
            <>
              <div className="h-px bg-border" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Portfolio breakdown (read-only)
              </p>
              <div className="text-xs space-y-1.5">
                {portfolioCohorts.cohorts.map((c, i) => (
                  <div key={i} className="flex justify-between">
                    <span>
                      {c.name}{" "}
                      <span className="text-muted-foreground">
                        × {c.quantity}
                      </span>
                    </span>
                    <span className="font-mono">
                      {money(c.premiumPerBond)} @ {pct(c.renewalRate, 0)}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground pt-2 border-t">
                To change volumes or mix, edit the portfolio in{" "}
                <Link href="/panel1" className="underline">
                  Panel 1
                </Link>
                .
              </p>
            </>
          )}
        </div>

        <div className="rounded-lg border p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-semibold text-sm">
              Revenue over time
            </h3>
            <div className="flex gap-1 rounded-lg border p-1">
              <button
                onClick={() => setRevenueView("total-premium")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                  revenueView === "total-premium"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Total premium
              </button>
              <button
                onClick={() => setRevenueView("nick-gross")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                  revenueView === "nick-gross"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Nick gross
              </button>
              <button
                onClick={() => setRevenueView("nick-net")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                  revenueView === "nick-net"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Nick net
              </button>
            </div>
          </div>

          <Line data={chartData} options={chartOptions} />

          {/* Year-by-year table */}
          <div className="mt-4 overflow-x-auto">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">
              Year-by-year breakdown
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                  <th className="pb-2 pr-2">Year</th>
                  <th className="pb-2 pr-2 text-right">New premium</th>
                  <th className="pb-2 pr-2 text-right">Renewal premium</th>
                  <th className="pb-2 pr-2 text-right">Total premium</th>
                  <th className="pb-2 pr-2 text-right">Nick net</th>
                  <th className="pb-2 pr-2 text-right">% from renewals</th>
                </tr>
              </thead>
              <tbody>
                {yearlyRows.map((y) => (
                  <tr key={y.year} className="border-b">
                    <td className="py-2 pr-2 font-medium">Year {y.year}</td>
                    <td className="py-2 pr-2 text-right font-mono">
                      {money(y.newPremium)}
                    </td>
                    <td className="py-2 pr-2 text-right font-mono text-emerald-600 dark:text-emerald-400">
                      {money(y.renewalPremium)}
                    </td>
                    <td className="py-2 pr-2 text-right font-mono font-semibold">
                      {money(y.premium)}
                    </td>
                    <td className="py-2 pr-2 text-right font-mono">
                      {money(y.nickNet)}
                    </td>
                    <td className="py-2 pr-2 text-right text-muted-foreground">
                      {pct(y.renewalPremium / (y.premium || 1))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CTA to Panel 3 */}
      <div className="rounded-lg border p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-semibold text-sm">Next: why carriers should want in</p>
          <p className="text-xs text-muted-foreground">
            Panel 3 shows the ROI argument for a carrier integrating with
            BondGenius — with a live AI chat to back it up.
          </p>
        </div>
        <Link
          href="/panel3"
          className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition"
        >
          Continue to Panel 3 →
        </Link>
      </div>
    </div>
  );
}
