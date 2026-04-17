import Link from "next/link";

const PANELS = [
  {
    href: "/panel1",
    number: "01",
    title: "Unit Economics Waterfall",
    forNick:
      "See exactly how each premium dollar splits — carrier keeps ~85%, the distribution channel keeps ~15%. Today Nick captures 3% as a sub-agent. Once licensed as primary agent: 15%. That's a 5x revenue jump per bond without changing operations.",
    forFriend:
      "Think of it like this: a customer pays $2,000 for a bond. This panel shows who gets what slice of that money, and why Nick's slice is about to get 5x bigger.",
    question: "Where does each dollar go?",
    accent: "from-amber-500/20 via-amber-500/5 to-transparent",
    border: "border-amber-500/20 hover:border-amber-500/60",
    features: ["Interactive waterfall chart", "Portfolio builder with presets", "5-year lifetime value per bond", "Side-by-side scenario comparison", "Export to Excel"],
  },
  {
    href: "/panel2",
    number: "02",
    title: "Renewal Revenue Engine",
    forNick:
      "Surety bonds renew every year at 75-88%. This panel simulates how that compounds a book of business over 5-10 years — showing that at year 5, ~70% of revenue comes from bonds sold in prior years. That's the moat.",
    forFriend:
      "Imagine you sell 100 subscriptions this month. Next year, 85 of them auto-renew. The year after, 72. Meanwhile you keep selling new ones. This panel shows how that snowball effect creates a growing revenue stream.",
    question: "Why does revenue keep growing?",
    accent: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    border: "border-emerald-500/20 hover:border-emerald-500/60",
    features: ["Month-by-month simulation", "Growth rate modeling", "What-if: carrier deal at month X", "Sensitivity analysis matrix", "Year-by-year breakdown table"],
  },
  {
    href: "/panel3",
    number: "03",
    title: "Carrier Pitch: Before & After",
    forNick:
      "When you sit with a VP of Surety at Travelers or CNA, this is the business case. Pick a carrier profile, see their before/after transformation from integrating with BondGenius, and exactly how much flows back to you.",
    forFriend:
      "Nick needs insurance companies (carriers) to work with him. This panel shows each carrier what they gain from the partnership — and what Nick earns from each deal.",
    question: "Why would an insurer partner with Nick?",
    accent: "from-sky-500/20 via-sky-500/5 to-transparent",
    border: "border-sky-500/20 hover:border-sky-500/60",
    features: ["5 real carrier profiles", "Before vs After comparison", "Deal economics breakdown", "Break-even calculator", "AI market analyst chat"],
  },
  {
    href: "/panel4",
    number: "04",
    title: "Carrier Appetite Match",
    forNick:
      "Why customers choose BuySuretyBonds over going direct to one carrier: access to multiple carriers dramatically improves the chance of getting approved, especially for harder-to-place applicants.",
    forFriend:
      "If you only apply to one bank for a loan, you might get rejected. If you apply to 5 banks simultaneously, your odds go way up. Same idea — but with bond insurance companies instead of banks.",
    question: "Why is a marketplace better than going direct?",
    accent: "from-rose-500/20 via-rose-500/5 to-transparent",
    border: "border-rose-500/20 hover:border-rose-500/60",
    features: ["10 real carriers ranked", "Approval probability calculator", "1 vs 5 vs 10 carrier comparison", "Editable base rates (your data)", "Revenue per bond estimate"],
  },
];

const STACK_USED = [
  { tool: "Next.js 16", what: "Full-stack web framework (TypeScript)", icon: "▲" },
  { tool: "Supabase", what: "PostgreSQL database — tables created via MCP, no dashboard needed", icon: "⚡" },
  { tool: "Claude Code", what: "AI pair programmer — 95%+ of code from natural language", icon: "🤖" },
  { tool: "MCP Servers", what: "Supabase + Notion + Google Calendar managed from the chat", icon: "🔗" },
  { tool: "Chart.js", what: "Interactive charts with real-time updates", icon: "📊" },
  { tool: "Zustand", what: "Shared state — change Panel 1, Panels 2-4 auto-update", icon: "🔄" },
  { tool: "Anthropic SDK", what: "AI chat loaded with surety market data", icon: "💬" },
  { tool: "Tailwind CSS", what: "Executive dark theme matching your brand", icon: "🎨" },
  { tool: "GitHub", what: "Full version control — every commit tracked", icon: "📦" },
  { tool: "Framer Motion", what: "Smooth animations on data changes", icon: "✨" },
];

const WHATS_NEXT = [
  "Plug in your real numbers — 9 questions I'd love to confirm (see Assumptions)",
  "Connect BuySuretyBonds pipeline → webhook endpoint is already built (/api/bonds/ingest)",
  "Activate live AI chat with your Anthropic API key (~$5/mo)",
  "Sensitivity analysis & scenario planning for investor conversations",
  "Mobile polish pass for phone-based demos",
  "Build a 'Three Products, One Moat' overview (BSB + BondGenius + BondSigner)",
];

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl p-6 md:p-10 space-y-14">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* HERO                                                          */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-5 pt-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/5 px-3 py-1 text-xs font-medium text-amber-400">
          <span>Built by Federico Scarcella · 3-day sprint · April 2026</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
          I modeled the{" "}
          <span className="text-gradient-amber">unit economics</span> of your
          surety business.
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Nick — this is an interactive financial model of BuySuretyBonds,
          BondGenius, and BondSigner. Four panels, each answering a different
          question an investor or carrier partner would ask. Every input is
          editable, every assumption is documented, and all panels share state
          — change something in one and the rest update.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/panel1"
            className="rounded-md bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/20"
          >
            Start exploring →
          </Link>
          <Link
            href="/assumptions"
            className="rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-muted transition"
          >
            View assumptions & sources
          </Link>
          <a
            href="https://buysuretybonds.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-muted transition"
          >
            BuySuretyBonds.com ↗
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* HOW THE BUSINESS WORKS — for anyone, zero jargon                */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="rounded-xl border bg-card p-6 md:p-8 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
            First, the basics
          </p>
          <h2 className="text-2xl font-bold">
            How Nick&apos;s business works (in plain English)
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Step 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
                1
              </span>
              <h3 className="font-semibold">What is a surety bond?</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A surety bond is a <strong>legally required guarantee</strong>.
              Contractors, notaries, auto dealers, and freight brokers
              must have one to operate — it&apos;s the law. If they don&apos;t
              perform, the insurance company (called a <strong>carrier</strong>)
              pays the damages.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The customer (called the <strong>principal</strong>) pays a small
              annual fee called a <strong>premium</strong> — typically 1-3% of
              the bond amount. A $100K bond costs ~$2,000/year.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
                2
              </span>
              <h3 className="font-semibold">Where does Nick fit?</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nick is the <strong>distribution layer</strong> — he connects
              customers who need bonds with the carriers who issue them. Think
              of it like Expedia for flights: the airlines (carriers) have the
              product, Nick&apos;s platform makes it easy to buy.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              He runs 3 products:{" "}
              <strong>BuySuretyBonds.com</strong> (where customers buy),{" "}
              <strong>BondGenius.ai</strong> (AI engine that automates the
              process for other agencies), and{" "}
              <strong>BondSigner.com</strong> (digital signature platform).
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
                3
              </span>
              <h3 className="font-semibold">How does he make money?</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every time a bond is sold through his platform, Nick earns a{" "}
              <strong>commission</strong> — a percentage of the premium. Today
              he earns ~3% (as a sub-agent). Once he completes licensing to
              become a <strong>primary agent</strong>, he captures ~15%.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>The key:</strong> surety bonds renew every year
              (75-88% renewal rate). So every bond Nick sells today keeps
              paying him for years. That&apos;s the compounding engine.
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-muted/30 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">
            💡 Why this matters as an investment
          </p>
          <p>
            The US surety market is <strong>$9.5 billion</strong> in annual
            premiums, growing 8-10% per year (
            <a
              href="https://surety.org/research-resources/research-statistics/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline"
            >
              SFAA
            </a>
            ). Demand is{" "}
            <strong>legally mandated</strong> — customers can&apos;t operate
            without a bond. It doesn&apos;t shrink in a recession. And the
            renewal rates (75-88%) create SaaS-like recurring revenue in an
            industry that most tech investors haven&apos;t explored yet.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* THE KEY INSIGHT                                                */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="rounded-xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 md:p-8">
        <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-4">
          The key insight I found
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Today (sub-agent)
            </p>
            <p className="text-3xl font-bold mt-1">$60</p>
            <p className="text-xs text-muted-foreground mt-1">
              per $100K bond · Nick earns 3% of premium
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Tomorrow (primary agent)
            </p>
            <p className="text-3xl font-bold text-gradient-amber mt-1">$300</p>
            <p className="text-xs text-muted-foreground mt-1">
              same bond, same customer, 15% of premium
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Revenue multiplier
            </p>
            <p className="text-3xl font-bold text-gradient-emerald mt-1">5.0x</p>
            <p className="text-xs text-muted-foreground mt-1">
              just by completing licensing — no ops change
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-5 max-w-3xl">
          Nick is currently a <strong>sub-agent</strong> — he brings customers
          but relies on a licensed agency to issue bonds. He&apos;s in the
          process of getting his own licenses to become a{" "}
          <strong>primary agent</strong>. When that happens, he captures the
          full 15% channel commission instead of just 3%. Over 5,000
          bonds/month, that&apos;s <strong>+$1.2M/month</strong> in additional
          revenue with zero operational change. Panel 1 lets you toggle between
          both scenarios in real time.
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 4 PANELS                                                       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">The 4 panels</h2>
          <p className="text-sm text-muted-foreground">
            Each answers a different question. Click any card to explore
            interactively — all inputs are editable and panels share state.
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
                <div className="flex items-start justify-between gap-4 mb-2">
                  <span className="text-xs font-mono text-muted-foreground">
                    {p.number}
                  </span>
                  <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition">
                    Open →
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-1">{p.title}</h3>
                <p className="text-[10px] uppercase tracking-widest text-amber-400/80 mb-2 font-mono">
                  {p.question}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                  {p.forNick}
                </p>
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground/60 hover:text-muted-foreground">
                    Explain it simply
                  </summary>
                  <p className="mt-1 text-muted-foreground/80 italic">
                    {p.forFriend}
                  </p>
                </details>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.features.map((f) => (
                    <span
                      key={f}
                      className="inline-block rounded-full bg-muted/80 px-2 py-0.5 text-[10px] text-muted-foreground"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* DEMO WALKTHROUGH                                               */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="rounded-xl border bg-card p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-3">
          How to explore this (7 minutes)
        </h2>
        <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-1.5 marker:text-amber-500 marker:font-semibold">
          <li>
            Start in <strong className="text-foreground">Panel 1</strong> →
            see how a single $100K bond&apos;s premium splits across the value chain
          </li>
          <li>
            Toggle <strong className="text-amber-400">Primary agent 🚀</strong>{" "}
            → watch Nick&apos;s share jump from $60 to $300 per bond (5x)
          </li>
          <li>
            Switch to <strong className="text-foreground">Portfolio mode</strong>{" "}
            → load &ldquo;Mid-market&rdquo; (1,000 bonds/month) → save snapshot
            → flip mode → see the dollar difference
          </li>
          <li>
            Go to <strong className="text-foreground">Panel 2</strong> →
            your portfolio is already loaded → see how renewals compound over
            5 years (~70% of revenue at month 60 is from bonds sold in prior
            years)
          </li>
          <li>
            Open <strong className="text-foreground">Panel 3</strong> → pick
            Travelers → see the carrier&apos;s before/after ROI + how much Nick
            captures from the deal
          </li>
          <li>
            Finish in <strong className="text-foreground">Panel 4</strong> →
            see how adding more carriers dramatically improves customer
            approval odds → the marketplace moat
          </li>
          <li>
            Review{" "}
            <Link
              href="/assumptions"
              className="text-amber-400 hover:underline font-medium"
            >
              Assumptions & Sources
            </Link>{" "}
            → every number cited or flagged as editable
          </li>
        </ol>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* STACK PROOF                                                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">How I built this</h2>
          <p className="text-sm text-muted-foreground">
            Full stack — framework, database, AI, deployment — built in 3 days
            using Claude Code as the primary development tool.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {STACK_USED.map((s) => (
            <div key={s.tool} className="rounded-lg border bg-card/60 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">{s.icon}</span>
                <span className="text-sm font-semibold">{s.tool}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {s.what}
              </p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border bg-muted/20 p-4 text-sm">
          <p className="font-medium mb-1">
            🔗 The AI-native workflow
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Database tables, carrier seed data, Notion documentation, and
            Calendar scheduling — all managed from the Claude Code chat via
            MCP servers. No dashboard-hopping, no context-switching.
            This is the workflow I&apos;d bring to your team.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* INTEGRATION READY                                              */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="rounded-xl border bg-card p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <h2 className="text-lg font-semibold">
            🔌 Ready to connect to BuySuretyBonds
          </h2>
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] text-emerald-400 font-medium">
            Webhook built
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              I built a webhook endpoint at{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-amber-400">
                /api/bonds/ingest
              </code>{" "}
              that accepts bond data via POST. Point your BuySuretyBonds
              post-issuance pipeline at this URL → every bond sold
              automatically appears in the dashboard portfolio.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              The integration is ready — it just needs to be connected on
              your end. No code changes required on this side.
            </p>
          </div>
          <div className="rounded-lg bg-slate-900 p-4 font-mono text-xs text-slate-300 overflow-x-auto">
            <p className="text-muted-foreground mb-1">
              {"// POST /api/bonds/ingest"}
            </p>
            <p>{"{"}</p>
            <p className="pl-4">
              <span className="text-amber-400">&quot;bond&quot;</span>
              {": {"}
            </p>
            <p className="pl-8">
              <span className="text-amber-400">
                &quot;bond_type_name&quot;
              </span>
              {': "Contractor License",'}
            </p>
            <p className="pl-8">
              <span className="text-amber-400">
                &quot;bond_amount&quot;
              </span>
              {": 100000,"}
            </p>
            <p className="pl-8">
              <span className="text-amber-400">&quot;premium&quot;</span>
              {": 2500,"}
            </p>
            <p className="pl-8">
              <span className="text-amber-400">&quot;rate&quot;</span>
              {": 0.025"}
            </p>
            <p className="pl-4">{"}"}</p>
            <p>{"}"}</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* WHAT'S NEXT                                                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="rounded-xl border bg-card p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-1">
          What I&apos;d build next
        </h2>
        <p className="text-xs text-muted-foreground mb-3">
          3-day sprint → shipped. Here&apos;s the roadmap with more time:
        </p>
        <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-1 marker:text-amber-500 marker:font-semibold">
          {WHATS_NEXT.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ABOUT ME / CTA                                                 */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="rounded-xl border bg-card p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-3">
          Why I built this
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          I work in private equity. My instinct is to understand the economics
          before anything else — where the revenue comes from, why it compounds,
          what the moat is. A typical developer would have built a bond lookup
          tool. I built the <strong className="text-foreground">investment
          thesis as an interactive application</strong>.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Every number is grounded in public data (SFAA, AM Best, McKinsey) or
          flagged as an assumption. Where I wasn&apos;t sure, I built editable
          sliders. Where I found something non-obvious — like the 5x regulatory
          unlock — I made it the centerpiece.
        </p>
        <p className="text-sm font-medium">
          I built this in 3 days. I&apos;d love to walk you through it —{" "}
          <strong className="text-amber-400">when do you have 15 minutes?</strong>
        </p>
      </section>

      <footer className="text-xs text-muted-foreground border-t pt-6 flex justify-between flex-wrap gap-2">
        <span>
          Next.js 16 · Supabase · Chart.js · Zustand · Framer Motion · Claude
          Code + MCP · Vercel
        </span>
        <span>
          Data: SFAA, AM Best, McKinsey · Apr 2024 ·{" "}
          <Link
            href="/assumptions"
            className="text-amber-400 hover:underline"
          >
            All assumptions →
          </Link>
        </span>
      </footer>
    </main>
  );
}
