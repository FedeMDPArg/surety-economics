# 🚀 CONTEXTO — Federico Scarcella × Nick 60 Days

> **Usar este archivo para darle contexto a Claude Code al inicio de cualquier chat nuevo.**
> Pegá este contenido al comienzo de la conversación para que tenga todo.

**Última actualización:** 2026-04-15 — modelo económico reescrito (Nick = sub-agent 3% → primary agent 15%)

---

## 👤 Quién soy y qué estoy haciendo

Soy **Federico Scarcella**, trabajo en uno de los private equity más grandes del mundo.
Estoy en un **período de prueba de 60 días** con **Nick (Nicholas Thoroughman)**, fundador de BuySuretyBonds.com, BondGenius.ai y BondSigner.com.

El acuerdo es **profit share** — no equity todavía, pero abierto a serlo si demuestro valor real.
Mi diferencial: **entender el NEGOCIO mejor que cualquier developer + usar IA (Claude Code + MCP servers) para ejecutar**.

**No tengo background de programación** — aprendo construyendo.

---

## 🏢 La Empresa: Nick 60 Days

**Fundador:** Nick (Nicholas Thoroughman)
**Industria:** Seguros — específicamente **Surety Bonds en EE.UU.** Los clientes son empresas y profesionales (contratistas, notarios, freight brokers, auto dealers) que por ley necesitan obtener y renovar estos bonds para operar.
**Mercado:** ~$9.5B anuales, CAGR 8–10%, obligatorio por ley, renewal rates 75–88% (commercial) / ~60% (contract).

### Los 3 productos de Nick

| Producto | Qué es | Rol |
|---|---|---|
| **BuySuretyBonds.com** | Marketplace DTC donde clientes compran bonds. 50,000+ tipos, 50 estados, aprobación instant 24/7 | Captura demanda via SEO. Genera leverage con carriers |
| **BondGenius.ai** | Motor de IA que automatiza el ciclo completo: quote → underwriting → e-sign → pago → delivery → renewals | Producto B2B white-label para carriers y agencias |
| **BondSigner.com** | Plataforma de e-signature para bonds. E-SIGN Act compliant, audit trail | Cierra el ciclo legal |

---

## 📚 Conceptos clave de surety bonds

**Las 3 partes de cualquier bond:**
- **Principal:** el que necesita el bond (contratista, notario, etc.)
- **Surety / Carrier:** la aseguradora que garantiza (Travelers, Liberty Mutual, CNA, Zurich, Old Republic)
- **Obligee:** el que lo exige (gobierno, municipio, corte)

**Conceptos de dinero — CRÍTICO entender la diferencia:**
- **Bond amount** = el monto de la garantía (ej. $100,000)
- **Premium** = lo que el cliente paga anualmente por obtener el bond (~1–3% del bond amount → ej. $2,000)
- **Rate** = premium como % del bond amount

El cliente NO paga el bond amount. Paga una premium (fracción chica).

---

## 💰 El modelo económico (MEMORIZAR — es el corazón del pitch)

Ejemplo base: bond de $100,000 con rate 2% → **premium $2,000**.

### Nivel 1 — El premium se parte así:

| Destino | % | USD |
|---|---|---|
| **Carrier retention** | 85% | $1,700 |
| **Channel commission total** | 15% | $300 |

### Nivel 2 — Qué hace el carrier con su 85%:

| Sub-componente | % del premium | USD |
|---|---|---|
| Losses / claims | 25% | $500 (SFAA 2024) |
| Carrier OpEx | 15% | $300 |
| Carrier underwriting profit | 45% | $900 |

### Nivel 3 — Cómo se divide el 15% del channel:

| Quién | % del premium | USD |
|---|---|---|
| **Primary agency** (licenciada, contrato directo con carriers) | 12% | $240 |
| **Nick como sub-agent** (HOY) | **3%** | **$60** |

### Nivel 4 — Dentro del 3% de Nick:

| Sub-componente | % del premium | USD |
|---|---|---|
| CAC (SEO + ads) | 1.0–1.5% | $20–$30 |
| Platform OpEx (Vercel, Supabase, Stripe) | 0.3–0.5% | $6–$10 |
| Team / labor | 0.2–0.4% | $4–$8 |
| **Net income Nick** | **0.8–1.5%** | **$15–$30 por bond** |

---

## 🚀 La palanca estratégica: sub-agent → primary agent

**Nick está gestionando las licencias para convertirse en primary agent directo.** Cuando eso se complete:

| Status | Comisión por bond ($100K @ 2%) | Multiplicador |
|---|---|---|
| Sub-agent (hoy) | $60 (3%) | 1x |
| **Primary agent (futuro)** | **$300 (15%)** | **5x** |

**Sobre 5,000 bonds/mes → +$1.2M/mes de revenue adicional sin mover una sola variable operativa.**

Es un cambio regulatorio, no operativo. Por eso es el argumento de valuación más limpio del pitch.

---

## 🏢 Por qué Nick HOY es sub-agent y no primary

Para ser primary agent necesita:
- Licencias de producer de seguros en cada estado (50 estados)
- Appointment formal de cada carrier (contratos + due-diligence)
- Capacidad de underwriting propia
- Capital backing y cumplimiento regulatorio

**Analogía:** Kayak vs Expedia. Hoy Nick es Kayak (manda tráfico, cobra fee chico). Mañana es Expedia (contrato directo con la aerolínea/carrier, cobra commission completo).

---

## 🛠️ Stack técnico

```
Node.js v22.22.2     → Motor que corre todo
pnpm 10.33.0          → Gestor de paquetes
Next.js 16.2.3        → Framework (TypeScript)
Supabase              → Postgres + auth
Chart.js              → Visualización
Anthropic SDK         → Claude Sonnet 4.6 en Panel 3
Vercel                → Hosting
Claude Code + MCPs    → Supabase MCP, Notion MCP, Google Calendar MCP
```

### Variables de entorno (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://xekaidmynbrhkuadtpcu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=... (mismo valor que anon)
ANTHROPIC_API_KEY=... (pendiente — para Panel 3)
```

### Proyecto ubicación:
```
C:\Users\scarc\surety-economics
```

---

## 🎯 Lo que estoy construyendo: Surety Bond Unit Economics Platform

App con **4 paneles interactivos** — cada uno responde una pregunta de due-diligence.

### Panel 1 — Unit Economics Waterfall (`/panel1`)
**Pregunta:** ¿Cómo se reparte cada dólar de premium y cuánto gana Nick hoy vs. como primary agent?

- Toggle "Sub-agent (hoy)" / "Primary agent (futuro)" — re-dibuja todo el waterfall
- Dropdown de bond type (desde Supabase)
- Sliders: bond amount, credit score, override %, CAC %, OpEx %
- **Waterfall de 3 niveles** con drill-down
- **5 metric cards:** premium, Nick gross, Nick net, net margin %, upside multiplier (5.0x en modo primary)

### Panel 2 — Renewal Revenue Engine (`/panel2`) ✅ YA HECHO
**Pregunta:** ¿Por qué el revenue compone?

- Modelo **cohort-based** con survival factor `(1 - churn)^años`
- 6 sliders: bonds/mes, commercial mix, renewal rates, churn, horizonte
- Stacked area chart mes a mes hasta 60 meses
- 4 metric cards incluyendo "% revenue from renewals at month 60" (= el moat visible)

### Panel 3 — Carrier Pitch Calculator + AI Chat (`/panel3`)
**Pregunta:** ¿Cuál es el ROI para un carrier que se integra?

- Sección A: calculator con inputs del carrier → outputs (incremental premiums, FTE reduction, time-to-quote)
- Sección B: chat con Claude Sonnet 4.6 via Anthropic API + prompt caching
- System prompt cargado con datos del mercado surety

### Panel 4 — Carrier Appetite Match (`/panel4`)
**Pregunta:** ¿Por qué multi-carrier beat single-carrier?

- Selectores: estado, business type, bond amount
- Tabla rankeada de carriers con fit score
- Fórmula `approval_rate = 1 - (1 - p)^N`: 1 carrier = 60%, 5 carriers = 99%

---

## 📅 Plan de 3 días

| Día | Fecha | Objetivo | Estado |
|---|---|---|---|
| **Día 0** | 11/04 | Setup Node + Supabase + Claude Code + MCPs | ✅ Completado |
| **Día 1** | 15/04 (hoy) | Tablas Supabase + Panel 1 + Panel 2 | 🟡 Panel 2 ✅ / Panel 1 a reescribir con modelo nuevo |
| **Día 2** | 16/04 (jueves) | Panel 1 rework + Panel 3 + AI Chat | ⏳ |
| **Día 3** | 17/04 (viernes) — DEADLINE | Panel 4 + Deploy + Loom + mensaje a Nick | ⏳ |

---

## 🗄️ Supabase — Estado actual

**Proyecto:** `surety-economics` (id `xekaidmynbrhkuadtpcu`)

**Tabla `bond_types`** — 5 filas cargadas:
| name | category | avg_premium_rate | avg_bond_amount | loss_ratio | renewal_rate |
|---|---|---|---|---|---|
| Notary Bond | commercial | 0.02 | 10000 | 0.05 | 0.75 |
| Contractor License | commercial | 0.025 | 15000 | 0.08 | 0.88 |
| Freight Broker | commercial | 0.015 | 75000 | 0.12 | 0.80 |
| Auto Dealer | commercial | 0.02 | 50000 | 0.10 | 0.82 |
| Performance Bond | contract | 0.02 | 250000 | 0.25 | 0.60 |

**Tabla `carrier_profiles`** — vacía por ahora, poblar en Día 3 (~8–10 carriers reales: Travelers, Liberty, CNA, Old Republic, Zurich, Hartford, Chubb, Nationwide).

---

## 💬 Reglas de oro para Claude Code

1. **Cuando algo falle:** copiá el error EXACTO y pegáselo con *"fix this error"*
2. **Cuando no entiendas código:** *"explain this to me like I'm new to programming"*
3. **Si llevás 30 min trabado:** parar y pedir ayuda
4. **Screenshot de todo lo que funcione** — para la demo y motivación
5. **Pedir el "por qué"** de cada paso, no solo el "qué" (mi estilo de aprendizaje)

---

## 📨 Mensaje final para Nick (Día 3)

```
Hey Nick — built this in 3 days to understand the economics of your business.

I modeled the full surety distribution chain: how premium dollars flow,
why renewal revenue creates a compounding moat, how the transition from
sub-agent to primary agent is a 5x revenue unlock, and the quantitative
case for carrier integration.

Live: [Vercel URL] | Code: [GitHub URL] | Walkthrough: [Loom URL]

Would love to walk you through it — when do you have 15 min?
```

---

## 🔑 Links clave

- **Notion Hub Principal:** https://www.notion.so/33de4afe6f5a81698060e571eb8603c7
- **Guía Explicada (Notion):** https://www.notion.so/343e4afe6f5a81d28f51c4313280604a
- **Assumptions & Sources (Notion):** https://www.notion.so/343e4afe6f5a81eda56ee4d05dc13557
- **Claves y credenciales (Notion):** https://www.notion.so/33fe4afe6f5a814b919dff4a0866c4f0
- **Supabase proyecto:** https://supabase.com/dashboard/project/xekaidmynbrhkuadtpcu
- **BuySuretyBonds.com:** https://buysuretybonds.com
- **BondGenius.ai:** https://bondgenius.ai

---

## 🚩 Open questions pendientes para Nick

1. ¿El sub-agent override real es 3%? ¿Uniforme entre carriers?
2. ¿Qué primary agency(ies) usa hoy?
3. ¿En qué estados están las licencias en gestión?
4. ¿Timeline para completar la transición a primary agent?
5. ¿CAC real blended y por canal?
6. ¿Mix commercial vs contract real?
7. ¿Carriers integrados hoy? (para Panel 4)
8. ¿Números concretos de FTE reduction / time-to-quote de casos reales de BondGenius?
9. ¿Renewal rate interno vs industry average?
