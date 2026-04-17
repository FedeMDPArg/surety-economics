import Link from "next/link";

const PANELS = [
  {
    href: "/panel1",
    number: "01",
    title: "Unit Economics Waterfall",
    forNick:
      "See exactly how each premium dollar splits across your value chain. Toggle between sub-agent (today) and primary agent (future) to visualize the 5x revenue unlock.",
    question: "How does each premium dollar break down?",
    accent: "from-amber-500/20 via-amber-500/5 to-transparent",
    border: "border-amber-500/20 hover:border-amber-500/60",
    features: ["Single bond + portfolio modes", "3 presets (Small / Mid-market / Your scale)", "LTV per bond type", "Snapshot comparison", "Export to Excel"],
  },
  {
    href: "/panel2",
    number: "02",
    title: "Renewal Revenue Engine",
    forNick:
      "Your bonds renew at 75-88% annually. This panel shows how that compounds into a book of business over 5-10 years — the moat argument for investors.",
    question: "Why does this business compound?",
    accent: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    border: "border-emerald-500/20 hover:border-emerald-500/60",
    features: ["Cohort-based simulation (PE-grade)", "YoY growth slider", "Carrier integration scenario", "Year-by-year breakdown", "Sub-agent vs primary comparison"],
  },
  {
    href: "/panel3",
    number: "03",
    title: "Carrier Pitch: Before & After",
    forNick:
      "When you sit down with a VP of Surety at Travelers or CNA, this is the business case. Pick a carrier, see their ROI, and exactly how much you capture.",
    question: "Why would a carrier integrate with BondGenius?",
    accent: "from-sky-500/20 via-sky-500/5 to-transparent",
    border: "border-sky-500/20 hover:border-sky-500/60",
    features: ["5 real carrier presets", "Before/After comparison", "Deal structure + break-even", "Nick's commission capture", "AI market analyst (expandable)"],
  },
  {
    href: "/panel4",
    number: "04",
    title: "Carrier Appetite Match",
    forNick:
      "Why customers choose BuySuretyBonds over going direct: multi-carrier access expands placement rates on hard-to-place risks. This is the marketplace moat.",
    question: "Why is multi-carrier the defensible moat?",
    accent: "from-rose-500/20 via-rose-500/5 to-transparent",
    border: "border-rose-500/20 hover:border-rose-500/60",
    features: ["10 real carriers from Supabase", "Fit score + approval math", "Approval curve visualization", "BondGenius integration status", "Revenue per bond calculation"],
  },
];

const STACK_USED = [
  { tool: "Next.js 16", what: "App framework — routing, server components, TypeScript", icon: "▲" },
  { tool: "Supabase", what: "PostgreSQL database — bond_types + carrier_profiles tables, seeded via MCP", icon: "⚡" },
  { tool: "Claude Code", what: "AI pair programmer — wrote 95%+ of the code from natural language prompts", icon: "🤖" },
  { tool: "MCP Servers", what: "Supabase (tables+SQL), Notion (docs), Google Calendar (scheduling) — all from the chat", icon: "🔗" },
  { tool: "Chart.js", what: "Interactive charts — waterfall, stacked area, approval curve", icon: "📊" },
  { tool: "Zustand", what: "Shared state across all 4 panels — change one, others update", icon: "🔄" },
  { tool: "Anthropic SDK", what: "AI chat in Panel 3 — Claude Sonnet 4.6 with surety market data in system prompt", icon: "💬" },
  { tool: "Tailwind CSS", what: "Executive dark theme matching your brand — slate + amber/gold palette", icon: "🎨" },
  { tool: "GitHub", what: "Version control — full commit history of the 3-day sprint", icon: "📦" },
  { tool: "Vercel", what: "Deployment — this URL you're viewing right now", icon: "🚀" },
];

const WHATS_NEXT = [
  "Plug in your real numbers (9 open questions I'd love to confirm — see Assumptions page)",
  "Connect the AI chat to live Claude Sonnet 4.6 with your API key (~$5/mo)",
  "Add sensitivity analysis matrix to Panel 2 (bull/base/bear scenarios)",
  "Mobile responsive polish pass",
  "Build a 'Three Products, One Moat' overview showing how BSB + BondGenius + BondSigner form a vertical stack",
  "Add your actual carrier appointment data to Panel 4 instead of my estimates",
  "Record a 5-minute Loom walkthrough together",
];

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl p-6 md:p-10 space-y-14">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* HERO — the pitch to Nick                                      */}
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
          Nick — instead of building a generic tool, I modeled the full surety
          distribution chain: how premium dollars flow, why renewal revenue
          creates a compounding moat, the quantitative case for carrier
          integration, and the marketplace defensibility argument. Four
          interactive panels, all interconnected.
        </p>
        <p className="text-base text-muted-foreground max-w-3xl">
          I used the full stack you work with — Next.js, Supabase, Claude
          Code with MCP servers, Anthropic API — and I applied my PE
          background to build something only someone who understands the{" "}
          <em>business</em> would build, not just the code.
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
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* KEY INSIGHT — the 5x unlock                                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="rounded-xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 md:p-8">
        <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-4">
          The key insight I want to highlight
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Today · sub-agent (3% of premium)
            </p>
            <p className="text-3xl font-bold mt-1">$60</p>
            <p className="text-xs text-muted-foreground mt-1">
              per $100K bond at 2% rate
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Tomorrow · primary agent (15%)
            </p>
            <p className="text-3xl font-bold text-gradient-amber mt-1">$300</p>
            <p className="text-xs text-muted-foreground mt-1">
              same bond, same customer, same ops
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Revenue multiplier
            </p>
            <p className="text-3xl font-bold text-gradient-emerald mt-1">5.0x</p>
            <p className="text-xs text-muted-foreground mt-1">
              regulatory unlock, not operational
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-5 max-w-3xl">
          The transition from sub-agent to primary agent is a{" "}
          <strong className="text-foreground">5x revenue multiplier
          per bond without changing operations</strong>. Over 5,000 bonds/month,
          that&apos;s +$1.2M/month in additional revenue. I&apos;ve never seen
          this argued interactively elsewhere — Panel 1 lets you toggle
          between both modes in real time. This is the valuation story.
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 4 PANELS                                                       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">The 4 panels</h2>
          <p className="text-sm text-muted-foreground">
            Each answers a due-diligence question. All panels share state —
            change your portfolio in Panel 1 and Panels 2–4 update.
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
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                  {p.question}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {p.forNick}
                </p>
                <div className="flex flex-wrap gap-1.5">
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
      {/* STACK PROOF — what I used and how                              */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">The stack I used</h2>
          <p className="text-sm text-muted-foreground">
            Everything you work with — plus a few additions that demonstrate
            AI-native development.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {STACK_USED.map((s) => (
            <div
              key={s.tool}
              className="rounded-lg border bg-card/60 p-4"
            >
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
            🔗 How MCP servers changed the workflow
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            I created Supabase tables, seeded 10 carriers, updated Notion
            documentation, and scheduled Calendar events — all without leaving
            the Claude Code chat. No dashboard-hopping, no context-switching.
            This is the AI-native workflow I&apos;d bring to your team.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* HOW TO USE THIS                                                */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="rounded-xl border bg-card p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-3">
          How to explore this (7 minutes)
        </h2>
        <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-1.5 marker:text-amber-500 marker:font-semibold">
          <li>
            Open <strong className="text-foreground">Panel 1</strong> →
            Single bond → see the waterfall for a $100K bond
          </li>
          <li>
            Toggle <strong className="text-amber-400">Primary agent 🚀</strong>{" "}
            → watch the 5x multiplier
          </li>
          <li>
            Switch to <strong className="text-foreground">Portfolio</strong> →
            load the &ldquo;Mid-market&rdquo; preset → save snapshot → flip
            mode → see the dollar delta
          </li>
          <li>
            Go to <strong className="text-foreground">Panel 2</strong> →
            your portfolio is already loaded → ~70% of revenue at year 5 is
            renewals
          </li>
          <li>
            Open <strong className="text-foreground">Panel 3</strong> → pick
            Travelers → see the Before/After + your commission capture
          </li>
          <li>
            Finish in <strong className="text-foreground">Panel 4</strong> →
            multi-carrier placement expansion → the marketplace moat
          </li>
          <li>
            Check <Link href="/assumptions" className="text-amber-400 hover:underline font-medium">Assumptions & Sources</Link>{" "}
            → everything cited, nothing made up
          </li>
        </ol>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* WHAT'S NEXT                                                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="rounded-xl border bg-card p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-1">
          What I&apos;d build next (if you want to keep going)
        </h2>
        <p className="text-xs text-muted-foreground mb-3">
          This was a 3-day sprint. Here&apos;s what I&apos;d prioritize with
          more time:
        </p>
        <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-1 marker:text-amber-500 marker:font-semibold">
          {WHATS_NEXT.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ABOUT ME                                                       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="rounded-xl border bg-card p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-3">
          Why I built this (and why it matters)
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          I work in private equity. My instinct is to model the business
          before anything else — understand why the economics work, where the
          moat is, and what the upside levers are. A typical developer would
          have built a bond lookup tool or a chatbot. I built the{" "}
          <strong className="text-foreground">investment thesis as an
          interactive application</strong>.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Every number is grounded in public industry data (SFAA, AM Best,
          McKinsey) or flagged as an assumption. Where I wasn&apos;t sure, I
          built sliders so you can plug in your real numbers. Where I found
          something interesting — like the 5x regulatory unlock — I made it
          the centerpiece of the pitch.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          I built this in 3 days using Claude Code + MCP servers. The code is
          on GitHub. The assumptions are documented. I&apos;d love to walk you
          through it — <strong className="text-foreground">when do you have
          15 minutes?</strong>
        </p>
      </section>

      <footer className="text-xs text-muted-foreground border-t pt-6 flex justify-between flex-wrap gap-2">
        <span>
          Built with Next.js 16 · Supabase · Chart.js · Zustand · Claude Code
          + MCP · Vercel
        </span>
        <span>
          Data: SFAA, AM Best, McKinsey · April 2024 ·{" "}
          <Link href="/assumptions" className="text-amber-400 hover:underline">
            View all assumptions →
          </Link>
        </span>
      </footer>
    </main>
  );
}
