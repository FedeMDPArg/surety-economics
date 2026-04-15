"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { money, pct } from "@/lib/utils";
import {
  useSuretyStore,
  ltvMultiplier,
  LTV_CHURN,
  type PortfolioBond,
} from "@/lib/store";
import {
  MetricCard,
  NumberSliderInput,
  TableNumberInput,
} from "@/components/panel-ui";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type BondType = {
  id: number;
  name: string;
  category: string;
  avg_premium_rate: number | string;
  avg_bond_amount: number | string;
  loss_ratio: number | string;
  renewal_rate: number | string;
};

type View = "single" | "portfolio";
type Timeframe = "monthly" | "annual";

type Snapshot = {
  label: string;
  mode: string;
  subAgentOverride: number;
  primaryCommission: number;
  cacPct: number;
  opexPct: number;
  totalPremium: number;
  totalNickGross: number;
  totalNickNet: number;
  timeframe: Timeframe;
};

const PRIMARY_AGENCY_COMMISSION = 0.12;

function creditMultiplier(score: number) {
  const normalized = (score - 550) / (800 - 550);
  return 1.5 - normalized * 0.8;
}

function computePremium(bondType: BondType, amount: number, score: number) {
  const rate = Number(bondType.avg_premium_rate) * creditMultiplier(score);
  return { rate, premium: amount * rate };
}

/**
 * Preset portfolios. Quantities are per-month.
 * Bond types are looked up by category+name at runtime.
 */
const PRESETS: {
  label: string;
  description: string;
  // Maps bond type name → quantity
  mix: Record<string, { qty: number; bondAmount: number; creditScore: number }>;
}[] = [
  {
    label: "Small agency",
    description: "100 bonds/mo · single broker territory",
    mix: {
      "Notary Bond": { qty: 40, bondAmount: 10000, creditScore: 720 },
      "Contractor License": { qty: 30, bondAmount: 15000, creditScore: 700 },
      "Auto Dealer": { qty: 20, bondAmount: 50000, creditScore: 710 },
      "Performance Bond": { qty: 10, bondAmount: 250000, creditScore: 730 },
    },
  },
  {
    label: "Mid-market",
    description: "1K bonds/mo · multi-state agency",
    mix: {
      "Notary Bond": { qty: 400, bondAmount: 10000, creditScore: 720 },
      "Contractor License": { qty: 300, bondAmount: 15000, creditScore: 705 },
      "Freight Broker": { qty: 150, bondAmount: 75000, creditScore: 700 },
      "Auto Dealer": { qty: 100, bondAmount: 50000, creditScore: 710 },
      "Performance Bond": { qty: 50, bondAmount: 250000, creditScore: 730 },
    },
  },
  {
    label: "BuySuretyBonds scale",
    description: "5K bonds/mo · national DTC marketplace",
    mix: {
      "Notary Bond": { qty: 2000, bondAmount: 10000, creditScore: 720 },
      "Contractor License": { qty: 1500, bondAmount: 15000, creditScore: 710 },
      "Freight Broker": { qty: 800, bondAmount: 75000, creditScore: 705 },
      "Auto Dealer": { qty: 500, bondAmount: 50000, creditScore: 715 },
      "Performance Bond": { qty: 200, bondAmount: 250000, creditScore: 735 },
    },
  },
];

/**
 * Export as TSV (tab-separated). Paste directly into Excel/Google Sheets —
 * auto-splits into columns regardless of regional comma/semicolon settings.
 */
function portfolioToTSV(
  rows: {
    name: string;
    quantity: number;
    avgBondAmount: number;
    creditScore: number;
    rate: number;
    premiumPerBond: number;
    totalPremium: number;
    nickGrossPerBond: number;
    nickNetPerBond: number;
    totalNickNet: number;
    ltvPerBond: number;
    totalLTV: number;
  }[],
  totals: {
    totalBonds: number;
    totalPremium: number;
    totalNickGross: number;
    totalNickNet: number;
    totalLTV: number;
  },
  timeframe: Timeframe,
  years: number,
) {
  const SEP = "\t";
  const header = [
    "Bond type",
    "Quantity",
    "Bond amount",
    "Credit score",
    "Rate",
    "Premium/bond",
    "Total premium",
    "Nick gross/bond",
    "Nick net/bond",
    `Total Nick net (${timeframe})`,
    `LTV/bond (${years}y)`,
    `Total LTV (${years}y)`,
  ];
  const body = rows.map((r) =>
    [
      r.name,
      r.quantity,
      r.avgBondAmount,
      r.creditScore,
      (r.rate * 100).toFixed(2) + "%",
      r.premiumPerBond.toFixed(2),
      r.totalPremium.toFixed(2),
      r.nickGrossPerBond.toFixed(2),
      r.nickNetPerBond.toFixed(2),
      r.totalNickNet.toFixed(2),
      r.ltvPerBond.toFixed(2),
      r.totalLTV.toFixed(2),
    ].join(SEP),
  );
  const footer = [
    [
      "TOTAL",
      totals.totalBonds,
      "",
      "",
      "",
      "",
      totals.totalPremium.toFixed(2),
      "",
      "",
      totals.totalNickNet.toFixed(2),
      "",
      totals.totalLTV.toFixed(2),
    ].join(SEP),
  ];
  return [header.join(SEP), ...body, ...footer].join("\n");
}

function SnapshotRow({
  label,
  before,
  after,
}: {
  label: string;
  before: number;
  after: number;
}) {
  const delta = after - before;
  const pctDelta = before !== 0 ? (delta / before) * 100 : 0;
  const positive = delta >= 0;
  return (
    <div className="rounded-md border bg-background p-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-xs text-muted-foreground line-through">
          {money(before)}
        </span>
        <span className="text-lg font-semibold">{money(after)}</span>
      </div>
      <p
        className={`text-xs mt-1 font-medium ${
          positive
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-rose-600 dark:text-rose-400"
        }`}
      >
        {positive ? "+" : ""}
        {money(delta)} ({positive ? "+" : ""}
        {pctDelta.toFixed(1)}%)
      </p>
    </div>
  );
}

export default function Panel1Page() {
  const [bondTypes, setBondTypes] = useState<BondType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Shared store state (flows across panels) ───
  const mode = useSuretyStore((s) => s.mode);
  const setMode = useSuretyStore((s) => s.setMode);
  const portfolio = useSuretyStore((s) => s.portfolio);
  const setPortfolio = useSuretyStore((s) => s.setPortfolio);
  const subAgentOverride = useSuretyStore((s) => s.subAgentOverride);
  const setSubAgentOverride = useSuretyStore((s) => s.setSubAgentOverride);
  const primaryCommission = useSuretyStore((s) => s.primaryCommission);
  const setPrimaryCommission = useSuretyStore((s) => s.setPrimaryCommission);
  const cacPct = useSuretyStore((s) => s.cacPct);
  const setCacPct = useSuretyStore((s) => s.setCacPct);
  const opexPct = useSuretyStore((s) => s.opexPct);
  const setOpexPct = useSuretyStore((s) => s.setOpexPct);
  const timeHorizonYears = useSuretyStore((s) => s.timeHorizonYears);
  const setTimeHorizonYears = useSuretyStore((s) => s.setTimeHorizonYears);

  // ─── Panel 1 local state ───
  const [view, setView] = useState<View>("single");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [bondAmount, setBondAmount] = useState(100000);
  const [creditScore, setCreditScore] = useState(720);
  const [nextUid, setNextUid] = useState(1);
  const teamPct = 0.003;
  const [timeframe, setTimeframe] = useState<Timeframe>("monthly");
  const timeMultiplier = timeframe === "annual" ? 12 : 1;
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("bond_types")
      .select("*")
      .order("id")
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else {
          const types = data as BondType[];
          setBondTypes(types);
          if (types && types.length > 0) {
            setSelectedId(types[0].id);
            // Seed portfolio only if it's empty (store is persisted)
            if (portfolio.length === 0) {
              setPortfolio([
                {
                  uid: 1,
                  bondTypeId: types[0].id,
                  bondAmount: 100000,
                  creditScore: 720,
                  quantity: 100,
                },
              ]);
              setNextUid(2);
            } else {
              // Ensure nextUid is higher than any existing uid
              setNextUid(Math.max(...portfolio.map((b) => b.uid)) + 1);
            }
          }
        }
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nickTakeRate = mode === "sub-agent" ? subAgentOverride : primaryCommission;
  const primaryTakeRate = mode === "sub-agent" ? PRIMARY_AGENCY_COMMISSION : 0;
  const channelTotal = nickTakeRate + primaryTakeRate;
  const carrierRetention = 1 - channelTotal;
  const upsideMultiplier = primaryCommission / subAgentOverride;

  // ========== SINGLE BOND COMPUTATION ==========
  const selected = bondTypes.find((b) => b.id === selectedId) || null;
  const singleCalc = useMemo(() => {
    if (!selected) return null;
    const { rate, premium } = computePremium(selected, bondAmount, creditScore);
    const nickGross = premium * nickTakeRate;
    const nickCAC = premium * cacPct;
    const nickOpex = premium * opexPct;
    const nickTeam = premium * teamPct;
    const nickNet = nickGross - nickCAC - nickOpex - nickTeam;
    return {
      rate,
      premium,
      nickGross,
      nickCAC,
      nickOpex,
      nickTeam,
      nickNet,
      netMargin: nickNet / premium,
    };
  }, [selected, bondAmount, creditScore, nickTakeRate, cacPct, opexPct]);

  // ========== PORTFOLIO COMPUTATION ==========
  const portfolioCalc = useMemo(() => {
    let totalPremium = 0;
    let totalNickGross = 0;
    let totalNickCAC = 0;
    let totalNickOpex = 0;
    let totalNickTeam = 0;
    let totalBonds = 0;
    let totalLTV = 0;
    const rows: {
      uid: number;
      name: string;
      quantity: number;
      avgBondAmount: number;
      creditScore: number;
      rate: number;
      premiumPerBond: number;
      totalPremium: number;
      nickGrossPerBond: number;
      nickNetPerBond: number;
      totalNickNet: number;
      renewalRate: number;
      ltvMult: number;
      ltvPerBond: number;
      totalLTV: number;
    }[] = [];

    for (const b of portfolio) {
      const bondType = bondTypes.find((bt) => bt.id === b.bondTypeId);
      if (!bondType) continue;
      const { rate, premium } = computePremium(bondType, b.bondAmount, b.creditScore);
      const qty = b.quantity * timeMultiplier;
      const premiumTotal = premium * qty;
      const nickGrossPerBond = premium * nickTakeRate;
      const nickCAC = premium * cacPct;
      const nickOpex = premium * opexPct;
      const nickTeam = premium * teamPct;
      const nickNetPerBond = nickGrossPerBond - nickCAC - nickOpex - nickTeam;

      const renewalRate = Number(bondType.renewal_rate);
      const ltvMult = ltvMultiplier(renewalRate, timeHorizonYears);
      const ltvPerBond = nickNetPerBond * ltvMult;

      totalPremium += premiumTotal;
      totalNickGross += nickGrossPerBond * qty;
      totalNickCAC += nickCAC * qty;
      totalNickOpex += nickOpex * qty;
      totalNickTeam += nickTeam * qty;
      totalBonds += qty;
      totalLTV += ltvPerBond * qty;

      rows.push({
        uid: b.uid,
        name: bondType.name,
        quantity: b.quantity,
        avgBondAmount: b.bondAmount,
        creditScore: b.creditScore,
        rate,
        premiumPerBond: premium,
        totalPremium: premiumTotal,
        nickGrossPerBond,
        nickNetPerBond,
        totalNickNet: nickNetPerBond * qty,
        renewalRate,
        ltvMult,
        ltvPerBond,
        totalLTV: ltvPerBond * qty,
      });
    }

    const totalNickNet = totalNickGross - totalNickCAC - totalNickOpex - totalNickTeam;

    return {
      rows,
      totalBonds,
      totalPremium,
      totalNickGross,
      totalNickNet,
      totalLTV,
      blendedMargin: totalPremium > 0 ? totalNickNet / totalPremium : 0,
    };
  }, [portfolio, bondTypes, nickTakeRate, cacPct, opexPct, timeMultiplier, timeHorizonYears]);

  // Portfolio actions
  const addPortfolioBond = () => {
    if (bondTypes.length === 0) return;
    setPortfolio([
      ...portfolio,
      {
        uid: nextUid,
        bondTypeId: bondTypes[0].id,
        bondAmount: 50000,
        creditScore: 720,
        quantity: 50,
      },
    ]);
    setNextUid(nextUid + 1);
  };

  const updatePortfolioBond = (uid: number, patch: Partial<PortfolioBond>) => {
    setPortfolio(portfolio.map((b) => (b.uid === uid ? { ...b, ...patch } : b)));
  };

  const removePortfolioBond = (uid: number) => {
    setPortfolio(portfolio.filter((b) => b.uid !== uid));
  };

  const addCurrentSingleToPortfolio = () => {
    if (!selectedId) return;
    setPortfolio([
      ...portfolio,
      {
        uid: nextUid,
        bondTypeId: selectedId,
        bondAmount,
        creditScore,
        quantity: 100,
      },
    ]);
    setNextUid(nextUid + 1);
    setView("portfolio");
  };

  // Feature B: Load preset portfolio
  const loadPreset = (preset: (typeof PRESETS)[number]) => {
    const newBonds: PortfolioBond[] = [];
    let uid = nextUid;
    for (const [bondName, cfg] of Object.entries(preset.mix)) {
      const bt = bondTypes.find((b) => b.name === bondName);
      if (!bt) continue;
      newBonds.push({
        uid: uid++,
        bondTypeId: bt.id,
        bondAmount: cfg.bondAmount,
        creditScore: cfg.creditScore,
        quantity: cfg.qty,
      });
    }
    setPortfolio(newBonds);
    setNextUid(uid);
  };

  // Feature D: Save / load snapshot
  const saveSnapshot = (label: string) => {
    setSnapshot({
      label,
      mode,
      subAgentOverride,
      primaryCommission,
      cacPct,
      opexPct,
      totalPremium: portfolioCalc.totalPremium,
      totalNickGross: portfolioCalc.totalNickGross,
      totalNickNet: portfolioCalc.totalNickNet,
      timeframe,
    });
  };

  // Feature E: Copy as TSV to clipboard (tab-separated → pastes cleanly in Excel/Sheets)
  const copyForSheets = async () => {
    const tsv = portfolioToTSV(
      portfolioCalc.rows,
      {
        totalBonds: portfolioCalc.totalBonds,
        totalPremium: portfolioCalc.totalPremium,
        totalNickGross: portfolioCalc.totalNickGross,
        totalNickNet: portfolioCalc.totalNickNet,
        totalLTV: portfolioCalc.totalLTV,
      },
      timeframe,
      timeHorizonYears,
    );
    try {
      await navigator.clipboard.writeText(tsv);
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      const blob = new Blob([tsv], { type: "text/tab-separated-values" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
  };

  // ========== PORTFOLIO AGGREGATE WATERFALL DATA ==========
  const portfolioWaterfall = useMemo(() => {
    const p = portfolioCalc.totalPremium;
    const carrier = p * carrierRetention;
    const primaryAg = p * primaryTakeRate;
    const nickGross = p * nickTakeRate;
    const cac = portfolioCalc.totalPremium * cacPct;
    const opex = portfolioCalc.totalPremium * opexPct;
    const team = portfolioCalc.totalPremium * teamPct;
    const net = nickGross - cac - opex - team;
    return { p, carrier, primaryAg, nickGross, cac, opex, team, net };
  }, [portfolioCalc.totalPremium, carrierRetention, primaryTakeRate, nickTakeRate, cacPct, opexPct]);

  // ========== CHART DATA (single bond) ==========
  const chartData = singleCalc
    ? {
        labels: ["Premium split", "Channel breakdown", "Nick's cut"],
        datasets: [
          {
            label: "Carrier retention",
            data: [singleCalc.premium * carrierRetention, 0, 0],
            backgroundColor: "#1e3a8a",
            stack: "wf",
          },
          {
            label: "Primary agency",
            data: [0, singleCalc.premium * primaryTakeRate, 0],
            backgroundColor: "#0ea5e9",
            stack: "wf",
          },
          {
            label:
              mode === "sub-agent" ? "Nick (sub-agent)" : "Nick (primary agent)",
            data: [0, singleCalc.premium * nickTakeRate, 0],
            backgroundColor: "#10b981",
            stack: "wf",
          },
          {
            label: "CAC",
            data: [0, 0, singleCalc.nickCAC],
            backgroundColor: "#f59e0b",
            stack: "wf",
          },
          {
            label: "OpEx",
            data: [0, 0, singleCalc.nickOpex],
            backgroundColor: "#8b5cf6",
            stack: "wf",
          },
          {
            label: "Team",
            data: [0, 0, singleCalc.nickTeam],
            backgroundColor: "#ec4899",
            stack: "wf",
          },
          {
            label: "Nick net margin",
            data: [0, 0, singleCalc.nickNet],
            backgroundColor: "#ef4444",
            stack: "wf",
          },
        ],
      }
    : null;

  // Portfolio waterfall chart
  const portfolioChartData = {
    labels: ["Premium split", "Channel breakdown", "Nick's cut"],
    datasets: [
      {
        label: "Carrier retention",
        data: [portfolioWaterfall.carrier, 0, 0],
        backgroundColor: "#1e3a8a",
        stack: "wf",
      },
      {
        label: "Primary agency",
        data: [0, portfolioWaterfall.primaryAg, 0],
        backgroundColor: "#0ea5e9",
        stack: "wf",
      },
      {
        label:
          mode === "sub-agent" ? "Nick (sub-agent)" : "Nick (primary agent)",
        data: [0, portfolioWaterfall.nickGross, 0],
        backgroundColor: "#10b981",
        stack: "wf",
      },
      {
        label: "CAC",
        data: [0, 0, portfolioWaterfall.cac],
        backgroundColor: "#f59e0b",
        stack: "wf",
      },
      {
        label: "OpEx",
        data: [0, 0, portfolioWaterfall.opex],
        backgroundColor: "#8b5cf6",
        stack: "wf",
      },
      {
        label: "Team",
        data: [0, 0, portfolioWaterfall.team],
        backgroundColor: "#ec4899",
        stack: "wf",
      },
      {
        label: "Nick net margin",
        data: [0, 0, portfolioWaterfall.net],
        backgroundColor: "#ef4444",
        stack: "wf",
      },
    ],
  };

  const chartOptions = {
    indexAxis: "y" as const,
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const },
      title: {
        display: true,
        text: `Waterfall — from ${money(singleCalc?.premium ?? 0)} premium down to Nick's net margin`,
      },
      tooltip: {
        callbacks: {
          label: (ctx: {
            dataset: { label?: string };
            parsed: { x: number | null };
          }) => {
            const x = ctx.parsed.x ?? 0;
            if (x === 0) return "";
            return `${ctx.dataset.label}: ${money(x)}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: { callback: (v: string | number) => money(Number(v)) },
      },
      y: { stacked: true },
    },
  };

  return (
    <div className="mx-auto max-w-6xl p-6 md:p-10 space-y-8">
      <header className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-sky-600 font-semibold">
              Panel 1
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Unit Economics Waterfall
            </h1>
          </div>
          <a
            href="https://buysuretybonds.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm hover:bg-muted transition"
          >
            View on BuySuretyBonds.com
            <span aria-hidden>→</span>
          </a>
        </div>
        <p className="text-muted-foreground">
          How each premium dollar splits across the value chain — and how much
          Nick captures today (sub-agent) vs. tomorrow (primary agent).
        </p>
      </header>

      {/* Mode + view toggles */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1 rounded-lg border p-1 w-fit">
          <button
            onClick={() => setMode("sub-agent")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              mode === "sub-agent"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            Sub-agent (today)
          </button>
          <button
            onClick={() => setMode("primary-agent")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              mode === "primary-agent"
                ? "bg-emerald-600 text-white"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            Primary agent (future) 🚀
          </button>
        </div>

        <div className="flex gap-1 rounded-lg border p-1 w-fit">
          <button
            onClick={() => setView("single")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              view === "single"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            Single bond
          </button>
          <button
            onClick={() => setView("portfolio")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              view === "portfolio"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            Portfolio
          </button>
        </div>

        {view === "portfolio" && (
          <div className="flex gap-1 rounded-lg border p-1 w-fit">
            <button
              onClick={() => setTimeframe("monthly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                timeframe === "monthly"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeframe("annual")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                timeframe === "annual"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Annual (×12)
            </button>
          </div>
        )}
      </div>

      {loading && <p>Loading bond types…</p>}
      {error && (
        <p className="text-red-600">
          Supabase error: {error}
        </p>
      )}

      {/* ============================================================== */}
      {/* SINGLE BOND VIEW                                                 */}
      {/* ============================================================== */}
      {!loading && !error && view === "single" && singleCalc && selected && (
        <>
          <section className="grid gap-4 md:grid-cols-5">
            <MetricCard
              label="Premium (customer pays)"
              value={money(singleCalc.premium)}
              sublabel={`${pct(singleCalc.rate, 2)} of ${money(bondAmount)} bond`}
            />
            <MetricCard
              label="Nick gross revenue"
              value={money(singleCalc.nickGross)}
              sublabel={`${pct(nickTakeRate)} of premium`}
              accent="sky"
            />
            <MetricCard
              label="Nick net income"
              value={money(singleCalc.nickNet)}
              sublabel="after CAC + OpEx + team"
              accent="emerald"
            />
            <MetricCard
              label="Net margin on premium"
              value={pct(singleCalc.netMargin, 1)}
            />
            <MetricCard
              label="Upside vs sub-agent"
              value={mode === "primary-agent" ? `${upsideMultiplier.toFixed(1)}x` : "—"}
              sublabel={
                mode === "primary-agent"
                  ? "regulatory unlock"
                  : "switch to primary mode"
              }
              accent={mode === "primary-agent" ? "emerald" : undefined}
            />
          </section>

          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <div className="space-y-5 rounded-lg border p-5">
              <div>
                <label className="block text-sm font-medium mb-1">Bond type</label>
                <select
                  value={selectedId ?? ""}
                  onChange={(e) => setSelectedId(Number(e.target.value))}
                  className="w-full rounded-md border px-3 py-2 bg-background"
                >
                  {bondTypes.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.category})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Base rate {(Number(selected.avg_premium_rate) * 100).toFixed(2)}% ·
                  Renewal {(Number(selected.renewal_rate) * 100).toFixed(0)}%
                </p>
              </div>

              <NumberSliderInput
                label="Bond amount"
                value={bondAmount}
                min={5000}
                max={500000}
                step={1000}
                onChange={setBondAmount}
                suffix="USD"
                sublabel={money(bondAmount)}
              />
              <NumberSliderInput
                label="Credit score"
                value={creditScore}
                min={550}
                max={800}
                step={10}
                onChange={setCreditScore}
                sublabel={`${creditMultiplier(creditScore).toFixed(2)}x rate mult.`}
              />

              <div className="h-px bg-border" />

              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Editable assumptions
              </p>

              {mode === "sub-agent" ? (
                <NumberSliderInput
                  label="Sub-agent override"
                  value={subAgentOverride * 100}
                  min={1}
                  max={8}
                  step={0.5}
                  onChange={(v) => setSubAgentOverride(v / 100)}
                  suffix="%"
                />
              ) : (
                <NumberSliderInput
                  label="Primary commission"
                  value={primaryCommission * 100}
                  min={10}
                  max={20}
                  step={0.5}
                  onChange={(v) => setPrimaryCommission(v / 100)}
                  suffix="%"
                />
              )}
              <NumberSliderInput
                label="CAC (% of premium)"
                value={cacPct * 100}
                min={0.5}
                max={3}
                step={0.1}
                onChange={(v) => setCacPct(v / 100)}
                suffix="%"
              />
              <NumberSliderInput
                label="Platform OpEx (% of premium)"
                value={opexPct * 100}
                min={0.1}
                max={1}
                step={0.05}
                onChange={(v) => setOpexPct(v / 100)}
                suffix="%"
              />
              <NumberSliderInput
                label="LTV horizon (years)"
                value={timeHorizonYears}
                min={1}
                max={10}
                step={1}
                onChange={setTimeHorizonYears}
                suffix="yr"
                sublabel="drives LTV & Panel 2 projection"
              />

              <div className="h-px bg-border" />

              <button
                onClick={addCurrentSingleToPortfolio}
                className="w-full rounded-md bg-sky-600 text-white px-4 py-2 text-sm font-medium hover:bg-sky-700 transition"
              >
                + Add this bond to portfolio
              </button>
              <p className="text-xs text-muted-foreground text-center">
                Copies current bond type, amount and credit score into the
                portfolio with quantity = 100 (editable after).
              </p>
            </div>

            <div className="rounded-lg border p-5">
              {chartData && <Bar data={chartData} options={chartOptions} />}

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b">
                  <span className="font-medium">Total premium</span>
                  <span className="font-mono font-semibold">
                    {money(singleCalc.premium)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>├─ Carrier retention ({pct(carrierRetention)})</span>
                  <span className="font-mono">
                    {money(singleCalc.premium * carrierRetention)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>└─ Channel commission ({pct(channelTotal)})</span>
                  <span className="font-mono">
                    {money(singleCalc.premium * channelTotal)}
                  </span>
                </div>
                {mode === "sub-agent" && (
                  <div className="flex justify-between text-muted-foreground pl-4">
                    <span>
                      &nbsp;&nbsp;&nbsp;&nbsp;├─ Primary agency (
                      {pct(PRIMARY_AGENCY_COMMISSION)})
                    </span>
                    <span className="font-mono">
                      {money(singleCalc.premium * PRIMARY_AGENCY_COMMISSION)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pl-4 text-sky-600 dark:text-sky-400 font-medium">
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;└─ Nick{" "}
                    {mode === "sub-agent" ? "sub-agent" : "primary"} ({pct(nickTakeRate)})
                  </span>
                  <span className="font-mono">{money(singleCalc.nickGross)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground pl-8">
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;├─ CAC</span>
                  <span className="font-mono">−{money(singleCalc.nickCAC)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground pl-8">
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;├─ OpEx</span>
                  <span className="font-mono">−{money(singleCalc.nickOpex)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground pl-8">
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;├─ Team</span>
                  <span className="font-mono">−{money(singleCalc.nickTeam)}</span>
                </div>
                <div className="flex justify-between pl-8 text-emerald-600 dark:text-emerald-400 font-semibold pt-1 border-t">
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;└─ Nick net income</span>
                  <span className="font-mono">{money(singleCalc.nickNet)}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ============================================================== */}
      {/* PORTFOLIO VIEW                                                   */}
      {/* ============================================================== */}
      {!loading && !error && view === "portfolio" && (
        <>
          <section className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <MetricCard
              label={`Total bonds (${timeframe === "annual" ? "yr" : "mo"})`}
              value={portfolioCalc.totalBonds.toLocaleString()}
            />
            <MetricCard
              label={`Premium volume (${timeframe === "annual" ? "yr" : "mo"})`}
              value={money(portfolioCalc.totalPremium)}
              sublabel="customer pays total"
            />
            <MetricCard
              label={`Nick gross (${timeframe === "annual" ? "yr" : "mo"})`}
              value={money(portfolioCalc.totalNickGross)}
              accent="sky"
            />
            <MetricCard
              label={`Nick net (${timeframe === "annual" ? "yr" : "mo"})`}
              value={money(portfolioCalc.totalNickNet)}
              accent="emerald"
            />
            <MetricCard
              label={`LTV (${timeHorizonYears}y book)`}
              value={money(portfolioCalc.totalLTV)}
              sublabel={`${timeHorizonYears}y compounded net`}
              accent="amber"
            />
            <MetricCard
              label="Blended margin"
              value={pct(portfolioCalc.blendedMargin, 2)}
              sublabel="on premium"
            />
          </section>

          {/* Snapshot comparison card — always visible with CTA when empty */}
          <div className="rounded-lg border border-sky-600/30 bg-sky-50 dark:bg-sky-950/20 p-5">
            {!snapshot ? (
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-sm uppercase tracking-widest text-sky-700 dark:text-sky-400 font-semibold mb-1">
                    📸 Scenario comparison
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Save a snapshot of the current numbers, then change something
                    (mode, override %, CAC, assumptions) to see the delta side
                    by side. Useful for demo: save in sub-agent, switch to
                    primary, see the 5x unlock in dollars.
                  </p>
                </div>
                <button
                  onClick={() =>
                    saveSnapshot(
                      mode === "sub-agent"
                        ? "Sub-agent baseline"
                        : "Primary baseline",
                    )
                  }
                  disabled={portfolio.length === 0}
                  className="rounded-md bg-sky-600 text-white px-4 py-2 text-sm font-medium hover:bg-sky-700 transition disabled:opacity-50 shrink-0"
                >
                  📸 Save snapshot now
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <p className="text-sm uppercase tracking-widest text-sky-700 dark:text-sky-400 font-semibold">
                      📸 Snapshot: &ldquo;{snapshot.label}&rdquo; vs current
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Saved as {snapshot.mode === "sub-agent" ? "sub-agent" : "primary"}{" "}
                      · {snapshot.timeframe} · Change mode or assumptions to see
                      the delta.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        saveSnapshot(
                          mode === "sub-agent"
                            ? "Sub-agent baseline"
                            : "Primary baseline",
                        )
                      }
                      className="rounded-md border bg-background px-3 py-1.5 text-xs hover:bg-muted transition"
                    >
                      Replace snapshot
                    </button>
                    <button
                      onClick={() => setSnapshot(null)}
                      className="rounded-md border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted transition"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3 text-sm">
                  <SnapshotRow
                    label="Total premium"
                    before={snapshot.totalPremium}
                    after={portfolioCalc.totalPremium}
                  />
                  <SnapshotRow
                    label="Nick gross"
                    before={snapshot.totalNickGross}
                    after={portfolioCalc.totalNickGross}
                  />
                  <SnapshotRow
                    label="Nick net"
                    before={snapshot.totalNickNet}
                    after={portfolioCalc.totalNickNet}
                  />
                </div>
              </>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <div className="space-y-5 rounded-lg border p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Global assumptions
              </p>
              {mode === "sub-agent" ? (
                <NumberSliderInput
                  label="Sub-agent override"
                  value={subAgentOverride * 100}
                  min={1}
                  max={8}
                  step={0.5}
                  onChange={(v) => setSubAgentOverride(v / 100)}
                  suffix="%"
                />
              ) : (
                <NumberSliderInput
                  label="Primary commission"
                  value={primaryCommission * 100}
                  min={10}
                  max={20}
                  step={0.5}
                  onChange={(v) => setPrimaryCommission(v / 100)}
                  suffix="%"
                />
              )}
              <NumberSliderInput
                label="CAC (% of premium)"
                value={cacPct * 100}
                min={0.5}
                max={3}
                step={0.1}
                onChange={(v) => setCacPct(v / 100)}
                suffix="%"
              />
              <NumberSliderInput
                label="Platform OpEx (% of premium)"
                value={opexPct * 100}
                min={0.1}
                max={1}
                step={0.05}
                onChange={(v) => setOpexPct(v / 100)}
                suffix="%"
              />
              <NumberSliderInput
                label="LTV / projection horizon (years)"
                value={timeHorizonYears}
                min={1}
                max={10}
                step={1}
                onChange={setTimeHorizonYears}
                suffix="yr"
                sublabel="shared with Panel 2"
              />

              <div className="h-px bg-border" />

              <p className="text-xs text-muted-foreground">
                Add multiple bond configurations below. Each row can have its own
                bond type, amount, credit score, and quantity. Totals at the top
                aggregate all rows using the global assumptions above.
              </p>
            </div>

            <div className="rounded-lg border p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-semibold">Bond portfolio</h3>
                  <p className="text-xs text-muted-foreground">
                    Add multiple bond configurations; totals aggregate at the top.
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={addPortfolioBond}
                    className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted transition"
                  >
                    + Add bond
                  </button>
                  <button
                    onClick={copyForSheets}
                    disabled={portfolio.length === 0}
                    title="Copy as tab-separated values. Paste directly into Excel or Google Sheets — auto-splits into columns."
                    className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted transition disabled:opacity-50"
                  >
                    {copyStatus === "copied" ? "✓ Copied for Excel" : "📋 Copy for Excel"}
                  </button>
                </div>
              </div>

              {/* Presets with inline explanation */}
              <div className="rounded-md border bg-muted/30 p-4">
                <div className="mb-3">
                  <p className="text-sm font-semibold">
                    ⚡ Quick-load a realistic scenario
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Each preset fills the table with a typical bond mix at that
                    volume. Useful for pitching: show Nick how the numbers look
                    at each stage of the business. All quantities are per-month.
                  </p>
                </div>
                <div className="grid gap-2 md:grid-cols-3">
                  {PRESETS.map((p) => {
                    const totalMonthly = Object.values(p.mix).reduce(
                      (s, x) => s + x.qty,
                      0,
                    );
                    return (
                      <button
                        key={p.label}
                        onClick={() => loadPreset(p)}
                        className="rounded-md bg-background border px-3 py-2 text-xs hover:border-sky-500 transition text-left"
                      >
                        <span className="font-medium block">{p.label}</span>
                        <span className="block text-[10px] text-muted-foreground mt-0.5">
                          {totalMonthly.toLocaleString()} bonds/mo
                        </span>
                        <span className="block text-[10px] text-muted-foreground">
                          {p.description.split(" · ")[1]}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 text-[11px] text-muted-foreground space-y-1">
                  <p>
                    <strong>Small agency:</strong> A single broker/owner handling
                    ~100 bonds/month in one state — e.g. a local insurance shop
                    that sells surety as a side product.
                  </p>
                  <p>
                    <strong>Mid-market:</strong> A multi-state agency doing ~1,000
                    bonds/month with a full team and some tech — typical
                    independent surety shop.
                  </p>
                  <p>
                    <strong>BuySuretyBonds scale:</strong> A national DTC
                    marketplace processing ~5,000 bonds/month — Nick&apos;s
                    target operating scale.
                  </p>
                </div>
              </div>

              {/* LTV help */}
              <details className="rounded-md border bg-muted/30 px-3 py-2 text-xs">
                <summary className="cursor-pointer font-medium">
                  💡 What is LTV and why it matters
                </summary>
                <div className="mt-2 space-y-1 text-muted-foreground">
                  <p>
                    <strong>LTV (Lifetime Value)</strong> = the total net profit
                    Nick makes from a single bond across {timeHorizonYears} years,
                    including renewals. Because surety bonds renew yearly at
                    75–88% (commercial) or ~60% (contract), each bond generates
                    revenue long after year 1.
                  </p>
                  <p>
                    <strong>Formula:</strong> LTV = net/bond ×{" "}
                    Σ(y=0..{timeHorizonYears - 1}) r^y where r = renewal_rate × (1 −{" "}
                    {pct(LTV_CHURN)} churn). Currently summed over {timeHorizonYears}{" "}
                    years.
                  </p>
                  <p>
                    <strong>Why it matters:</strong> an agency valued on year-1
                    revenue looks small. Valued on LTV, the same book is 2–3x
                    bigger. That&apos;s the argument for a higher valuation
                    multiple in surety than in one-shot broker businesses.
                  </p>
                </div>
              </details>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                      <th className="pb-2 pr-2">Bond type</th>
                      <th className="pb-2 pr-2">Qty/mo</th>
                      <th className="pb-2 pr-2">Bond amt</th>
                      <th className="pb-2 pr-2">Score</th>
                      <th className="pb-2 pr-2 text-right">Premium/bond</th>
                      <th className="pb-2 pr-2 text-right">Nick net/bond</th>
                      <th className="pb-2 pr-2 text-right">
                        Total net ({timeframe === "annual" ? "yr" : "mo"})
                      </th>
                      <th
                        className="pb-2 pr-2 text-right"
                        title={`Lifetime Value per bond over ${timeHorizonYears} years using its renewal rate and ${pct(LTV_CHURN)} annual churn`}
                      >
                        LTV/bond ({timeHorizonYears}y)
                      </th>
                      <th className="pb-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioCalc.rows.map((row) => {
                      const b = portfolio.find((p) => p.uid === row.uid)!;
                      return (
                        <tr key={row.uid} className="border-b hover:bg-muted/30">
                          <td className="py-2 pr-2">
                            <select
                              value={b.bondTypeId}
                              onChange={(e) =>
                                updatePortfolioBond(row.uid, {
                                  bondTypeId: Number(e.target.value),
                                })
                              }
                              className="rounded-md border px-2 py-1 bg-background text-sm w-full"
                            >
                              {bondTypes.map((bt) => (
                                <option key={bt.id} value={bt.id}>
                                  {bt.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-2 pr-2">
                            <TableNumberInput
                              value={b.quantity}
                              min={0}
                              onChange={(v) =>
                                updatePortfolioBond(row.uid, { quantity: v })
                              }
                              className="w-20 rounded-md border px-2 py-1 bg-background text-sm text-right"
                            />
                          </td>
                          <td className="py-2 pr-2">
                            <TableNumberInput
                              value={b.bondAmount}
                              min={0}
                              onChange={(v) =>
                                updatePortfolioBond(row.uid, { bondAmount: v })
                              }
                              className="w-28 rounded-md border px-2 py-1 bg-background text-sm text-right"
                            />
                          </td>
                          <td className="py-2 pr-2">
                            <TableNumberInput
                              value={b.creditScore}
                              min={300}
                              max={850}
                              onChange={(v) =>
                                updatePortfolioBond(row.uid, { creditScore: v })
                              }
                              className="w-20 rounded-md border px-2 py-1 bg-background text-sm text-right"
                            />
                          </td>
                          <td className="py-2 pr-2 text-right font-mono">
                            {money(row.premiumPerBond)}
                          </td>
                          <td className="py-2 pr-2 text-right font-mono text-emerald-600 dark:text-emerald-400">
                            {money(row.nickNetPerBond)}
                          </td>
                          <td className="py-2 pr-2 text-right font-mono font-semibold">
                            {money(row.totalNickNet)}
                          </td>
                          <td
                            className="py-2 pr-2 text-right font-mono text-amber-600 dark:text-amber-400"
                            title={`Renewal rate ${pct(row.renewalRate)} → ${row.ltvMult.toFixed(2)}x multiplier`}
                          >
                            {money(row.ltvPerBond)}
                          </td>
                          <td className="py-2">
                            <button
                              onClick={() => removePortfolioBond(row.uid)}
                              className="text-muted-foreground hover:text-red-600 transition text-xs"
                              aria-label="Remove"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="font-semibold">
                      <td className="pt-3" colSpan={2}>
                        Total ({portfolioCalc.totalBonds.toLocaleString()} bonds/
                        {timeframe === "annual" ? "yr" : "mo"})
                      </td>
                      <td colSpan={2}></td>
                      <td className="pt-3 pr-2 text-right font-mono">
                        {money(portfolioCalc.totalPremium)}
                      </td>
                      <td></td>
                      <td className="pt-3 pr-2 text-right font-mono text-emerald-600 dark:text-emerald-400">
                        {money(portfolioCalc.totalNickNet)}
                      </td>
                      <td className="pt-3 pr-2 text-right font-mono text-amber-600 dark:text-amber-400">
                        {money(portfolioCalc.totalLTV)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {portfolio.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No bonds in the portfolio yet. Click &quot;Add bond&quot; to start.
                </p>
              )}
            </div>
          </div>

          {/* Portfolio aggregate waterfall */}
          {portfolio.length > 0 && portfolioCalc.totalPremium > 0 && (
            <div className="rounded-lg border p-5">
              <h3 className="font-semibold mb-4">
                Aggregate waterfall — entire portfolio
              </h3>
              <Bar
                data={portfolioChartData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: true,
                      text: `Portfolio waterfall — ${money(portfolioCalc.totalPremium)} total premium → ${money(portfolioWaterfall.net)} Nick net`,
                    },
                  },
                }}
              />
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b">
                  <span className="font-medium">
                    Total premium ({portfolioCalc.totalBonds.toLocaleString()}{" "}
                    bonds)
                  </span>
                  <span className="font-mono font-semibold">
                    {money(portfolioCalc.totalPremium)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>├─ Carrier retention ({pct(carrierRetention)})</span>
                  <span className="font-mono">
                    {money(portfolioWaterfall.carrier)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>└─ Channel commission ({pct(channelTotal)})</span>
                  <span className="font-mono">
                    {money(portfolioCalc.totalPremium * channelTotal)}
                  </span>
                </div>
                {mode === "sub-agent" && (
                  <div className="flex justify-between text-muted-foreground pl-4">
                    <span>
                      &nbsp;&nbsp;&nbsp;&nbsp;├─ Primary agency (
                      {pct(PRIMARY_AGENCY_COMMISSION)})
                    </span>
                    <span className="font-mono">
                      {money(portfolioWaterfall.primaryAg)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pl-4 text-sky-600 dark:text-sky-400 font-medium">
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;└─ Nick{" "}
                    {mode === "sub-agent" ? "sub-agent" : "primary"} (
                    {pct(nickTakeRate)})
                  </span>
                  <span className="font-mono">
                    {money(portfolioWaterfall.nickGross)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground pl-8">
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;├─ CAC ({pct(cacPct, 2)})</span>
                  <span className="font-mono">−{money(portfolioWaterfall.cac)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground pl-8">
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;├─ OpEx ({pct(opexPct, 2)})
                  </span>
                  <span className="font-mono">−{money(portfolioWaterfall.opex)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground pl-8">
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;├─ Team ({pct(teamPct, 2)})
                  </span>
                  <span className="font-mono">−{money(portfolioWaterfall.team)}</span>
                </div>
                <div className="flex justify-between pl-8 text-emerald-600 dark:text-emerald-400 font-semibold pt-1 border-t">
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;└─ Nick net income</span>
                  <span className="font-mono">
                    {money(portfolioWaterfall.net)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Impact of transition box — visible in both views */}
      {!loading && !error && (
        <div className="rounded-lg border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/20 p-5">
          <p className="text-sm uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold mb-2">
            🚀 The sub-agent → primary agent unlock
          </p>
          <p className="text-sm">
            {view === "portfolio" ? (
              <>
                Over this portfolio of {portfolioCalc.totalBonds.toLocaleString()}{" "}
                bonds ({timeframe}), Nick{" "}
                {mode === "sub-agent" ? "currently makes" : "would make as sub-agent"}{" "}
                <strong>
                  {money(portfolioCalc.totalPremium * subAgentOverride)}
                </strong>{" "}
                in gross revenue. As primary agent, gross revenue jumps to{" "}
                <strong>
                  {money(portfolioCalc.totalPremium * primaryCommission)}
                </strong>{" "}
                — a <strong>{upsideMultiplier.toFixed(1)}x multiplier</strong>,{" "}
                <strong>
                  +
                  {money(
                    portfolioCalc.totalPremium *
                      (primaryCommission - subAgentOverride),
                  )}
                </strong>{" "}
                without moving a single operational variable.{" "}
                <span className="text-muted-foreground">
                  (LTV impact over {timeHorizonYears} years:{" "}
                  <strong className="text-foreground">
                    {money(
                      (portfolioCalc.totalLTV * primaryCommission) / nickTakeRate,
                    )}
                  </strong>{" "}
                  if Nick moves to primary now.)
                </span>
              </>
            ) : mode === "sub-agent" ? (
              <>
                Nick currently earns{" "}
                <strong>{money((singleCalc?.premium ?? 0) * subAgentOverride)}</strong>{" "}
                per bond as sub-agent. Once the licenses are completed and Nick moves
                to primary agent, he captures the full 15% channel commission →{" "}
                <strong>
                  {money((singleCalc?.premium ?? 0) * primaryCommission)}
                </strong>{" "}
                per bond. That&apos;s a{" "}
                <strong>{upsideMultiplier.toFixed(1)}x multiplier</strong> in revenue
                per bond with no volume change. Over 5,000 bonds/month,{" "}
                <strong>
                  +
                  {money(
                    (singleCalc?.premium ?? 0) *
                      (primaryCommission - subAgentOverride) *
                      5000,
                  )}
                </strong>{" "}
                in monthly revenue.
              </>
            ) : (
              <>
                In primary-agent mode, Nick captures the full{" "}
                <strong>{pct(primaryCommission)}</strong> channel commission. Over
                5,000 bonds/month, that&apos;s{" "}
                <strong>
                  {money((singleCalc?.premium ?? 0) * primaryCommission * 5000)}
                </strong>
                /mo — a <strong>{upsideMultiplier.toFixed(1)}x</strong> over the
                sub-agent model, without changing a single operational variable.
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
