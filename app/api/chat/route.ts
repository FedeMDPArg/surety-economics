import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

// System prompt — loaded with surety market data for Panel 3.
// With prompt caching, this is cached on the server side of Anthropic
// and reused across requests for 10x cost reduction after the first call.
const SURETY_SYSTEM_PROMPT = `You are a surety bond market analyst advising a carrier (insurance company) on whether to integrate with a digital surety platform like BondGenius / BuySuretyBonds. Be crisp, concrete, and quantitative. Favor short answers grounded in these facts.

MARKET DATA (verified, US, 2024):
- US surety market: ~$9.5B direct premiums written (SFAA Top 100)
- CAGR: 8-10% (WTW Insurance Marketplace Realities 2024)
- Industry loss ratio 2024 YTD: 24.9% (SFAA) — highest in 5 years
- Commercial surety loss ratio historic: 5-15%
- Contract surety loss ratio historic: 20-30%, rising with inflation
- Renewal rates: commercial 75-88%, contract ~60%
- Demand is legally mandated (principals must maintain bonds to operate)

PREMIUM ECONOMICS (how each dollar splits):
- Carrier retention: 80-85% of premium (covers losses + OpEx + profit)
- Channel commission: 15-20% of premium (the distribution layer)
- Primary agency (licensed) typically takes 10-15% of premium
- Sub-agents / digital platforms: 2-5% override
- Commercial rate paid by principals: 1-3% of bond amount (depends on credit)

CARRIERS (major US players):
- Travelers (#1 in US surety, ~12% market share)
- Liberty Mutual, CNA, Zurich, Old Republic, Hartford, Chubb, Nationwide
- Mono-line: Old Republic Surety, Merchants Bonding

DIGITALIZATION ECONOMICS (what a carrier gains by integrating):
- Premium uplift from digital distribution: ~+15% (McKinsey insurance reports)
- FTE reduction per $10M GWP: 4 FTEs (from ~6 non-digital to ~2 digital)
- Loaded FTE cost: ~$120K/year → $480K saved per $10M GWP
- Lost renewals recoverable: 12-15% (today lost to friction)
- Time-to-quote: from 2-5 days manual to ~60 seconds digital

STYLE:
- Use USD figures, not % unless clearer.
- If asked about a specific carrier, give its rough profile but flag that exact numbers require their 10-K.
- If user asks something you don't know, say so. Don't invent.
- 2-5 sentences per answer unless user asks for detail.`;

// Mock responses triggered by keywords in the user's message.
// This lets Panel 3 work without an Anthropic key.
function mockResponse(userMessage: string): string {
  const q = userMessage.toLowerCase();

  if (/loss ratio|claims/.test(q)) {
    return "Surety loss ratios run 5-15% in commercial and 20-30% in contract, but industry-wide 2024 YTD hit 24.9% (SFAA) — highest in 5 years, driven by inflation cost overruns and labor market strain. That's still half to a third of typical P&C lines, which is why surety is attractive even post-shock.";
  }
  if (/renewal|churn/.test(q)) {
    return "Commercial surety renews at 75-88% annually — notary 75%, contractor license 88%, auto dealer ~82%, freight broker ~80%. Contract bonds renew ~60% because they're more project-bound. Combined with 10-15% annual churn, a well-placed commercial book compounds 2-3x its year-1 revenue in LTV terms.";
  }
  if (/premium|rate|cost of bond/.test(q)) {
    return "Principals pay 1-3% of bond amount annually for commercial surety (well-qualified credit). Poor credit goes 5-10%. Performance bonds in construction: 1-3% of contract value. So a $100K bond generates ~$2K in premium, of which the carrier keeps ~$1,700 and the channel keeps ~$300.";
  }
  if (/commission|agent|broker|channel|split/.test(q)) {
    return "Carriers pay 15-20% of premium as channel commission. A traditional primary agency (licensed, with carrier appointments) takes 10-15%. A digital sub-agent like BuySuretyBonds gets 2-5% override today, but once licensed as primary they capture the full 15% — that's the 5x revenue unlock.";
  }
  if (/carrier|travelers|liberty|cna|zurich|old republic|hartford|chubb|nationwide/.test(q)) {
    return "The top US surety carriers are Travelers (#1, ~12% share), Liberty Mutual, CNA, Zurich, Old Republic (mono-line), Hartford, Chubb, and Nationwide. A typical multi-line P&C carrier has 2-8% of its total book in surety. Integrating with a digital platform can lift that share ~15% and cut FTE cost by ~4 per $10M GWP.";
  }
  if (/roi|integrate|integration|digital|automation|efficiency/.test(q)) {
    return "ROI for a carrier integrating with BondGenius: premium uplift ~15% (better digital conversion), FTE reduction ~4 per $10M GWP (≈$480K/yr saved per $10M), lost-renewal recovery 12-15%, time-to-quote from 2-5 days to ~60 seconds. For a carrier with $500M premium at 8% surety share ($40M GWP), expect $6M incremental premium + 16 FTEs saved.";
  }
  if (/market size|tam|sam|opportunity/.test(q)) {
    return "US surety market: ~$9.5B direct premiums written (2023-2024 SFAA). CAGR 8-10%. Demand legally mandated (no discretionary contraction in recessions). Globally surety is >$20B. The digital distribution layer is still <10% penetrated — that's the whitespace.";
  }
  if (/moat|compound|ltv|lifetime|recurring/.test(q)) {
    return "Surety compounds because of renewal rates: 75-88% of commercial bonds renew annually. Stack 5 years of that plus 10% churn and each bond generates 2-3x its year-1 net in lifetime value. Combined with modest YoY growth, a surety book grows revenue faster than new-customer acquisition — classic SaaS-like economics with legally-mandated demand.";
  }
  if (/buysurety|bondgenius|bondsigner|nick/.test(q)) {
    return "Nick runs three connected products: BuySuretyBonds.com (DTC marketplace capturing demand via SEO, 50,000+ bond types, instant approval), BondGenius.ai (white-label automation engine for carriers and agencies), and BondSigner.com (E-SIGN Act compliant e-signature). The strategy: own the demand funnel, automate the underwriting layer, close the legal signature layer — then sell access to carriers who want digital distribution without building it.";
  }

  // Generic fallback
  return "I can answer questions about surety bond economics, renewal rates, loss ratios, channel commissions, digitalization ROI for carriers, market size, and BuySuretyBonds/BondGenius. Try asking something like: \"what's the typical carrier commission split?\" or \"what's the ROI of integrating with BondGenius?\" (Mock mode — add ANTHROPIC_API_KEY to .env.local for live Claude responses.)";
}

export async function POST(request: Request) {
  const { messages }: { messages: ChatMessage[] } = await request.json();

  if (!messages || messages.length === 0) {
    return NextResponse.json({ error: "No messages provided" }, { status: 400 });
  }

  const lastUserMessage =
    messages.filter((m) => m.role === "user").pop()?.content ?? "";

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Mock mode — no API key configured
  if (!apiKey) {
    const reply = mockResponse(lastUserMessage);
    return NextResponse.json({ reply, mode: "mock" });
  }

  // Real mode — call Claude Sonnet 4.6 with prompt caching
  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      system: [
        {
          type: "text",
          text: SURETY_SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const reply =
      textBlock && "text" in textBlock
        ? textBlock.text
        : "(No text response from model.)";

    return NextResponse.json({
      reply,
      mode: "live",
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
        cache_creation_tokens: response.usage.cache_creation_input_tokens ?? 0,
        cache_read_tokens: response.usage.cache_read_input_tokens ?? 0,
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: `Anthropic API error: ${msg}`,
        fallback: mockResponse(lastUserMessage),
        mode: "error",
      },
      { status: 500 },
    );
  }
}
