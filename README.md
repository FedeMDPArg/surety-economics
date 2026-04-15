# 🚀 Surety Bond Unit Economics Platform

Built for **Nick (BuySuretyBonds.com, BondGenius.ai, BondSigner.com)** as the Day 3 deliverable of a 60-day trial with profit-share.

An interactive 4-panel app that models the **unit economics of the US surety bond market** — who gets what out of every premium dollar, why the business compounds, and how the transition from sub-agent to primary agent is a 5x revenue unlock.

---

## 🎯 What it shows

| Panel | URL | Strategic question |
|---|---|---|
| 1 | [/panel1](./app/panel1) | How each premium dollar splits across the surety value chain, with a toggle for sub-agent (3%) vs primary agent (15%) |
| 2 | [/panel2](./app/panel2) | Cohort-based renewal engine showing why revenue compounds (the moat) |
| 3 | [/panel3](./app/panel3) | ROI calculator for a carrier + live AI chat (Claude Sonnet 4.6) |
| 4 | [/panel4](./app/panel4) | Carrier appetite match — why multi-carrier beats single-carrier |

**See [GUIA_EXPLICADA.md](./GUIA_EXPLICADA.md) for the full pedagogical breakdown** of every calculation, assumption, and how to pitch it.

---

## 🛠️ Stack

- **Next.js 16** (App Router, TypeScript)
- **Supabase** (Postgres + SSR auth)
- **Tailwind CSS** + shadcn/ui
- **Chart.js** + react-chartjs-2
- **Anthropic SDK** (Claude Sonnet 4.6 for Panel 3 chat)
- **Vercel** (hosting)

**MCP servers** used during development to manage Supabase schema, Notion docs, and Google Calendar directly from Claude Code.

---

## 🏃 Run locally

```bash
pnpm install
pnpm dev
# → http://localhost:3000
```

Required env vars in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...   # same as anon key
ANTHROPIC_API_KEY=...                       # only needed for Panel 3
```

---

## 📚 Project docs

- [CONTEXTO_Nick60Days.md](./CONTEXTO_Nick60Days.md) — context for bootstrapping new Claude Code conversations
- [GUIA_EXPLICADA.md](./GUIA_EXPLICADA.md) — full explanation of every panel, glossary, how to pitch each one
- Notion workspace — [Nick 60 Days Hub](https://www.notion.so/33de4afe6f5a81698060e571eb8603c7) (private)

---

## 🧠 The economic model in one paragraph

A customer needs a $100,000 surety bond. They pay a **premium** of ~$2,000 (rate = 2% of bond amount). Of that premium, the **carrier keeps 85% ($1,700)** to cover losses + OpEx + profit; the **channel commission is 15% ($300)**, split between the **primary agency (12% = $240)** who has the direct contract with the carrier, and **Nick as a sub-agent (3% = $60)** who brings the customer via SEO. When Nick finishes securing his own producer licenses and becomes a primary agent, he captures the **15% full channel commission → $300 per bond, a 5x revenue multiplier without any operational change**.

That single insight — visible interactively via the toggle in Panel 1 — is the most important valuation argument in the whole pitch.
