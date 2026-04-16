import Link from "next/link";

const PANELS = [
  {
    href: "/panel1",
    number: "01",
    title: "Unit Economics Waterfall",
    pitch:
      "Cómo se reparte cada dólar de premium — y por qué pasar de sub-agent a primary agent es un unlock 5x sin mover volumen.",
    question: "How does each premium dollar break down?",
    accent: "from-amber-500/20 via-amber-500/5 to-transparent",
    border: "border-amber-500/20 hover:border-amber-500/60",
  },
  {
    href: "/panel2",
    number: "02",
    title: "Renewal Revenue Engine",
    pitch:
      "Cohort-based model. Al mes 60, ~70% del revenue son renovaciones de bonds vendidos en años anteriores. SaaS economics con demanda obligatoria por ley.",
    question: "Why does this business compound?",
    accent: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    border: "border-emerald-500/20 hover:border-emerald-500/60",
  },
  {
    href: "/panel3",
    number: "03",
    title: "Carrier Pitch · Before & After",
    pitch:
      "ROI cuantitativo para carriers integrándose con BondGenius + cuánto captura Nick. Plus AI chat con datos reales del mercado.",
    question: "Why would a carrier integrate?",
    accent: "from-sky-500/20 via-sky-500/5 to-transparent",
    border: "border-sky-500/20 hover:border-sky-500/60",
  },
  {
    href: "/panel4",
    number: "04",
    title: "Carrier Appetite Match",
    pitch:
      "Multi-carrier vs single-carrier. Acceso a más carriers expande el menu de opciones y mejora la placement rate en riesgos hard-to-place.",
    question: "Why is multi-carrier the moat?",
    accent: "from-rose-500/20 via-rose-500/5 to-transparent",
    border: "border-rose-500/20 hover:border-rose-500/60",
  },
];

const PROOF_BADGES = [
  { label: "Cohort-based modeling", icon: "📐" },
  { label: "Live Supabase data", icon: "⚡" },
  { label: "SFAA-grounded assumptions", icon: "📊" },
  { label: "Multi-panel state sync", icon: "🔗" },
  { label: "AI-native workflow", icon: "🤖" },
  { label: "Built in 3 days", icon: "🚀" },
];

const RISKS = [
  {
    risk: "Loss ratio escalation",
    detail:
      "SFAA YTD 2024 = 24.9% (highest in 5 yrs). Tightens carrier appetite. Mitigation: AI-assisted risk selection in BondGenius.",
  },
  {
    risk: "Wholesale consolidation",
    detail:
      "JW + Lance Surety rolled into Risk Strategies — online-retail surety is no longer greenfield. Differentiator: AI underwriting + primary-agent licensing path.",
  },
  {
    risk: "E-signature acceptance gaps",
    detail:
      "Many DOTs / municipal obligees still demand wet-ink + raised seal. Limits 100% digital claim. BondSigner addresses where the law allows.",
  },
  {
    risk: "Carrier dependency",
    detail:
      "Each carrier appointment is at-will. Multi-carrier strategy is the structural defense (and the core of Panel 4).",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl p-6 md:p-10 space-y-12">
      {/* HERO */}
      <section className="space-y-5 pt-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/5 px-3 py-1 text-xs font-medium text-amber-400">
          <span>● Built for Nick · BuySuretyBonds × BondGenius × BondSigner</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
          The unit economics of the{" "}
          <span className="text-gradient-amber">$9.5B US surety market</span>,
          modeled in 4 interactive panels.
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Each panel answers a due-diligence question an investor or carrier
          would ask. Inputs flow across panels — change your portfolio in
          Panel 1 and Panels 2–4 update. Built specifically as a pitch tool
          for Nick.
        </p>

        {/* CTA row */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/panel1"
            className="rounded-md bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/20"
          >
            Start the pitch →
          </Link>
          <a
            href="https://buysuretybonds.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-muted transition"
          >
            View BuySuretyBonds.com
          </a>
        </div>

        {/* Proof badges row */}
        <div className="flex flex-wrap gap-2 pt-4">
          {PROOF_BADGES.map((b) => (
            <span
              key={b.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground"
            >
              <span>{b.icon}</span>
              <span>{b.label}</span>
            </span>
          ))}
        </div>
      </section>

      {/* EXECUTIVE SUMMARY */}
      <section className="rounded-xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Executive summary
          </span>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Annual run-rate (mid-market portfolio)
            </p>
            <p className="text-3xl font-bold text-gradient-amber mt-1">
              ~$3M
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Nick gross at 1,000 bonds/mo, sub-agent today
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Regulatory unlock multiplier
            </p>
            <p className="text-3xl font-bold text-gradient-emerald mt-1">
              5.0x
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Sub-agent (3% of premium) → Primary agent (15%)
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              5-year compounding effect
            </p>
            <p className="text-3xl font-bold mt-1">
              ~70%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              of revenue at month 60 comes from renewals (the moat)
            </p>
          </div>
        </div>
      </section>

      {/* PANELS GRID */}
      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            The 4 panels · click any to dive in
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {PANELS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className={`group relative overflow-hidden rounded-xl border ${p.border} bg-card p-6 transition`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${p.accent} opacity-60 group-hover:opacity-100 transition pointer-events-none`}
              />
              <div className="relative">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span className="text-xs font-mono text-muted-foreground">
                    {p.number}
                  </span>
                  <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition">
                    Open →
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-1">{p.title}</h2>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                  {p.question}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {p.pitch}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT FLOWS — pitch sequence */}
      <section className="rounded-xl border bg-card p-6 md:p-8">
        <h3 className="font-semibold text-base mb-3">
          How to pitch this in 7 minutes
        </h3>
        <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-1.5 marker:text-amber-500 marker:font-semibold">
          <li>
            Open <strong className="text-foreground">Panel 1 (Single bond)</strong> — explain the waterfall. A $100K bond at 2% rate generates $2,000 premium. As sub-agent, Nick touches $60.
          </li>
          <li>
            Toggle to <strong className="text-foreground">Primary agent</strong> — same bond, Nick now touches $300. <strong className="text-amber-400">5x with no volume change.</strong> This is the regulatory unlock.
          </li>
          <li>
            Switch to <strong className="text-foreground">Panel 1 Portfolio</strong>, load <em>Mid-market</em> preset (1,000 bonds/mo). Save snapshot, flip mode — comparison card shows the multi-million delta.
          </li>
          <li>
            Go to <strong className="text-foreground">Panel 2</strong> — your portfolio is already loaded. ~70% of revenue at month 60 comes from renewals. <strong className="text-emerald-400">SaaS economics with mandated demand.</strong>
          </li>
          <li>
            Open <strong className="text-foreground">Panel 3</strong> — pick Travelers. See the carrier&apos;s Before/After + Nick&apos;s commission capture from one deal.
          </li>
          <li>
            Finish in <strong className="text-foreground">Panel 4</strong> — the marketplace moat. More carriers integrated → higher placement rate on hard-to-place risks.
          </li>
          <li>
            Close: <em>&ldquo;3 days. Claude Code + MCP servers managing Supabase, Notion, Calendar from the chat. AI-native workflow applied to financial modeling.&rdquo;</em>
          </li>
        </ol>
      </section>

      {/* RISK REGISTER */}
      <section className="rounded-xl border bg-card p-6 md:p-8">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="font-semibold text-base">Risk register · honest disclosure</h3>
          <span className="text-xs text-muted-foreground">
            What an investor will ask — and how we&apos;d address it
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {RISKS.map((r) => (
            <div
              key={r.risk}
              className="rounded-lg border bg-background/40 p-4"
            >
              <p className="text-sm font-semibold text-rose-400 mb-1">
                {r.risk}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {r.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SOURCES */}
      <section className="rounded-xl border bg-card p-6 md:p-8">
        <h3 className="font-semibold text-base mb-3">Sources & assumptions</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          Numbers grounded in public industry data. Where assumptions are
          internal estimates we flag them explicitly.
        </p>
        <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-5">
          <li>
            US surety market size & loss ratios:{" "}
            <a href="https://surety.org/research-resources/research-statistics/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
              SFAA Research & Statistics
            </a>{" "}
            (Q3 2024 industry loss ratio: 24.9% — highest in 5 yrs)
          </li>
          <li>
            Premium rates by bond type:{" "}
            <a href="https://www.suretybonds.com/edu/surety-bond-cost" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
              SuretyBonds.com 2026 Cost Guide
            </a>{" "}
            and{" "}
            <a href="https://www.nfp.com/insights/how-much-does-a-surety-bond-cost/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
              NFP
            </a>
          </li>
          <li>
            Channel commission ranges (10–40% of premium):{" "}
            <a href="https://integritysurety.com/wp-content/uploads/2017/04/Compensation-Disclosure-2017.pdf" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
              Integrity Surety Producer Disclosure
            </a>
          </li>
          <li>
            Digital uplift assumption (+15% premium volume):{" "}
            <a href="https://www.mckinsey.com/industries/financial-services/our-insights/insurance-mgas-opportunities-and-considerations-for-investors" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
              McKinsey Insurance MGA Report
            </a>{" "}
            (industry estimate, not surety-specific)
          </li>
          <li>
            Nick&apos;s sub-agent override (3%) and primary commission (15%):{" "}
            <strong>internal estimates</strong> · range editable in every
            panel · pending confirmation with Nick
          </li>
          <li>
            Carrier treasury limits & AM Best ratings: directionally sourced
            from carrier 10-Ks (Apr 2024)
          </li>
        </ul>
      </section>

      <footer className="text-xs text-muted-foreground border-t pt-6 flex justify-between flex-wrap gap-2">
        <span>
          Built in 3 days · Next.js 16 · Supabase · Chart.js · Zustand · Claude
          Code + MCP
        </span>
        <span>Data version: April 2024 · v1.0</span>
      </footer>
    </main>
  );
}
