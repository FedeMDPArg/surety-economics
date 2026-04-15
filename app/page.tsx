import Link from "next/link";

const PANELS = [
  {
    href: "/panel1",
    number: "1",
    title: "Unit Economics Waterfall",
    pitch:
      "How each premium dollar splits across the value chain — and why moving from sub-agent to primary agent is a 5x revenue unlock.",
    question: "How does each premium dollar break down?",
    color: "from-sky-500/20 to-sky-500/5 border-sky-500/30",
  },
  {
    href: "/panel2",
    number: "2",
    title: "Renewal Revenue Engine",
    pitch:
      "Cohort-based model showing why surety revenue compounds. At month 60, ~70% of revenue is renewals — the moat.",
    question: "Why does this business compound?",
    color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
  },
  {
    href: "/panel3",
    number: "3",
    title: "Carrier Pitch + AI Chat",
    pitch:
      "ROI calculator for carriers + live chat powered by Claude Sonnet 4.6 loaded with surety market data.",
    question: "What's the ROI for a carrier integrating?",
    color: "from-amber-500/20 to-amber-500/5 border-amber-500/30",
  },
  {
    href: "/panel4",
    number: "4",
    title: "Carrier Appetite Match",
    pitch:
      "Ranked carrier match with probability math: 1 carrier = 60% approval, 5 carriers = 99%. The case for multi-carrier.",
    question: "Why multi-carrier beats single-carrier?",
    color: "from-rose-500/20 to-rose-500/5 border-rose-500/30",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl p-6 md:p-10 space-y-10">
      <section className="space-y-4 pt-4">
        <p className="text-xs uppercase tracking-widest text-sky-600 font-semibold">
          Built for Nick (BuySuretyBonds · BondGenius · BondSigner) · 3-day
          sprint
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Surety Bond Unit Economics Platform
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          An interactive 4-panel model of the US surety market ($9.5B, 8–10%
          CAGR). Each panel answers a due-diligence question an investor or
          carrier would ask. Inputs and assumptions flow across panels — change
          something in Panel 1 and Panel 2 updates.
        </p>
      </section>

      <section className="rounded-lg border bg-muted/30 p-5 text-sm space-y-2">
        <p className="font-semibold">
          🔗 Panels share state — what changes in one flows to the others
        </p>
        <ul className="text-muted-foreground list-disc pl-5 space-y-1">
          <li>
            <strong>Mode</strong> (sub-agent / primary agent) is shared across
            all panels.
          </li>
          <li>
            <strong>Portfolio</strong> configured in Panel 1 feeds Panel 2 as
            the new-bonds-per-month input.
          </li>
          <li>
            <strong>Assumptions</strong> (override %, CAC, OpEx) are shared
            between Panel 1 and Panel 3.
          </li>
          <li>
            <strong>Time horizon</strong> (years) drives both LTV in Panel 1 and
            the renewal chart in Panel 2.
          </li>
        </ul>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {PANELS.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className={`group rounded-xl border bg-gradient-to-br ${p.color} p-6 hover:scale-[1.015] transition`}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <span className="text-5xl font-bold text-foreground/20 leading-none">
                {p.number}
              </span>
              <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition">
                Open →
              </span>
            </div>
            <h2 className="text-xl font-semibold mb-1">{p.title}</h2>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              {p.question}
            </p>
            <p className="text-sm text-muted-foreground">{p.pitch}</p>
          </Link>
        ))}
      </section>

      <section className="rounded-lg border p-5 space-y-2">
        <h3 className="font-semibold">How to use this during a pitch</h3>
        <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-1">
          <li>
            Start in <strong>Panel 1 (Single bond)</strong> to explain the
            waterfall.
          </li>
          <li>
            Switch to <strong>Panel 1 (Portfolio)</strong>, load the
            &ldquo;Mid-market&rdquo; preset, and save a snapshot in sub-agent
            mode.
          </li>
          <li>
            Flip to <strong>primary agent</strong> — the snapshot shows the 5x
            delta in green.
          </li>
          <li>
            Go to <strong>Panel 2</strong> — your portfolio from Panel 1 is
            already loaded as the new-bonds-per-month.
          </li>
          <li>
            Show how revenue compounds via renewals — ~70% at month 60.
          </li>
          <li>
            Open <strong>Panel 3</strong> to show carrier ROI + live AI chat
            with surety knowledge.
          </li>
          <li>
            Finish with <strong>Panel 4</strong> — multi-carrier match, the
            marketplace moat.
          </li>
        </ol>
      </section>

      <footer className="text-xs text-muted-foreground border-t pt-6">
        Built in 3 days with Next.js + Supabase + Chart.js + Claude Code + MCP
        servers. Assumptions documented in the project Notion workspace.
      </footer>
    </main>
  );
}
