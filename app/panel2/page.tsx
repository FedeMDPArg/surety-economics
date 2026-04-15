"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { money, pct } from "@/lib/utils";
import { MetricCard, SliderInput } from "@/components/panel-ui";
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

// Blended assumptions — realistic surety numbers
const AVG_PREMIUM_COMMERCIAL = 400; // Notary/contractor/auto dealer blended
const AVG_PREMIUM_CONTRACT = 5000; // Performance bonds

type MonthRow = {
  month: number;
  newRevenue: number;
  renewalRevenue: number;
  total: number;
  cumulative: number;
};

function simulate(params: {
  bondsPerMonth: number;
  commercialMix: number; // 0..1
  renewalCommercial: number; // 0..1
  renewalContract: number; // 0..1
  churn: number; // 0..1 (annual)
  horizonYears: number;
}): MonthRow[] {
  const { bondsPerMonth, commercialMix, renewalCommercial, renewalContract, churn, horizonYears } =
    params;
  const months = horizonYears * 12;

  // Average premium per new bond this period
  const avgPremium =
    commercialMix * AVG_PREMIUM_COMMERCIAL + (1 - commercialMix) * AVG_PREMIUM_CONTRACT;
  const blendedRenewal = commercialMix * renewalCommercial + (1 - commercialMix) * renewalContract;

  // Cohort-based: each month, a new cohort of `bondsPerMonth` bonds.
  // Renewal happens yearly (month 12, 24, 36...) with rate = blendedRenewal * survival factor.
  // Survival factor = (1 - churn)^age_years
  const rows: MonthRow[] = [];
  let cumulative = 0;

  for (let m = 1; m <= months; m++) {
    const newRevenue = bondsPerMonth * avgPremium;

    let renewalRevenue = 0;
    // A cohort born at month c renews at c+12, c+24, ...
    // At month m, cohort c contributes if (m - c) > 0 and (m - c) % 12 === 0
    for (let c = 1; c < m; c++) {
      if ((m - c) % 12 === 0) {
        const ageYears = (m - c) / 12;
        const survival = Math.pow(1 - churn, ageYears);
        renewalRevenue += bondsPerMonth * avgPremium * blendedRenewal * survival;
      }
    }

    const total = newRevenue + renewalRevenue;
    cumulative += total;
    rows.push({ month: m, newRevenue, renewalRevenue, total, cumulative });
  }

  return rows;
}

type BondType = {
  id: number;
  name: string;
  category: string;
  avg_premium_rate: number | string;
  avg_bond_amount: number | string;
  loss_ratio: number | string;
  renewal_rate: number | string;
};

export default function Panel2Page() {
  // Shared store state
  const portfolio = useSuretyStore((s) => s.portfolio);
  const mode = useSuretyStore((s) => s.mode);
  const timeHorizonYears = useSuretyStore((s) => s.timeHorizonYears);
  const setTimeHorizonYears = useSuretyStore((s) => s.setTimeHorizonYears);
  const nickTakeRate = useSuretyStore((s) =>
    s.mode === "sub-agent" ? s.subAgentOverride : s.primaryCommission,
  );

  // Data source toggle: use portfolio from Panel 1, or manual inputs
  const [usePortfolio, setUsePortfolio] = useState(true);
  const [bondTypes, setBondTypes] = useState<BondType[]>([]);

  // Manual-mode inputs
  const [manualBondsPerMonth, setManualBondsPerMonth] = useState(500);
  const [manualCommercialMix, setManualCommercialMix] = useState(0.8);

  const [renewalCommercial, setRenewalCommercial] = useState(0.85);
  const [renewalContract, setRenewalContract] = useState(0.6);
  const [churn, setChurn] = useState(0.1);
  const horizonYears = timeHorizonYears;
  const setHorizonYears = setTimeHorizonYears;

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

  // Derived values from portfolio when available
  const portfolioDerived = useMemo(() => {
    if (portfolio.length === 0 || bondTypes.length === 0) {
      return null;
    }
    let totalQty = 0;
    let commercialQty = 0;
    for (const b of portfolio) {
      const bt = bondTypes.find((t) => t.id === b.bondTypeId);
      if (!bt) continue;
      totalQty += b.quantity;
      if (bt.category === "commercial") commercialQty += b.quantity;
    }
    if (totalQty === 0) return null;
    return {
      bondsPerMonth: totalQty,
      commercialMix: commercialQty / totalQty,
    };
  }, [portfolio, bondTypes]);

  // Resolved inputs: from portfolio OR manual
  const effective =
    usePortfolio && portfolioDerived
      ? portfolioDerived
      : { bondsPerMonth: manualBondsPerMonth, commercialMix: manualCommercialMix };
  const bondsPerMonth = effective.bondsPerMonth;
  const commercialMix = effective.commercialMix;
  const setBondsPerMonth = setManualBondsPerMonth;
  const setCommercialMix = setManualCommercialMix;

  const rows = useMemo(
    () =>
      simulate({
        bondsPerMonth,
        commercialMix,
        renewalCommercial,
        renewalContract,
        churn,
        horizonYears,
      }),
    [bondsPerMonth, commercialMix, renewalCommercial, renewalContract, churn, horizonYears],
  );

  const mrrAt = (month: number) => rows[month - 1]?.total ?? 0;
  const totalMonths = horizonYears * 12;
  const mrr12 = mrrAt(Math.min(12, totalMonths));
  const mrr36 = mrrAt(Math.min(36, totalMonths));
  const mrr60 = mrrAt(totalMonths);

  const finalMonth = rows[rows.length - 1];
  const renewalShareFinal = finalMonth
    ? finalMonth.renewalRevenue / (finalMonth.total || 1)
    : 0;

  const chartData = {
    labels: rows.map((r) => `M${r.month}`),
    datasets: [
      {
        label: "New bonds revenue",
        data: rows.map((r) => r.newRevenue),
        borderColor: "#0ea5e9",
        backgroundColor: "rgba(14, 165, 233, 0.4)",
        fill: true,
        stack: "revenue",
        pointRadius: 0,
      },
      {
        label: "Renewal revenue",
        data: rows.map((r) => r.renewalRevenue),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.6)",
        fill: true,
        stack: "revenue",
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Monthly revenue — new vs renewals (stacked)" },
      tooltip: {
        callbacks: {
          label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) => {
            const y = ctx.parsed.y ?? 0;
            return `${ctx.dataset.label}: ${money(y)}`;
          },
        },
      },
    },
    scales: {
      y: {
        stacked: true,
        ticks: {
          callback: (v: string | number) => money(Number(v)),
        },
      },
    },
  };

  return (
    <div className="mx-auto max-w-6xl p-6 md:p-10 space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-emerald-600 font-semibold">
          Panel 2
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Renewal Revenue Engine
        </h1>
        <p className="text-muted-foreground">
          Why surety revenue compounds: 75-88% renewal rate × growing volume = moat.
        </p>
      </header>

      {/* Data source toggle + shared-state banner */}
      <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm font-semibold">
              🔗 Data source:{" "}
              {usePortfolio && portfolioDerived
                ? `Portfolio from Panel 1 (${portfolioDerived.bondsPerMonth.toLocaleString()} bonds/mo, ${pct(portfolioDerived.commercialMix)} commercial)`
                : "Manual inputs"}
            </p>
            <p className="text-xs text-muted-foreground">
              Acting as <strong>{mode === "sub-agent" ? "sub-agent" : "primary agent"}</strong>{" "}
              ({pct(nickTakeRate)} of premium) · Time horizon synced with Panel 1:{" "}
              <strong>{horizonYears} years</strong>
            </p>
          </div>
          <div className="flex gap-1 rounded-lg border p-1 bg-background">
            <button
              onClick={() => setUsePortfolio(true)}
              disabled={!portfolioDerived}
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
        {!portfolioDerived && usePortfolio && (
          <p className="text-xs text-amber-700 dark:text-amber-400">
            No portfolio configured in Panel 1 yet — falling back to manual inputs.
            Go to{" "}
            <a href="/panel1" className="underline font-medium">
              Panel 1 Portfolio
            </a>{" "}
            to load a preset.
          </p>
        )}
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label={`MRR month 12`} value={money(mrr12)} />
        <MetricCard label={`MRR month 36`} value={money(mrr36)} />
        <MetricCard
          label={`MRR month ${horizonYears * 12}`}
          value={money(mrr60)}
        />
        <MetricCard
          label={`% revenue from renewals (M${horizonYears * 12})`}
          value={pct(renewalShareFinal)}
          accent="emerald"
        />
        <MetricCard
          label={`Nick gross from this engine (M${horizonYears * 12})`}
          value={money(mrr60 * nickTakeRate)}
          sublabel={`at ${pct(nickTakeRate)} take rate`}
          accent="sky"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="space-y-5 rounded-lg border p-5">
          <SliderInput
            label="New bonds per month"
            value={bondsPerMonth}
            min={50}
            max={5000}
            step={50}
            onChange={setBondsPerMonth}
            display={bondsPerMonth.toLocaleString()}
          />
          <SliderInput
            label="Commercial mix"
            value={commercialMix}
            min={0}
            max={1}
            step={0.05}
            onChange={setCommercialMix}
            display={`${pct(commercialMix)} commercial / ${pct(1 - commercialMix)} contract`}
          />
          <SliderInput
            label="Renewal rate — commercial"
            value={renewalCommercial}
            min={0.5}
            max={0.95}
            step={0.01}
            onChange={setRenewalCommercial}
            display={pct(renewalCommercial, 0)}
          />
          <SliderInput
            label="Renewal rate — contract"
            value={renewalContract}
            min={0.3}
            max={0.85}
            step={0.01}
            onChange={setRenewalContract}
            display={pct(renewalContract, 0)}
          />
          <SliderInput
            label="Annual churn rate"
            value={churn}
            min={0.05}
            max={0.25}
            step={0.01}
            onChange={setChurn}
            display={pct(churn, 0)}
          />
          <SliderInput
            label="Time horizon"
            value={horizonYears}
            min={1}
            max={5}
            step={1}
            onChange={setHorizonYears}
            display={`${horizonYears} year${horizonYears > 1 ? "s" : ""}`}
          />
          <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
            <p className="font-medium mb-1">Assumptions</p>
            <p>Avg premium: {money(AVG_PREMIUM_COMMERCIAL)} commercial / {money(AVG_PREMIUM_CONTRACT)} contract</p>
            <p>Renewals happen at 12, 24, 36... months after bond origination</p>
          </div>
        </div>

        <div className="rounded-lg border p-5">
          <Line data={chartData} options={chartOptions} />
          <div className="mt-4 rounded-md bg-muted p-4 text-sm">
            <p className="font-medium">💡 PE-grade read</p>
            <p className="text-muted-foreground mt-1">
              At month 60, {pct(renewalShareFinal)} of revenue comes from renewals —
              that&apos;s a compounding book of business, not net sales. Predictable
              revenue = higher valuation multiple.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

