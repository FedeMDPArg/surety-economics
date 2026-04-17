import Link from "next/link";

const VERIFIED = [
  {
    claim: "US surety market ~$9.5B in GWP",
    source: "SFAA 2023 Annual Results",
    url: "https://surety.org/research-resources/research-statistics/",
    status: "verified",
  },
  {
    claim: "CAGR 8-10%",
    source: "WTW Insurance Marketplace Realities 2024",
    url: "https://www.wtwco.com/en-us/insights/2024/05/insurance-marketplace-realities-2024-spring-update-surety",
    status: "verified",
  },
  {
    claim: "Industry loss ratio 2024 YTD: 24.9%",
    source: "SFAA Q3 2024 Top 100 + TSIB analysis",
    url: "https://blog.tsibinc.com/surety-underwriting-standards-tighten-amid-rising-claims",
    status: "verified",
  },
  {
    claim: "Premium rate 1-3% of bond amount (well-qualified)",
    source: "NFP, SuretyBonds.com, Palmetto Surety, Bryant",
    url: "https://www.nfp.com/insights/how-much-does-a-surety-bond-cost/",
    status: "verified",
  },
  {
    claim: "Commercial renewal rates 75-88%",
    source: "SFAA industry reports, carrier filings",
    url: "https://surety.org/research-resources/research-statistics/",
    status: "verified",
  },
  {
    claim: "Channel commission 10-40% (typical 15-20%)",
    source: "Integrity Surety Producer Disclosure, Surety One",
    url: "https://integritysurety.com/wp-content/uploads/2017/04/Compensation-Disclosure-2017.pdf",
    status: "verified",
  },
  {
    claim: "Treasury Circular 570 updated July 2024",
    source: "Federal Register",
    url: "https://www.federalregister.gov/documents/2024/06/10/2024-12491/surety-companies-doing-business-with-the-united-states",
    status: "verified",
  },
  {
    claim: "Demand is legally mandated (non-discretionary)",
    source: "State licensing statutes (all 50 states)",
    url: "",
    status: "verified",
  },
];

const ASSUMPTIONS = [
  {
    claim: "Nick's sub-agent override: 3% of premium",
    basis: "Federico's estimate based on sub-agent industry range (2-5%)",
    status: "assumption",
    editable: true,
    confirmWith: "Nick — what's the actual blended override?",
  },
  {
    claim: "Primary agent commission: 15% of premium",
    basis: "Top of the typical 10-15% range for licensed primary agents",
    status: "assumption",
    editable: true,
    confirmWith: "Nick — what commission do primary agencies typically negotiate?",
  },
  {
    claim: "CAC: 1.2% of premium",
    basis: "Industry estimate for SEO-driven DTC model with strong organic traffic",
    status: "assumption",
    editable: true,
    confirmWith: "Nick — what's BuySuretyBonds' actual blended CAC?",
  },
  {
    claim: "Digital premium uplift: +15%",
    basis: "McKinsey insurance digitalization reports (general P&C, not surety-specific)",
    status: "assumption",
    editable: false,
    confirmWith: "Nick — has BondGenius documented actual uplift with any carrier?",
  },
  {
    claim: "FTE reduction: 4 per $10M GWP (from 6 to 2)",
    basis: "Insurtech industry benchmarks, not surety-specific",
    status: "assumption",
    editable: false,
    confirmWith: "Nick — does BondGenius track actual FTE displacement?",
  },
  {
    claim: "Carrier integration cost: ~$500K one-time",
    basis: "Industry estimate for engineering + vendor DD + legal",
    status: "assumption",
    editable: false,
    confirmWith: "Nick — what did actual carrier integrations cost?",
  },
  {
    claim: "Lost renewals recoverable: 13%",
    basis: "Estimate based on friction-loss patterns in insurance distribution",
    status: "assumption",
    editable: false,
    confirmWith: "Nick — what renewal capture rate does the platform achieve vs. manual?",
  },
  {
    claim: "Annual churn: 10%",
    basis: "Conservative estimate — accounts for business closures, jurisdiction changes, competitor loss",
    status: "assumption",
    editable: true,
    confirmWith: "Nick — what's the actual annual attrition rate on the BSB book?",
  },
  {
    claim: "Carrier treasury limits and AM Best ratings",
    basis: "Directionally sourced from carrier 10-Ks and Treasury Circular 570 listings (April 2024 snapshot)",
    status: "approximate",
    editable: false,
    confirmWith: "Nick — which carriers are actually appointed with BSB today?",
  },
];

const DISCLAIMERS = [
  {
    title: "Approval probability in Panel 4",
    detail:
      "SFAA does not publish industry-level approval rates. The model uses a directional simulation based on fit score (treasury match + state licensing + segment match) × base probability. Real approval depends on underwriting (the '3 Cs': character, capacity, capital). These numbers should be calibrated against Nick's actual BuySuretyBonds conversion data before investor-facing use.",
  },
  {
    title: "Competitive landscape",
    detail:
      "JW Surety Bonds and Lance Surety are now part of Risk Strategies — the 'online surety retail' space is no longer greenfield. BondGenius' differentiator is AI-native underwriting + the primary-agent licensing path, not just SEO-driven D2C.",
  },
  {
    title: "E-signature limitations",
    detail:
      "While E-SIGN Act + UETA legally validate electronic signatures for surety bonds, many DOTs, courts, and municipalities still require wet-ink + raised seal. Any '100% digital' claim needs qualification.",
  },
  {
    title: "Loss ratio headwinds",
    detail:
      "2024 industry loss ratio hit 24.9% (5-year high). Driven by construction inflation, labor shortages, and subcontractor defaults. This is a tailwind for disciplined AI-driven underwriting but a headwind for aggressive growth strategies.",
  },
];

export default function AssumptionsPage() {
  return (
    <div className="mx-auto max-w-5xl p-6 md:p-10 space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-amber-600 font-semibold">
          Assumptions & Sources
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Every number, defended.
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          This platform uses two types of data:{" "}
          <strong className="text-emerald-400">verified</strong> (publicly
          sourced, linked) and{" "}
          <strong className="text-amber-400">assumptions</strong> (reasonable
          estimates, editable in the panels). Nothing is made up — where
          I&apos;m uncertain, I flag it and suggest what to confirm with Nick.
        </p>
      </header>

      {/* VERIFIED DATA */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-emerald-500" />
          Verified data (publicly sourced)
        </h2>
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30 text-left text-xs uppercase text-muted-foreground">
                <th className="p-3">Claim</th>
                <th className="p-3">Source</th>
              </tr>
            </thead>
            <tbody>
              {VERIFIED.map((v, i) => (
                <tr key={i} className="border-b hover:bg-muted/20">
                  <td className="p-3">{v.claim}</td>
                  <td className="p-3">
                    {v.url ? (
                      <a
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:underline"
                      >
                        {v.source} ↗
                      </a>
                    ) : (
                      <span className="text-muted-foreground">{v.source}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ASSUMPTIONS */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-amber-500" />
          Assumptions (to confirm with Nick)
        </h2>
        <div className="grid gap-3">
          {ASSUMPTIONS.map((a, i) => (
            <div key={i} className="rounded-lg border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">{a.claim}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Basis: {a.basis}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {a.editable && (
                    <span className="rounded-full bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 text-[10px] text-sky-400">
                      editable in panel
                    </span>
                  )}
                  <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] text-amber-400">
                    assumption
                  </span>
                </div>
              </div>
              <p className="text-xs text-amber-400/80 mt-2 italic">
                → {a.confirmWith}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* DISCLAIMERS */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-rose-500" />
          Important disclaimers
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {DISCLAIMERS.map((d, i) => (
            <div key={i} className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-4">
              <p className="text-sm font-semibold text-rose-400 mb-1">
                {d.title}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {d.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PRIMARY SOURCES LIST */}
      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-3">Primary sources</h2>
        <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-5">
          <li>
            <a href="https://surety.org/research-resources/research-statistics/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
              SFAA — Research & Statistics
            </a>{" "}
            (market size, loss ratios, quarterly results)
          </li>
          <li>
            <a href="https://mbasurety.com/wp-content/uploads/2024/09/Q2-2024-SFAA.pdf" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
              SFAA Q2 2024 Top 100 Quarterly Results
            </a>
          </li>
          <li>
            <a href="https://www.wtwco.com/en-us/insights/2024/05/insurance-marketplace-realities-2024-spring-update-surety" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
              WTW Insurance Marketplace Realities 2024 — Surety
            </a>
          </li>
          <li>
            <a href="https://integritysurety.com/wp-content/uploads/2017/04/Compensation-Disclosure-2017.pdf" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
              Integrity Surety — Producer Compensation Disclosure
            </a>
          </li>
          <li>
            <a href="https://suretyone.com/producer-compensation" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
              Surety One — Producer Compensation & Broker Fee Disclosure
            </a>
          </li>
          <li>
            <a href="https://www.mckinsey.com/industries/financial-services/our-insights/insurance-mgas-opportunities-and-considerations-for-investors" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
              McKinsey — Insurance MGAs: Opportunities and Considerations
            </a>
          </li>
          <li>
            <a href="https://www.nfp.com/insights/how-much-does-a-surety-bond-cost/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
              NFP — How Much Does a Surety Bond Cost?
            </a>
          </li>
          <li>
            <a href="https://www.suretybonds.com/edu/surety-bond-cost" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
              SuretyBonds.com — 2026 Cost Guide
            </a>
          </li>
          <li>
            <a href="https://blog.tsibinc.com/surety-underwriting-standards-tighten-amid-rising-claims" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
              TSIB — Surety Underwriting Standards Tighten 2024
            </a>
          </li>
          <li>
            <a href="https://www.federalregister.gov/documents/2024/06/10/2024-12491/surety-companies-doing-business-with-the-united-states" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
              Federal Register — Treasury Circular 570 Update
            </a>
          </li>
          <li>
            <a href="https://www.risk-strategies.com/state-of-the-insurance-market-2025-outlook-surety" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
              Risk Strategies — 2025 Surety Outlook
            </a>
          </li>
        </ul>
      </section>

      <footer className="flex items-center justify-between border-t pt-6 flex-wrap gap-2">
        <p className="text-xs text-muted-foreground">
          Data snapshot: April 2024. Numbers are directional, not audited.
        </p>
        <Link
          href="/"
          className="text-sm text-amber-400 hover:underline font-medium"
        >
          ← Back to Home
        </Link>
      </footer>
    </div>
  );
}
