"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { money, pct } from "@/lib/utils";
import { MetricCard, NumberSliderInput } from "@/components/panel-ui";
import { useSuretyStore } from "@/lib/store";

type ChatMessage = { role: "user" | "assistant"; content: string };
type ChatResponse = {
  reply: string;
  mode: "mock" | "live" | "error";
  fallback?: string;
};

type CarrierPreset = {
  id: string;
  name: string;
  description: string;
  annualPremiums: number;
  suretyShare: number;
  issuanceDays: number;
  renewalRate: number;
  tagline: string;
};

const CARRIER_PRESETS: CarrierPreset[] = [
  {
    id: "travelers",
    name: "Travelers",
    description: "#1 US surety carrier, ~12% market share",
    annualPremiums: 35_000_000_000,
    suretyShare: 0.04,
    issuanceDays: 4,
    renewalRate: 0.84,
    tagline: "Industry leader",
  },
  {
    id: "liberty",
    name: "Liberty Mutual",
    description: "Global multi-line, growing surety line",
    annualPremiums: 50_000_000_000,
    suretyShare: 0.02,
    issuanceDays: 5,
    renewalRate: 0.82,
    tagline: "Multi-line giant",
  },
  {
    id: "cna",
    name: "CNA",
    description: "Commercial-focused, surety specialist",
    annualPremiums: 12_000_000_000,
    suretyShare: 0.08,
    issuanceDays: 3,
    renewalRate: 0.86,
    tagline: "Surety specialist",
  },
  {
    id: "midsized",
    name: "Mid-sized regional",
    description: "Typical regional P&C with active surety book",
    annualPremiums: 500_000_000,
    suretyShare: 0.1,
    issuanceDays: 4,
    renewalRate: 0.8,
    tagline: "Regional / specialty",
  },
];

// Assumptions — same as before
const DIGITAL_PREMIUM_UPLIFT = 0.15;
const FTE_BASELINE_PER_10M = 6;
const FTE_DIGITAL_PER_10M = 2;
const LOADED_FTE_COST = 120_000;
const LOST_RENEWALS_RECOVERABLE = 0.13;
const DIGITAL_ISSUANCE_MINUTES = 1;

const SAMPLE_QUESTIONS = [
  "How does BondGenius reduce FTE cost?",
  "Why would a carrier give away commission to a digital platform?",
  "What's the typical surety loss ratio?",
  "How do multi-carrier marketplaces compare to direct?",
];

export default function Panel3Page() {
  const mode = useSuretyStore((s) => s.mode);
  const setMode = useSuretyStore((s) => s.setMode);
  const subAgentOverride = useSuretyStore((s) => s.subAgentOverride);
  const primaryCommission = useSuretyStore((s) => s.primaryCommission);
  const nickTakeRate = mode === "sub-agent" ? subAgentOverride : primaryCommission;
  const altTakeRate = mode === "sub-agent" ? primaryCommission : subAgentOverride;

  // Carrier state
  const [selectedPreset, setSelectedPreset] = useState<string>("travelers");
  const [customMode, setCustomMode] = useState(false);
  const [annualPremiums, setAnnualPremiums] = useState(35_000_000_000);
  const [suretyShare, setSuretyShare] = useState(0.04);
  const [issuanceDays, setIssuanceDays] = useState(4);
  const [renewalRate, setRenewalRate] = useState(0.84);

  const loadPreset = (p: CarrierPreset) => {
    setSelectedPreset(p.id);
    setCustomMode(false);
    setAnnualPremiums(p.annualPremiums);
    setSuretyShare(p.suretyShare);
    setIssuanceDays(p.issuanceDays);
    setRenewalRate(p.renewalRate);
  };

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [chatMode, setChatMode] = useState<"unknown" | "mock" | "live">("unknown");
  const [chatOpen, setChatOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatOpen) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending, chatOpen]);

  // ─── CORE CALCULATIONS ───
  const calc = useMemo(() => {
    const gwpSurety = annualPremiums * suretyShare;

    // BEFORE integrating with Nick
    const beforeFTEs = (gwpSurety / 10_000_000) * FTE_BASELINE_PER_10M;
    const beforeFTECost = beforeFTEs * LOADED_FTE_COST;
    const beforeLostRenewals = gwpSurety * renewalRate * LOST_RENEWALS_RECOVERABLE;
    const beforePremium = gwpSurety;
    const beforeTimeToQuoteDays = issuanceDays;

    // AFTER integrating with Nick
    const afterFTEs = (gwpSurety / 10_000_000) * FTE_DIGITAL_PER_10M;
    const afterFTECost = afterFTEs * LOADED_FTE_COST;
    const fteSavings = beforeFTECost - afterFTECost;
    const premiumUplift = gwpSurety * DIGITAL_PREMIUM_UPLIFT;
    const afterPremium = beforePremium + premiumUplift;
    const recoveredRenewals = beforeLostRenewals; // now captured
    const afterTimeToQuoteMinutes = DIGITAL_ISSUANCE_MINUTES;

    const carrierAnnualUpside = premiumUplift + fteSavings + recoveredRenewals;

    // NICK'S CAPTURE
    // Nick's platform earns commission on the incremental premium (the +15% uplift)
    // plus ongoing commission on the recovered renewals.
    const nickAnnualCommission =
      (premiumUplift + recoveredRenewals) * nickTakeRate;
    const nickAnnualAltCommission =
      (premiumUplift + recoveredRenewals) * altTakeRate;

    return {
      gwpSurety,
      beforePremium,
      beforeFTEs,
      beforeFTECost,
      beforeLostRenewals,
      beforeTimeToQuoteDays,
      afterPremium,
      afterFTEs,
      afterFTECost,
      afterTimeToQuoteMinutes,
      premiumUplift,
      fteSavings,
      recoveredRenewals,
      carrierAnnualUpside,
      nickAnnualCommission,
      nickAnnualAltCommission,
    };
  }, [annualPremiums, suretyShare, issuanceDays, renewalRate, nickTakeRate, altTakeRate]);

  const currentCarrier =
    CARRIER_PRESETS.find((p) => p.id === selectedPreset) ?? null;
  const displayName = customMode ? "Custom carrier" : currentCarrier?.name ?? "Carrier";

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || sending) return;
    const newMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data: ChatResponse = await res.json();
      const reply = data.reply ?? data.fallback ?? "(error)";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
      if (data.mode === "live" || data.mode === "mock") setChatMode(data.mode);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Network error — try again." }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6 md:p-10 space-y-8">
      {/* HEADER */}
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-amber-600 font-semibold">
          Panel 3
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Carrier Pitch: Before & After Nick
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          When Nick sits down with a VP of Surety at Travelers, Liberty, or CNA,
          this is what he shows. Pick a carrier below to see <strong>their
          transformation from integrating with BondGenius</strong> — and exactly
          how much of that flows back as revenue to Nick.
        </p>
      </header>

      {/* SECTION 1 — CARRIER PICKER */}
      <section className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
          Step 1 · Pick a carrier profile
        </p>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {CARRIER_PRESETS.map((p) => {
            const active = selectedPreset === p.id && !customMode;
            return (
              <button
                key={p.id}
                onClick={() => loadPreset(p)}
                className={`rounded-lg border p-4 text-left transition ${
                  active
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30 ring-1 ring-amber-500"
                    : "hover:bg-muted/50"
                }`}
              >
                <p className="font-semibold">{p.name}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                  {p.tagline}
                </p>
                <p className="text-xs text-muted-foreground mt-2 leading-snug">
                  {p.description}
                </p>
                <p className="text-xs font-mono mt-2">
                  {money(p.annualPremiums)} total · {pct(p.suretyShare)} surety
                </p>
              </button>
            );
          })}
          <button
            onClick={() => setCustomMode(true)}
            className={`rounded-lg border p-4 text-left transition ${
              customMode
                ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30 ring-1 ring-amber-500"
                : "hover:bg-muted/50"
            }`}
          >
            <p className="font-semibold">Custom</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
              Your own numbers
            </p>
            <p className="text-xs text-muted-foreground mt-2 leading-snug">
              Drop in a specific carrier&apos;s figures with sliders.
            </p>
          </button>
        </div>

        {customMode && (
          <div className="rounded-lg border p-5 space-y-5 bg-muted/20">
            <div className="grid gap-4 md:grid-cols-2">
              <NumberSliderInput
                label="Annual premiums total ($)"
                value={annualPremiums}
                min={50_000_000}
                max={50_000_000_000}
                step={50_000_000}
                onChange={setAnnualPremiums}
                suffix="USD"
                sublabel={money(annualPremiums)}
              />
              <NumberSliderInput
                label="% in surety line"
                value={suretyShare * 100}
                min={0.5}
                max={30}
                step={0.5}
                onChange={(v) => setSuretyShare(v / 100)}
                suffix="%"
                sublabel={`GWP: ${money(annualPremiums * suretyShare)}`}
              />
              <NumberSliderInput
                label="Current issuance time (days)"
                value={issuanceDays}
                min={1}
                max={15}
                step={1}
                onChange={setIssuanceDays}
                suffix="days"
              />
              <NumberSliderInput
                label="Renewal rate"
                value={renewalRate * 100}
                min={50}
                max={95}
                step={1}
                onChange={(v) => setRenewalRate(v / 100)}
                suffix="%"
              />
            </div>
          </div>
        )}
      </section>

      {/* SECTION 2 — BEFORE & AFTER (the money shot) */}
      <section className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
          Step 2 · The carrier&apos;s transformation
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>{displayName}</strong> today runs ~{money(calc.gwpSurety)} in annual
          surety premium through a traditional channel. Integrating with
          BondGenius changes that as follows.
        </p>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* BEFORE */}
          <div className="rounded-lg border border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/10 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs uppercase tracking-widest font-bold text-rose-700 dark:text-rose-400">
                Before · Without BondGenius
              </span>
              <span className="text-xs text-muted-foreground">(status quo)</span>
            </div>
            <div className="space-y-3 text-sm">
              <ComparisonRow
                label="Annual surety GWP"
                value={money(calc.beforePremium)}
                tone="neutral"
              />
              <ComparisonRow
                label="Time to quote"
                value={`${calc.beforeTimeToQuoteDays} days`}
                tone="bad"
              />
              <ComparisonRow
                label="FTEs dedicated to surety ops"
                value={`${calc.beforeFTEs.toFixed(1)} FTEs`}
                tone="bad"
              />
              <ComparisonRow
                label="Annual FTE cost"
                value={money(calc.beforeFTECost)}
                tone="bad"
              />
              <ComparisonRow
                label="Lost renewals (friction)"
                value={`−${money(calc.beforeLostRenewals)}/yr`}
                tone="bad"
              />
              <div className="pt-3 border-t border-rose-500/30">
                <p className="text-xs text-muted-foreground">
                  Status: growth plateaued, losing share to digital competitors,
                  running an expensive manual operation.
                </p>
              </div>
            </div>
          </div>

          {/* AFTER */}
          <div className="rounded-lg border border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs uppercase tracking-widest font-bold text-emerald-700 dark:text-emerald-400">
                After · With BondGenius
              </span>
              <span className="text-xs text-muted-foreground">🚀</span>
            </div>
            <div className="space-y-3 text-sm">
              <ComparisonRow
                label="Annual surety GWP"
                value={money(calc.afterPremium)}
                delta={`+${money(calc.premiumUplift)} (+15%)`}
                tone="good"
              />
              <ComparisonRow
                label="Time to quote"
                value={`~${calc.afterTimeToQuoteMinutes} min`}
                delta={`${issuanceDays}d → 1min`}
                tone="good"
              />
              <ComparisonRow
                label="FTEs dedicated to surety ops"
                value={`${calc.afterFTEs.toFixed(1)} FTEs`}
                delta={`−${(calc.beforeFTEs - calc.afterFTEs).toFixed(1)} FTEs`}
                tone="good"
              />
              <ComparisonRow
                label="Annual FTE cost"
                value={money(calc.afterFTECost)}
                delta={`−${money(calc.fteSavings)}`}
                tone="good"
              />
              <ComparisonRow
                label="Lost renewals recovered"
                value={`+${money(calc.recoveredRenewals)}/yr`}
                tone="good"
              />
              <div className="pt-3 border-t border-emerald-500/40">
                <p className="text-xs text-muted-foreground">
                  Status: instant-approval distribution, reduced cost base,
                  book growing with the digital channel.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CARRIER NET UPSIDE HERO */}
        <div className="rounded-lg border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 p-6 text-center">
          <p className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold mb-2">
            {displayName} · net annual upside from integrating
          </p>
          <p className="text-5xl font-bold text-emerald-700 dark:text-emerald-300">
            +{money(calc.carrierAnnualUpside)}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            = {money(calc.premiumUplift)} premium uplift +{" "}
            {money(calc.fteSavings)} FTE savings +{" "}
            {money(calc.recoveredRenewals)} recovered renewals
          </p>
        </div>
      </section>

      {/* SECTION 3 — NICK'S CAPTURE */}
      <section className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
          Step 3 · What Nick captures from the deal
        </p>
        <p className="text-sm text-muted-foreground">
          When this carrier&apos;s book grows through BondGenius,{" "}
          <strong>Nick earns commission on the incremental premium and
          recovered renewals</strong> that flow through the platform. Here&apos;s
          that number — with today&apos;s role and the primary-agent future.
        </p>

        <div className="rounded-lg border border-sky-500/40 bg-sky-50 dark:bg-sky-950/20 p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-sky-700 dark:text-sky-400 font-semibold">
                Nick&apos;s annual revenue from {displayName}
              </p>
              <p className="text-xs text-muted-foreground">
                Commission on the {money(calc.premiumUplift + calc.recoveredRenewals)}{" "}
                incremental premium flowing through BondGenius
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
                Sub-agent (today)
              </button>
              <button
                onClick={() => setMode("primary-agent")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  mode === "primary-agent"
                    ? "bg-emerald-600 text-white"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Primary agent (future) 🚀
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              label={`Today (${pct(nickTakeRate)})`}
              value={money(
                mode === "sub-agent" ? calc.nickAnnualCommission : calc.nickAnnualAltCommission,
              )}
              sublabel={`as sub-agent`}
            />
            <MetricCard
              label={`Future (${pct(altTakeRate > nickTakeRate ? altTakeRate : nickTakeRate)})`}
              value={money(
                mode === "sub-agent" ? calc.nickAnnualAltCommission : calc.nickAnnualCommission,
              )}
              sublabel={`as primary agent`}
              accent="emerald"
            />
            <MetricCard
              label="Upside per carrier deal"
              value={`${(
                Math.max(calc.nickAnnualCommission, calc.nickAnnualAltCommission) /
                Math.max(
                  1,
                  Math.min(calc.nickAnnualCommission, calc.nickAnnualAltCommission),
                )
              ).toFixed(1)}x`}
              sublabel={`+${money(
                Math.abs(calc.nickAnnualAltCommission - calc.nickAnnualCommission),
              )}/yr moving to primary`}
              accent="amber"
            />
          </div>

          <div className="rounded-md bg-background/60 p-4 text-sm">
            <p className="font-medium mb-1">💰 Scale this across carrier deals</p>
            <p className="text-xs text-muted-foreground">
              Closing <strong>3 carrier integrations like {displayName}</strong>{" "}
              generates{" "}
              <strong className="text-foreground">
                {money(
                  (mode === "sub-agent"
                    ? calc.nickAnnualCommission
                    : calc.nickAnnualCommission) * 3,
                )}
                /yr
              </strong>{" "}
              in platform revenue for Nick at today&apos;s take rate — or{" "}
              <strong className="text-emerald-700 dark:text-emerald-400">
                {money(
                  Math.max(calc.nickAnnualCommission, calc.nickAnnualAltCommission) * 3,
                )}
                /yr
              </strong>{" "}
              once licensed as primary. This is the carrier-integration TAM story.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3b — DEAL STRUCTURE + BREAK-EVEN */}
      <section className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
          Step 3b · Deal structure & break-even for the carrier
        </p>
        <p className="text-sm text-muted-foreground">
          Anticipates the carrier&apos;s internal counter-question:{" "}
          <em>&ldquo;how long until this integration pays off, and what do we
          give up?&rdquo;</em>
        </p>
        <DealStructureCard
          carrierName={displayName}
          carrierAnnualUpside={calc.carrierAnnualUpside}
          nickAnnualCommission={calc.nickAnnualCommission}
          premiumUplift={calc.premiumUplift}
          fteSavings={calc.fteSavings}
          recoveredRenewals={calc.recoveredRenewals}
        />
      </section>

      {/* SECTION 4 — AI CHAT (collapsed) */}
      <section className="space-y-3">
        <button
          onClick={() => setChatOpen((v) => !v)}
          className="w-full rounded-lg border p-4 flex items-center justify-between hover:bg-muted/50 transition"
        >
          <div className="text-left">
            <p className="font-semibold text-sm">
              {chatOpen ? "▼" : "▶"} Advanced · Ask the surety market analyst AI
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {chatMode === "live"
                ? "Live Claude Sonnet 4.6 with surety data loaded"
                : "Mock mode — keyword-based demo responses (no cost, no API key needed)"}
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            {chatOpen ? "Collapse" : "Expand"}
          </span>
        </button>

        {chatOpen && (
          <div className="rounded-lg border flex flex-col h-[420px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                  <p className="text-xs text-muted-foreground max-w-md">
                    Try common questions a carrier executive might ask during the
                    pitch:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
                    {SAMPLE_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        disabled={sending}
                        className="rounded-full border bg-background px-3 py-1.5 text-xs hover:bg-muted transition disabled:opacity-50"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                      m.role === "user"
                        ? "bg-foreground text-background"
                        : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="flex gap-1 items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse" />
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse"
                        style={{ animationDelay: "200ms" }}
                      />
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse"
                        style={{ animationDelay: "400ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="border-t p-3 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about surety economics, carrier ROI..."
                disabled={sending}
                className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </section>

      {/* CTA */}
      <div className="rounded-lg border p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-semibold text-sm">
            Next: why carriers want multi-carrier distribution
          </p>
          <p className="text-xs text-muted-foreground">
            Panel 4 flips the angle: instead of one carrier integrating, show
            why multi-carrier access is the approval-rate argument for Nick&apos;s
            marketplace.
          </p>
        </div>
        <Link
          href="/panel4"
          className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition"
        >
          Continue to Panel 4 →
        </Link>
      </div>
    </div>
  );
}

/** Integration cost assumption for a large carrier (engineering, vendor due diligence, legal). */
const CARRIER_INTEGRATION_COST = 500_000;

function DealStructureCard({
  carrierName,
  carrierAnnualUpside,
  nickAnnualCommission,
  premiumUplift,
  fteSavings,
  recoveredRenewals,
}: {
  carrierName: string;
  carrierAnnualUpside: number;
  nickAnnualCommission: number;
  premiumUplift: number;
  fteSavings: number;
  recoveredRenewals: number;
}) {
  // Break-even: months until cumulative carrier upside covers integration cost
  const monthlyUpside = carrierAnnualUpside / 12;
  const breakEvenMonths =
    monthlyUpside > 0 ? CARRIER_INTEGRATION_COST / monthlyUpside : Infinity;
  const nickCostOfServingDeal = nickAnnualCommission * 0.2; // rough: 20% of Nick's commission goes to support/eng
  const nickNetFromDeal = nickAnnualCommission - nickCostOfServingDeal;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Deal structure */}
      <div className="rounded-lg border p-5 space-y-3">
        <p className="text-sm font-semibold">Who keeps what</p>
        <ul className="text-xs space-y-2">
          <li className="flex justify-between border-b pb-1.5">
            <span className="text-muted-foreground">
              Premium uplift ({carrierName} captures)
            </span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400">
              {money(premiumUplift)}/yr
            </span>
          </li>
          <li className="flex justify-between border-b pb-1.5">
            <span className="text-muted-foreground">
              FTE savings ({carrierName} captures)
            </span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400">
              {money(fteSavings)}/yr
            </span>
          </li>
          <li className="flex justify-between border-b pb-1.5">
            <span className="text-muted-foreground">
              Recovered renewals ({carrierName} captures)
            </span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400">
              {money(recoveredRenewals)}/yr
            </span>
          </li>
          <li className="flex justify-between border-b pb-1.5">
            <span className="text-muted-foreground">
              Nick&apos;s commission (on incremental premium)
            </span>
            <span className="font-mono text-sky-700 dark:text-sky-400">
              {money(nickAnnualCommission)}/yr
            </span>
          </li>
          <li className="flex justify-between border-b pb-1.5">
            <span className="text-muted-foreground">
              Nick&apos;s cost to serve this deal (~20%)
            </span>
            <span className="font-mono text-rose-700 dark:text-rose-400">
              −{money(nickCostOfServingDeal)}/yr
            </span>
          </li>
          <li className="flex justify-between pt-1 font-semibold">
            <span>Nick net from {carrierName} deal</span>
            <span className="font-mono">{money(nickNetFromDeal)}/yr</span>
          </li>
        </ul>
        <p className="text-[11px] text-muted-foreground leading-snug pt-2 border-t">
          Carrier keeps the uplift + savings; Nick earns commission on the
          incremental premium flowing through the platform. Structure is a
          white-label override, not a joint venture.
        </p>
      </div>

      {/* Break-even */}
      <div className="rounded-lg border p-5 space-y-3">
        <p className="text-sm font-semibold">Carrier break-even</p>
        <div className="rounded-md bg-muted/50 p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Integration cost (one-time)</span>
            <span className="font-mono">{money(CARRIER_INTEGRATION_COST)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Monthly upside</span>
            <span className="font-mono">{money(monthlyUpside)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold pt-2 border-t">
            <span>Break-even</span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400">
              Month {breakEvenMonths.toFixed(1)}
            </span>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground leading-snug">
          At {money(monthlyUpside)}/mo of upside, the carrier recoups the{" "}
          {money(CARRIER_INTEGRATION_COST)} integration spend in roughly{" "}
          {breakEvenMonths < 12 ? `month ${breakEvenMonths.toFixed(1)}` : `${(breakEvenMonths / 12).toFixed(1)} years`}
          . Every month after that is pure margin. For a carrier with
          multi-year planning horizons, this is a no-brainer ROI.
        </p>
        <p className="text-[10px] text-muted-foreground italic">
          Integration cost is an industry-standard estimate (eng + vendor DD +
          legal). Nick can adjust based on specific carrier scope.
        </p>
      </div>
    </div>
  );
}

function ComparisonRow({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: string;
  delta?: string;
  tone: "good" | "bad" | "neutral";
}) {
  const valueTone =
    tone === "good"
      ? "text-emerald-700 dark:text-emerald-400"
      : tone === "bad"
        ? "text-rose-700 dark:text-rose-400"
        : "text-foreground";
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="text-right">
        <span className={`font-mono font-semibold text-sm ${valueTone}`}>
          {value}
        </span>
        {delta && (
          <span className="block text-[10px] text-muted-foreground font-mono">
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}
