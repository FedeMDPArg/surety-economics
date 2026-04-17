"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { money, pct } from "@/lib/utils";
import { MetricCard, NumberSliderInput, SourcesFooter } from "@/components/panel-ui";
import { useSuretyStore } from "@/lib/store";

type CarrierProfile = {
  id: number;
  name: string;
  am_best_rating: string;
  treasury_limit: number | string;
  target_segments: string[] | null;
  licensed_states: string[] | null;
  integrated_with_bondgenius: boolean | null;
  notes: string | null;
};

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

const BUSINESS_TYPES = [
  { value: "contractor", label: "Contractor", category: "contract" },
  { value: "notary", label: "Notary", category: "commercial" },
  { value: "freight_broker", label: "Freight broker", category: "commercial" },
  { value: "auto_dealer", label: "Auto dealer", category: "commercial" },
  { value: "executor", label: "Executor / fiduciary", category: "commercial" },
];

/**
 * Compute a per-carrier fit score and approval probability.
 *
 * fit_score = 0.4 × treasury_match + 0.3 × state_match + 0.3 × segment_match
 * approval_prob = base (60%) × fit_score × credit_adjustment
 */
function computeCarrierMatch(
  carrier: CarrierProfile,
  params: {
    state: string;
    businessType: string;
    businessCategory: string;
    bondAmount: number;
    creditScore: number;
    baseApproval: number;
  },
) {
  const treasury = Number(carrier.treasury_limit);
  const treasuryMatch = treasury > 0 ? Math.min(1, treasury / (params.bondAmount * 5)) : 0;

  const licensedStates = carrier.licensed_states ?? [];
  const stateMatch =
    licensedStates.includes("all") || licensedStates.includes(params.state) ? 1 : 0;

  const targetSegments = carrier.target_segments ?? [];
  const segmentMatch = targetSegments.includes(params.businessCategory) ? 1 : 0.3; // soft penalty if category not in list

  const fitScore = 0.4 * treasuryMatch + 0.3 * stateMatch + 0.3 * segmentMatch;

  // Credit adjustment: 800 = +20%, 720 = 0, 550 = −30%
  const creditNormalized = (params.creditScore - 720) / 80; // 1 per 80 points above 720
  const creditAdjustment = 1 + creditNormalized * 0.15;

  const approvalProb = Math.max(
    0,
    Math.min(0.98, params.baseApproval * fitScore * creditAdjustment),
  );

  return {
    carrier,
    fitScore,
    approvalProb,
    treasuryMatch,
    stateMatch,
    segmentMatch,
  };
}

/**
 * Combined approval probability with N carriers (independent events):
 * 1 − ∏(1 − p_i)
 */
function combinedApproval(probs: number[]): number {
  if (probs.length === 0) return 0;
  return 1 - probs.reduce((acc, p) => acc * (1 - p), 1);
}

export default function Panel4Page() {
  const mode = useSuretyStore((s) => s.mode);
  const subAgentOverride = useSuretyStore((s) => s.subAgentOverride);
  const primaryCommission = useSuretyStore((s) => s.primaryCommission);
  const nickTakeRate = mode === "sub-agent" ? subAgentOverride : primaryCommission;

  const [carriers, setCarriers] = useState<CarrierProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inputs
  const [state, setState] = useState("CA");
  const [businessType, setBusinessType] = useState("contractor");
  const [bondAmount, setBondAmount] = useState(100_000);
  const [creditScore, setCreditScore] = useState(720);
  // Base approval is now user-editable — not a fixed claim
  const [baseApprovalPct, setBaseApprovalPct] = useState(60);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("carrier_profiles")
      .select("*")
      .order("treasury_limit", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setCarriers(data as CarrierProfile[]);
        setLoading(false);
      });
  }, []);

  const businessCategory =
    BUSINESS_TYPES.find((b) => b.value === businessType)?.category ?? "commercial";

  // Ranked carriers with fit + approval
  const ranked = useMemo(() => {
    return carriers
      .map((c) =>
        computeCarrierMatch(c, {
          state,
          businessType,
          businessCategory,
          bondAmount,
          creditScore,
          baseApproval: baseApprovalPct / 100,
        }),
      )
      .sort((a, b) => b.approvalProb - a.approvalProb);
  }, [carriers, state, businessType, businessCategory, bondAmount, creditScore, baseApprovalPct]);

  // Combined approval for top-N
  const combined = useMemo(() => {
    const byCount: Record<number, number> = {};
    for (const n of [1, 3, 5, 7, 10]) {
      const topN = ranked.slice(0, n).map((r) => r.approvalProb);
      byCount[n] = combinedApproval(topN);
    }
    return byCount;
  }, [ranked]);

  const approval1 = combined[1] ?? 0;
  const approval5 = combined[5] ?? 0;
  const approval10 = combined[10] ?? 0;

  const integratedCount = ranked.filter(
    (r) => r.carrier.integrated_with_bondgenius,
  ).length;

  // Nick's commission capture from the top carrier deal
  const topCarrier = ranked[0];
  const approxPremium = bondAmount * 0.02; // rough 2% rate
  const nickRevenuePerBond = approxPremium * nickTakeRate;

  return (
    <div className="mx-auto max-w-6xl p-6 md:p-10 space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-rose-600 font-semibold">
          Panel 4
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Carrier Appetite Match
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Why is a multi-carrier marketplace a defensible business? Any single
          carrier has a finite <strong>appetite</strong> — they only quote
          certain bond types, in certain states, up to certain treasury
          limits. Multi-carrier access expands the menu of placements and
          materially improves the <strong>placement rate on hard-to-place
          risks</strong> (sub-680 FICO, large bonds, niche states). That&apos;s the
          marketplace moat — not price.
        </p>
        <p className="text-xs text-muted-foreground/80 italic">
          Approval modeling below is a directional simulation. Real approval
          rates depend on the &ldquo;3 Cs&rdquo; (character, capacity, capital) and
          carrier-specific underwriting. Industry-level approval data is not
          publicly disclosed by SFAA — these numbers should be calibrated
          against Nick&apos;s own BuySuretyBonds book before pitching to investors.
        </p>
      </header>

      {/* STEP 1 — INPUTS */}
      <section className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
          Step 1 · Describe the applicant
        </p>
        <div className="rounded-lg border p-5 grid gap-5 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded-md border px-3 py-2 bg-background"
            >
              {US_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Business type
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full rounded-md border px-3 py-2 bg-background"
            >
              {BUSINESS_TYPES.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label} ({b.category})
                </option>
              ))}
            </select>
          </div>
          <NumberSliderInput
            label="Bond amount needed"
            value={bondAmount}
            min={5_000}
            max={1_000_000}
            step={5_000}
            onChange={setBondAmount}
            suffix="USD"
            sublabel={money(bondAmount)}
          />
          <NumberSliderInput
            label="Principal credit score"
            value={creditScore}
            min={550}
            max={800}
            step={10}
            onChange={setCreditScore}
          />
          <div className="md:col-span-2">
            <NumberSliderInput
              label="Base approval probability per carrier"
              value={baseApprovalPct}
              min={20}
              max={90}
              step={5}
              onChange={setBaseApprovalPct}
              suffix="%"
              sublabel="Editable — plug in your real conversion rate from BuySuretyBonds data"
            />
            <p className="text-[10px] text-muted-foreground mt-1 italic">
              Default 60% is a directional estimate. SFAA does not publish
              industry approval rates. Use your actual single-carrier placement
              rate here to make the multi-carrier comparison defensible.
            </p>
          </div>
        </div>
      </section>

      {loading && <p>Loading carriers…</p>}
      {error && (
        <p className="text-red-600">
          Supabase error: {error}. Make sure `carrier_profiles` is seeded.
        </p>
      )}

      {!loading && !error && carriers.length === 0 && (
        <p className="text-amber-600">
          No carriers in the database yet. Seed `carrier_profiles` in Supabase.
        </p>
      )}

      {!loading && !error && carriers.length > 0 && (
        <>
          {/* HERO — the marketplace moat in one number */}
          <div className="rounded-lg border-2 border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/20 p-6">
            <p className="text-xs uppercase tracking-widest text-rose-700 dark:text-rose-400 font-semibold mb-2">
              🎯 The marketplace moat, in two numbers
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">With 1 carrier</p>
                <p className="text-4xl font-bold">{pct(approval1, 0)}</p>
                <p className="text-xs text-muted-foreground">approval odds</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">With 5 carriers</p>
                <p className="text-4xl font-bold text-emerald-700 dark:text-emerald-400">
                  {pct(approval5, 0)}
                </p>
                <p className="text-xs text-muted-foreground">approval odds</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  With all {ranked.length} carriers
                </p>
                <p className="text-4xl font-bold text-emerald-700 dark:text-emerald-400">
                  {pct(approval10, 0)}
                </p>
                <p className="text-xs text-muted-foreground">approval odds</p>
              </div>
            </div>
            <p className="text-sm mt-4 max-w-3xl">
              Customers don&apos;t choose BuySuretyBonds to save money — most
              bonds are commoditized. They choose it because it&apos;s the only
              place where their approval odds go from{" "}
              <strong>{pct(approval1, 0)}</strong> (direct to one carrier) to{" "}
              <strong>{pct(approval10, 0)}</strong> (full marketplace access).
            </p>
          </div>

          {/* RANKED TABLE */}
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Step 2 · Ranked carriers for this applicant
            </p>
            <div className="rounded-lg border p-5">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                      <th className="pb-2 pr-2">#</th>
                      <th className="pb-2 pr-2">Carrier</th>
                      <th className="pb-2 pr-2">AM Best</th>
                      <th className="pb-2 pr-2 text-right">Treasury</th>
                      <th className="pb-2 pr-2">Fit</th>
                      <th className="pb-2 pr-2 text-right">Approval</th>
                      <th className="pb-2 pr-2 text-right">Cumulative</th>
                      <th className="pb-2 pr-2">BondGenius</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranked.map((r, i) => {
                      const cumulative = combinedApproval(
                        ranked.slice(0, i + 1).map((x) => x.approvalProb),
                      );
                      const integrated = r.carrier.integrated_with_bondgenius;
                      return (
                        <tr key={r.carrier.id} className="border-b hover:bg-muted/30">
                          <td className="py-2 pr-2 text-muted-foreground">
                            {i + 1}
                          </td>
                          <td className="py-2 pr-2 font-medium">
                            {r.carrier.name}
                          </td>
                          <td className="py-2 pr-2">
                            <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-mono">
                              {r.carrier.am_best_rating}
                            </span>
                          </td>
                          <td className="py-2 pr-2 text-right font-mono text-xs">
                            {money(Number(r.carrier.treasury_limit))}
                          </td>
                          <td className="py-2 pr-2">
                            <div className="h-2 w-20 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-sky-500"
                                style={{ width: `${r.fitScore * 100}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                              {(r.fitScore * 100).toFixed(0)}
                            </span>
                          </td>
                          <td className="py-2 pr-2 text-right font-mono font-semibold">
                            {pct(r.approvalProb, 0)}
                          </td>
                          <td className="py-2 pr-2 text-right font-mono text-emerald-700 dark:text-emerald-400">
                            {pct(cumulative, 0)}
                          </td>
                          <td className="py-2 pr-2">
                            {integrated ? (
                              <span
                                className="text-emerald-600 dark:text-emerald-400"
                                title="Integrated with BondGenius"
                              >
                                ✓ integrated
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs">
                                —
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Approval = base 60% × fit_score × credit_adjustment. Cumulative
                = 1 − ∏(1 − p_i), assuming independence across carriers.
              </p>
            </div>
          </section>

          {/* APPROVAL CURVE */}
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Step 3 · The approval curve — why N carriers &gt; 1 carrier
            </p>
            <div className="rounded-lg border p-5 space-y-3">
              {[1, 3, 5, 7, 10].map((n) => {
                const prob = combined[n] ?? 0;
                return (
                  <div key={n} className="flex items-center gap-3">
                    <span className="text-sm font-mono w-24 shrink-0">
                      {n} carrier{n > 1 ? "s" : ""}
                    </span>
                    <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          n === 1
                            ? "bg-rose-500"
                            : n >= 5
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                        } transition-all`}
                        style={{ width: `${prob * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono font-semibold w-16 text-right">
                      {pct(prob, 0)}
                    </span>
                  </div>
                );
              })}
              <p className="text-xs text-muted-foreground mt-3">
                Direct-to-one-carrier companies convert {pct(approval1, 0)} of
                qualified traffic. A multi-carrier marketplace converts{" "}
                {pct(approval5, 0)}+ with just 5 carriers — same customer, same
                credit, same bond. That&apos;s the distribution moat.
              </p>
            </div>
          </section>

          {/* NICK'S ECONOMIC ANGLE */}
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Step 4 · What this means for Nick&apos;s economics
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <MetricCard
                label="Conversion lift"
                value={`${(approval5 / approval1).toFixed(1)}x`}
                sublabel={`${pct(approval1, 0)} → ${pct(approval5, 0)} with 5 carriers`}
                accent="rose"
              />
              <MetricCard
                label="Carriers already integrated"
                value={`${integratedCount}/${ranked.length}`}
                sublabel="with BondGenius"
                accent="emerald"
              />
              <MetricCard
                label="Revenue per bond (this applicant)"
                value={money(nickRevenuePerBond)}
                sublabel={`Nick at ${pct(nickTakeRate)} on ~${money(approxPremium)} premium`}
                accent="sky"
              />
            </div>
            <div className="rounded-md bg-muted/40 p-4 text-sm">
              <p className="font-medium mb-1">
                💡 Why this compounds with the rest of the pitch
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Panel 1 showed the per-bond economics. Panel 2 showed the book
                compounds via renewals. Panel 3 showed each carrier integration
                unlocks ROI. <strong>Panel 4 closes the loop:</strong> the
                reason customers keep coming back is the approval rate. More
                carriers on BondGenius → higher approval → higher conversion →
                more premium volume feeding Panels 1-3.{" "}
                {topCarrier && (
                  <>
                    Top match for this applicant:{" "}
                    <strong>{topCarrier.carrier.name}</strong> at{" "}
                    {pct(topCarrier.approvalProb, 0)} individual approval.
                  </>
                )}
              </p>
            </div>
          </section>
        </>
      )}

      {/* CTA */}
      <div className="rounded-lg border p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-semibold text-sm">
            End of the pitch · back to the start
          </p>
          <p className="text-xs text-muted-foreground">
            The 4 panels together answer every major investor question: unit
            economics, compounding, carrier ROI, and the marketplace moat.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/panel1"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted transition"
          >
            ← Back to Panel 1
          </Link>
          <Link
            href="/"
            className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition"
          >
            Home
          </Link>
        </div>
      </div>

      <SourcesFooter panelSources={[
        "Carrier profiles: 10 carriers seeded from public data (AM Best, Treasury 570 listings)",
        "Treasury limits: directional estimates from carrier 10-Ks (Apr 2024)",
        "Fit score formula: 0.4×treasury + 0.3×state + 0.3×segment (proprietary weighting)",
        "Base approval probability 60%: directional estimate — SFAA does not publish approval rates",
        "Combined probability: 1 − ∏(1−p_i), assumes independent underwriting decisions",
        "⚠️ Calibrate against Nick's actual BuySuretyBonds conversion data before investor use"
      ]} />
    </div>
  );
}
