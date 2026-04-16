# 📘 Documento Maestro — Surety Bond Unit Economics Platform

> **Para:** Federico Scarcella
> **Para leer:** jueves 16/04 a primera hora, antes de retomar el sprint
> **Tiempo estimado de lectura:** 35-45 minutos
> **Versión:** 1.0 — cierre del 15/04 (noche)

> 🖨️ **Para convertir a PDF:** abrí este archivo en VS Code → instalá la extensión **"Markdown PDF"** de yzane → click derecho → **"Markdown PDF: Export (pdf)"** → te genera un PDF en la misma carpeta. Alternativa: copiá todo a un Google Doc y bajá como PDF.

---

# Índice

1. [Cómo usar este documento](#1-cómo-usar-este-documento)
2. [El negocio de Nick — qué hace y por qué importa](#2-el-negocio-de-nick--qué-hace-y-por-qué-importa)
3. [La industria del surety bond — todo lo que tenés que entender](#3-la-industria-del-surety-bond--todo-lo-que-tenés-que-entender)
4. [Lo que construimos — overview de la app](#4-lo-que-construimos--overview-de-la-app)
5. [Panel 1 — Unit Economics Waterfall · explicación completa](#5-panel-1--unit-economics-waterfall)
6. [Panel 2 — Renewal Revenue Engine · explicación completa](#6-panel-2--renewal-revenue-engine)
7. [Panel 3 — Carrier Pitch Before & After · explicación completa](#7-panel-3--carrier-pitch-before--after)
8. [Panel 4 — Carrier Appetite Match · explicación completa](#8-panel-4--carrier-appetite-match)
9. [El stack técnico — qué está corriendo debajo y por qué](#9-el-stack-técnico)
10. [Análisis crítico honesto — ¿esto es A-player?](#10-análisis-crítico-honesto--es-a-player)
11. [Plan para mañana (jueves 16/04) y viernes 17/04 — DEADLINE](#11-plan-para-mañana-y-viernes--deadline)
12. [Cómo le explicás a Nick que sos capaz de todo](#12-cómo-le-explicás-a-nick-que-sos-capaz-de-todo)
13. [Open questions para Nick (las que confirmás antes del Loom)](#13-open-questions-para-nick)
14. [Quick reference — comandos, URLs, contraseñas](#14-quick-reference)

---

## 1. Cómo usar este documento

Este es el **único documento** que necesitás leer para retomar el sprint donde lo dejamos. Está pensado para que entiendas:

- **Por qué** existe cada decisión (no solo qué hicimos)
- **Cómo** explicar cada panel a Nick si te corta y pregunta
- **Qué** falta hacer y en qué orden
- **Verdad** sobre dónde estamos vs donde habría que estar

Leé en orden. Si tenés que cortar, los puntos críticos están en las secciones **2, 3, 5-8, 10, 11, 12**. El resto es referencia.

---

## 2. El negocio de Nick — qué hace y por qué importa

### Quién es Nick

**Nicholas Thoroughman**, fundador de 3 productos interconectados en surety bonds en EE.UU.:

- **BuySuretyBonds.com** — marketplace DTC. ~19 tipos de bond, instant approval, 50 estados, "guaranteed: no payment until your bond is issued". Captura demanda via SEO. Carriers integrados: Travelers, Liberty Mutual y otros A-rated. **Es la cara al cliente final.**

- **BondGenius.ai** — engine B2B para agencies. Tagline: *"24/7 sales & efficiency layer for sureties. Same headcount, 50% more premium."* Tiers: Free (25 bonds/mo), Professional ($199/mo unlimited), Enterprise ($399/mo). White-label total. Capped a 50 agencies, waitlist después. **Es el motor que vende a otras agencias.**

- **BondSigner.com** — e-signature E-SIGN Act compliant. Invitation-only. *"Sign bonds in seconds."* Audit trail, 256-bit encryption, multi-party signing. **Es la capa de compliance/cierre legal.**

**Background de Nick:** 8+ años en surety bond technology (per About page de BuySuretyBonds). Origen del problema (verbatim): *"I kept watching contractors, notaries, and auto dealers wait 2-3 days for a bond that could be issued instantly."* HQ en Las Vegas. Equipo chico (no team page, sin investor mentions, lean ops).

### Por qué los 3 productos juntos forman un moat

Cada producto solo es un point solution. **Pero los 3 juntos forman una "vertical stack" que ningún competidor tiene:**

1. **Demanda** (BuySuretyBonds capta SEO) →
2. **Distribución/automation** (BondGenius procesa) →
3. **Cierre legal** (BondSigner firma)

**El insight clave que vos ves y Nick no enfatiza públicamente:** los 3 sites **no se cross-linkean entre sí**. Operan como brands separadas. Nick está construyendo un portfolio, no un suite. **Tu pitch puede mostrarle el "view unificado" que él no ha construido todavía.** Esa es una observación que pocos dev's verían — vos podés.

### El contexto del acuerdo

- Período de prueba de **60 días** con Nick
- Acuerdo **profit share** — sin equity inicial, abierto a equity si demuestras valor
- **Tu diferencial declarado:** background de PE + Claude Code + MCPs. No sos developer de carrera.
- **Deadline del sprint:** viernes 17/04. Lo que entregamos: app deployada en Vercel + video Loom + mensaje final.

---

## 3. La industria del surety bond — todo lo que tenés que entender

### Conceptos fundamentales (memorizar)

**Las 3 partes de cualquier surety bond:**

| Parte | Quién | Qué hace |
|---|---|---|
| **Principal** | Contratista, notario, auto dealer, freight broker | Necesita el bond para operar legalmente |
| **Surety/Carrier** | Travelers, Liberty Mutual, CNA, Zurich, etc. | Garantiza con su capital si el principal incumple |
| **Obligee** | Gobierno, municipio, corte | Exige el bond por ley |

**Conceptos de dinero — diferencia crítica:**

- **Bond amount** = monto de la garantía (ej. $100,000). **El cliente NO paga esto.**
- **Premium** = lo que el cliente paga anualmente (~1-3% del bond amount → ~$2,000)
- **Rate** = premium como % del bond amount

**Renewal annually:** los bonds se renuevan cada año. Commercial bonds (notary, contractor license, auto dealer) renuevan al **75-88%**. Contract bonds (performance) renuevan al ~60% porque son project-bound.

### Tamaño del mercado y dinámica 2024-2025

- **US surety market:** ~$9.3-9.5B en GWP (Gross Written Premium). Source: SFAA 2023 annual results.
- **Global:** ~$27B proyectado para 2030 (CAGR 5.8%) o $35B para 2032 (7.5%).
- **CAGR US:** 8-10%.
- **Demanda:** obligatoria por ley. No-discretionary en recesión.
- **Loss ratio industry 2024 YTD: 24.9%** — el más alto en 5 años (SFAA). Driven by inflation cost overruns + labor market en construcción.
- **Top 10 carriers controlan >60% del market.** Oligopolio en carriers, fragmentación en distribución.

**Top carriers US (orden aprox):** Travelers Bond (#1, ~12% share), Liberty Mutual, Zurich NA, CNA, Tokio Marine HCC, The Hartford, Chubb, Intact (Old Republic), Arch, Markel.

### El modelo económico de Nick (CRÍTICO — esto es el corazón del pitch)

**Ejemplo base:** bond de $100K @ rate 2% → premium $2,000.

**Cómo se reparte ese premium:**

| Capa | % del premium | USD | Quién |
|---|---|---|---|
| Carrier retention | 85% | $1,700 | Travelers/Liberty cobre losses + OpEx + profit |
| Channel commission total | 15% | $300 | El canal de distribución |
| → Primary agency (licenciada) | 12% | $240 | SuretyOne, JW, Integrity (con contrato directo a carrier) |
| → **Nick sub-agent override** | **3%** | **$60** | **HOY — porque no tiene licencias propias** |

**El unlock estratégico (el argumento más fuerte del pitch):**

Nick está **gestionando las licencias** para convertirse en **primary agent** directo. Cuando se complete:

| Status | Comisión por bond ($100K @ 2%) | Multiplicador |
|---|---|---|
| Sub-agent (hoy) | $60 (3% del premium) | 1x |
| **Primary agent (futuro)** | **$300 (15% del premium)** | **5x** |

**Eso es 5x revenue per bond sin mover una sola variable operativa.** Sobre 5,000 bonds/mes son +$1.2M/mes de revenue adicional. Es un cambio regulatorio, no operativo. Por eso es la palanca de valuación más limpia del pitch.

### Para ser primary agent se necesita

- Licencias de producer de seguros en cada estado donde opera (50 estados)
- Appointment formal de cada carrier (contratos + due-diligence)
- Capacidad de underwriting propia
- Capital backing y cumplimiento regulatorio
- E&O coverage
- En algunos casos, financial statements de la agencia
- Algunos carriers piden **commitment de GWP** ($250K-$1M anuales)

**Por eso muchos agentes operan via wholesalers/MGAs (sub-agents), perdiendo 20-40% de commission al wholesale layer.** Nick está en este grupo hoy.

### Analogía Kayak vs Expedia (la mejor para explicarle a alguien fuera de la industria)

| Surety | Travel equivalente | Qué hace |
|---|---|---|
| Carrier | Aerolínea (American, Delta) | Vende producto / asume riesgo |
| Primary agency | Expedia, Booking | Contrato directo, comisión grande |
| **Sub-agent (Nick HOY)** | Kayak, Skyscanner | Manda tráfico, cobra fee chico |
| **Primary agent (Nick FUTURO)** | Expedia | Salta intermediario, commission completo |

### Renewal economics (el moat compounding)

- **Commercial bonds:** 75-88% renuevan cada año.
- **Contract bonds:** ~60% (más bajo, son project-bound).
- **Por qué renuevan:** legalmente requeridos para mantener licencia. Cliente no puede operar sin bond activo.
- **Survival factor:** con churn 10% anual, al año 5 sobrevive el 59% de cada cohorte original (`(1-0.10)^5`).
- **LTV per bond:** depending on bond type, **2-3x el net del año 1**. Ese es el moat de valuación.

### Lo que NO sabíamos al principio (correcciones del research deep-dive)

#### 🚨 Punto crítico — el "60% → 99% approval" no es publicamente defensible

El claim de Panel 4 *"1 carrier = 60% approval, 5 carriers = 99% approval"* **no tiene fuente pública.** SFAA no publica industry-level approval rates. Underwriting depende de risk class (los "3 Cs": character, capacity, capital), no del agente.

**Lo que sí es defensible (y refraseamos en Panel 4):**
- "Multi-carrier expande el menu de opciones de placement"
- "Mejora la placement rate en hard-to-place risks (sub-680 FICO, large bonds, niche states)"
- Para data específica, Nick debería usar su propia data interna de BuySuretyBonds, no industry averages.

#### 🚨 Consolidación competitiva que no estábamos viendo

- **JW Surety Bonds + Lance Surety = ambas son ahora parte de Risk Strategies.** El espacio "online retail surety" no es greenfield. Otros: Tinubu (carrier-side SaaS), BondExchange (wholesale), SuretyBonds.com, ZipBonds, Bryant.
- **El diferenciador real de Nick vs estos:** AI-native underwriting + el path a primary appointments, no solo SEO retail.

#### 🚨 Loss ratio en máximos 5y — hay que mencionarlo

24.9% YTD 2024 (SFAA). Driven por inflation cost overruns y construction. **Spin para el pitch:** *"rising loss ratios are a tailwind for disciplined digital players (clean risk-selection via AI) and a headwind for anyone underwriting aggressively for growth."*

#### 🚨 Treasury Circular 570 update 2024

Primer overhaul federal de surety en 20+ años (julio 2024). Nuevas reinsurer categories, letters of credit aceptadas. **Tailwind para digital platforms.**

#### 🚨 NMLS Electronic Surety Bond (ESB) adoption

State-by-state para mortgage/consumer-finance licensees. Otro tailwind digital.

#### 🚨 Wet-ink + raised-seal sigue siendo un cuello de botella

Muchos DOTs, courts, municipalities aún piden firma física + sello. **Cualquier claim "100% digital" necesita asterisco.** BondSigner ataca donde la ley lo permite.

#### 🚨 Renewal rates segmentadas

Lumping commercial (80-90%) con contract (40-60%) en un solo número es un red flag para PE sofisticado. Nuestro modelo Panel 2 ya segmenta — bien.

#### 🚨 Insider knowledge que un PE espera de Nick

- **"Credit surety" vs "underwritten surety":** commercial bonds <$50K son product-style; contract surety es underwritten como un loan.
- **Indemnity es el negocio:** la General Indemnity Agreement firmada por el principal (y owners personalmente) hace que la surety recupere de él, no que pierda como un seguro tradicional. Esto explica los loss ratios bajos vs P&C.
- **"Agent of record" es sticky:** cambiar de agente requiere obligee acknowledgment. Estructuralmente refuerza renewals **si** sos primary.
- **SFAA + NASBP** son las dos industry bodies. SFAA = carriers, NASBP = producers. Mencionar ambos te marca como insider.

### Funding rounds comparables

- **Insurtech 2025:** +19.5% YoY funding ($5.08B), 66% AI-centric.
- **MGAs:** share de deals cayó a 35% en 2025 (de 42% 2024) — headwind para distribution-focused raises.
- **Ejemplos recientes:** Bluefields ($15M Oct 2025, specialty MGA platform), Delos ($9M Series A wildfire MGA).
- **No hay pure-play digital surety raise público** — la categoría está M&A'd hacia broker rollups (JW/Lance) o bootstrapped. **Insight ambiguo:** o el mercado está underserved (oportunidad) o no atrae VC (riesgo).

---

## 4. Lo que construimos — overview de la app

### En una frase

**Una app web interactiva con 4 paneles que modelan los unit economics del negocio de Nick — desde el split de un solo bond hasta el moat del marketplace multi-carrier.** Pensada para ser un pitch tool, no un producto para clientes finales.

### Quién es la audiencia

| Audiencia | Qué busca |
|---|---|
| **Inversores PE/VC** (audiencia primaria) | Modelo financiero defensible que justifique valuación |
| **Carriers** (Travelers, CNA) | Business case para integrarse con BondGenius |
| **Nick mismo** | Simulador para sus propias decisiones internas |

### Estructura narrativa de los 4 paneles

Cada panel responde una pregunta de due-diligence específica:

| Panel | Pregunta | Insight clave |
|---|---|---|
| **1 — Unit Economics Waterfall** | ¿Cómo se reparte cada dólar de premium? | Sub-agent → Primary agent = **5x revenue unlock** |
| **2 — Renewal Revenue Engine** | ¿Por qué el revenue compone? | Al M60, **70% del revenue son renewals** = SaaS economics |
| **3 — Carrier Pitch Before/After** | ¿Por qué un carrier integraría? | Travelers gana $400M+ + Nick captura $X de cada deal |
| **4 — Carrier Appetite Match** | ¿Por qué multi-carrier > single-carrier? | Marketplace expand placement rate en hard-to-place risks |

### Cómo están conectados (el feature técnico no-trivial)

Los 4 paneles **comparten estado** vía **Zustand** (librería de state management). Cuando cambiás algo en uno, los demás se actualizan automáticamente:

- `mode` (sub-agent / primary-agent) → afecta los 4
- `portfolio` (los bonds configurados) → fluye Panel 1 → Panel 2
- `assumptions` (override %, CAC, OpEx) → Panel 1 + Panel 3
- `timeHorizonYears` → Panel 1 LTV + Panel 2 chart
- `churn` → Panel 1 LTV + Panel 2 cohort
- `yoyGrowth` → Panel 2

**Persiste en localStorage:** si cerrás el browser y volvés mañana, todo está donde lo dejaste.

**Por qué esto importa para el pitch:** un inversor ve que los 4 paneles son **un solo modelo coherente**, no 4 calculadoras sueltas. Es la diferencia entre un Excel y un sistema integrado. Sutil pero importante.

---

## 5. Panel 1 — Unit Economics Waterfall

**URL:** `/panel1`
**Pregunta:** *¿Cómo se reparte cada dólar de premium, y cuánto toca Nick hoy vs como primary agent?*

### El argumento central

Cuenta la historia de **un solo bond** primero (single mode), después escala a **un portfolio** (portfolio mode). El "wow moment" del panel es el **toggle Sub-agent ↔ Primary agent** que muestra el 5x multiplier en vivo.

### Controles principales

**Toggle de rol:**
- "Sub-agent (today)" — Nick captura 3% del premium (override, default editable 1-8%)
- "Primary agent (future) 🚀" — Nick captura 15% (default editable 10-20%)

**Toggle de vista:**
- "Single bond" — un bond, análisis profundo
- "Portfolio" — múltiples bond configs agregadas

**Toggle de timeframe (solo en Portfolio):**
- "Monthly" / "Annual (×12)" — multiplica todos los totales

### Single bond view — qué se calcula

Inputs:
- Tipo de bond (dropdown desde Supabase): Notary, Contractor License, Freight Broker, Auto Dealer, Performance
- Bond amount ($5K - $500K, slider + text input para precisión)
- Credit score (550-800)
- Sliders de assumptions: override %, CAC %, OpEx %, LTV horizon (años)

**Fórmula del premium:**
```
rate = avg_premium_rate × credit_multiplier
credit_multiplier = 1.5 - ((score - 550) / 250) × 0.8
premium = bond_amount × rate
```

(Score 800 = multiplier 0.7x → mejor rate. Score 550 = 1.5x → peor rate. Replica la realidad: peor crédito = más cobra el carrier.)

**5 metric cards:**
1. Premium (lo que paga el cliente)
2. Nick gross revenue (premium × take rate)
3. Nick net income (gross − CAC − OpEx − team)
4. Net margin sobre premium
5. **Upside multiplier** (5.0x cuando estás en primary mode — escondido en sub-agent para crear un "aha moment" al flipear)

**Waterfall chart de 3 niveles:**
- Barra 1: Carrier 85% / Channel 15%
- Barra 2: Primary agency 12% / Nick 3% (en sub-agent mode) o Nick 15% (en primary mode)
- Barra 3: Dentro del take de Nick → CAC / OpEx / Team / Net margin

**Por qué horizontal stacked y no waterfall tradicional:** Chart.js no tiene waterfall nativo. Las 3 barras horizontales stacked comunican "drill down" visualmente: cada nivel es un zoom del segmento "channel" del nivel anterior.

### Portfolio view — qué se calcula

Una **tabla editable** donde cada fila = una config de bond (type + qty + amount + credit). Permite simular escenarios mixtos.

**3 presets quick-load:**
- **Small agency** (100 bonds/mo) — un broker solo en 1 estado. Baseline industria.
- **Mid-market** (1,000 bonds/mo) — agencia con equipo, multi-estado.
- **BuySuretyBonds scale** (5,000 bonds/mo) — target operacional de Nick.

**6 metric cards agregadas:** Total bonds, Premium volume, Nick gross, Nick net, **LTV (5y book)**, Blended margin.

**Columna LTV/bond** en la tabla — multiplica el net por el `ltvMultiplier(renewalRate, years, churn)` derivado de Supabase (cada bond type tiene su renewal rate real).

**Snapshot comparison:** botón "Save snapshot now" → guarda el estado actual → cambiás algo → aparecen 3 cards con before/after/delta en verde o rojo. Útil canónicamente: guardás snapshot en sub-agent, flipeás a primary, ves el delta exacto en USD.

**Copy for Excel (TSV):** botón que exporta la tabla como tab-separated. Excel/Sheets lo pega directo a columnas en cualquier locale.

**Aggregate waterfall:** mismo chart de single bond pero con los totales del portfolio entero.

**Preview a Panel 2 (feature nueva 15/04 noche):** debajo de la tabla, una card verde clickeable que muestra el **Cumulative Nick net over horizon** usando la simulación shared. Linkea a Panel 2 para ver el chart completo.

### Por qué cada feature

| Feature | Por qué existe |
|---|---|
| Toggle sub-agent / primary | El argumento de valuación más fuerte del pitch |
| Toggle single / portfolio | Single conceptualmente claro pero chico; portfolio grande pero requiere entender el modelo |
| Sliders + text inputs | Slider para exploración rápida, input para precisión exacta |
| 3 presets | Concretizar la escala (no abstracta) — Nick puede pasar de Small a BuySuretyBonds scale en 1 click |
| LTV editable | El número de valuación más importante; no debe estar hardcoded |
| Snapshot comparison | Convierte la abstracción del 5x en un delta concreto en USD |
| TSV export | Para que Nick lleve los números a su Excel después de la demo |
| Preview Panel 2 | Cierra el loop narrativo Panel 1 → Panel 2 visualmente |

### Cómo pitchearlo (script en inglés, listo para Loom)

> *"This panel is unit economics. Single bond first — a $100K bond at 2% rate generates $2,000 premium. As sub-agent today, you touch $60. After CAC and OpEx, ~$30 net per bond.*
>
> *Now watch this. [click Primary agent 🚀] The waterfall redraws — now you touch $300 per bond. 5x. This is regulatory, not operational. Just complete the licensing.*
>
> *But one bond is abstract. [click Portfolio] [Mid-market preset] Here's a 1,000-bond/month book. As primary agent, $X/month net. Save snapshot, flip back to sub-agent — comparison card shows the delta in dollars. That's the unlock.*
>
> *And this is only year 1. Look at the LTV column — each bond is worth 2-3x its year-1 net because they renew. That's what justifies high valuation multiples in surety vs one-shot brokerage."*

---

## 6. Panel 2 — Renewal Revenue Engine

**URL:** `/panel2`
**Pregunta:** *¿Por qué el revenue de este negocio compone? ¿Cuánto del revenue del año 5 es recurrente vs ventas nuevas?*

### El argumento central

**Este es el panel financiero más importante.** Muestra el moat compounding. Si Panel 1 es "1 bond", Panel 2 es "el book entero a través del tiempo".

### El modelo cohort-based (concepto fundamental)

Una **cohorte** = el grupo de bonds emitidos en un mismo mes.

- Cohorte 1 = los bonds del mes 1
- Cohorte 2 = los bonds del mes 2
- ...

Cada cohorte intenta renovar en sus aniversarios (mes 12, 24, 36, 48, 60). La probabilidad de renovar se multiplica por un **survival factor**:

```
survival(año N) = (1 - churn)^N
```

Con churn 10%: año 1 = 90%, año 5 = 59%. **El churn se compone — no es lineal.**

**Por qué este modelo y no una fórmula lineal simple:**

1. **Cohortes tienen edades distintas.** Una cohorte del mes 1 ya renovó 4 veces al mes 60; una del mes 48 no renovó todavía. Tratar todas igual sería incorrecto.
2. **El churn se compone.** `(1-0.1)^5 = 0.59`, no 0.50.
3. **Las renewals son eventos discretos** cada 12 meses, no flujo continuo.

Un PE analyst mira un chart así y sabe inmediatamente que el modelo está bien hecho.

### Lo que se calcula (los premiums son derived del Panel 1, no hardcoded)

Cada cohort usa **el premium real de cada bond type** (rate × bond amount × credit multiplier) y la **renewal rate real** de Supabase. **Si cambiás el portfolio en Panel 1, Panel 2 se recalcula con los premiums nuevos.**

```
new_revenue(m) = sum(cohort.premium × cohort.qty × growth_factor × carrier_uplift)
renewal_revenue(m) = sum sobre cohortes pasadas c donde (m-c) es múltiplo de 12:
                     cohort.premium × cohort.qty × renewal_rate × survival
```

### Las 4 métricas hero

1. **Premium volume cumulative (Ny)** — el "top line" total
2. **Nick net cumulative (Ny)** — la torta que le toca a Nick (el número de valuación)
3. **Monthly premium at M(horizon)** — MRR run-rate al final
4. **Monthly Nick net at M(horizon)** — run-rate aplicable para múltiplos

### El hero verde — "The moat, in one number"

Box grande con el **% renewals at horizon** en font 5xl + explicación:
> *"If Nick stopped originating new bonds tomorrow, this percentage of revenue would still arrive next month. That's the compounding moat."*

### Mode comparison card (siempre visible)

3 columnas: Current mode / Other mode / **Delta** (verde si positivo). 2 simulaciones corren en paralelo (no necesitás snapshot manual). Toggle del rol inline.

### Sliders del sidebar

- **Annual churn** (0-30%, default 10%) — **shared con Panel 1 LTV**
- **YoY volume growth** (-10% a +100%, default 0%) — para el pitch a VCs (steady state no genera emoción)
- Manual mode inputs (solo cuando el toggle está en Manual)
- Portfolio breakdown read-only (cuando estás en Use portfolio mode)

### Toggle "Carrier deal at month X" (feature 15/04 noche)

Checkbox + selector M6/M12/M18/M24/M36. Cuando activo, simula la integración carrier de Panel 3 — aplica +15% premium uplift desde ese mes en adelante. El chart muestra la inflexión visualmente.

**Por qué es importante:** **conecta Panel 2 con Panel 3 narrativamente**. Antes eran historias paralelas. Ahora podés decir *"y si en M12 cierra el deal con Travelers, así se ve el book"*.

### Chart con toggle de vista

3 botones arriba del chart:
- **Total premium** — stacked area: new (azul) + renewal (verde)
- **Nick gross** — single area azul (premium × take rate)
- **Nick net** — single area verde (después de costos)

3 ángulos narrativos del mismo data.

### Year-by-year table

6 columnas: Year, New premium, Renewal premium, Total, Nick net, **% from renewals** — la columna que sube cada año (0% en Y1 → ~70% en Y5).

### Cómo pitchearlo (script Loom)

> *"Panel 1 zoomed into one bond. Panel 2 zooms out to the whole business over time.*
>
> *Look at this number — 70% of your revenue at year 5 is renewals of bonds you sold in prior years. If you stopped selling new bonds today, this percentage would still land in your bank account next month. That's the moat.*
>
> *Your Panel 1 portfolio is already loaded — I didn't reconfigure anything. Cumulative Nick net over 5 years is $X as sub-agent. Flip to primary [click] — $Y. Delta: +$Z.*
>
> *And this assumes zero growth. Add 20% YoY growth [slider] — look at the chart. Realistic growth + compounding combination. SaaS economics applied to surety."*

---

## 7. Panel 3 — Carrier Pitch Before & After

**URL:** `/panel3`
**Pregunta:** *Si soy Travelers / Liberty Mutual, ¿cuál es mi ROI de integrarme con BondGenius — y cuánto captura Nick?*

### Por qué reescrito

V1 era un calculator genérico con sliders abstractos y AI chat al medio. No comunicaba nada a un inversor — mostraba que un carrier ahorra plata pero no cómo eso se convierte en revenue para Nick. V2 (15/04) cambió el framing a: *"This is the pitch Nick uses when sitting with a VP of Surety at Travelers."*

### Los 4 pasos

#### Step 1 — Pick a carrier profile

5 carrier preset cards reales:

| Carrier | Total premiums | % surety | GWP surety | Tagline |
|---|---|---|---|---|
| **Travelers** | $35B | 4% | $1.4B | Industry leader |
| **Liberty Mutual** | $50B | 2% | $1B | Multi-line giant |
| **CNA** | $12B | 8% | $960M | Surety specialist |
| **Mid-sized regional** | $500M | 10% | $50M | Regional / specialty |
| **Custom** | sliders | sliders | derived | Your own numbers |

**Por qué presets reales:** un inversor reconoce "Travelers" inmediatamente. Slider con $500M es abstracto.

#### Step 2 — The carrier's transformation (Before / After)

Dos columnas lado a lado:

**🔴 Before — Without BondGenius:**
- Annual GWP baseline
- Time to quote: 4 días
- FTEs operando: X (con costo anual)
- Lost renewals: -$Y/yr por fricción
- Status: *"growth plateaued, losing share to digital competitors"*

**🟢 After — With BondGenius:**
- Annual GWP + 15% uplift
- Time to quote: ~1 min
- FTEs reducidos (-4 per $10M GWP)
- Lost renewals recuperados (+13%)
- Status: *"instant-approval distribution, reduced cost base"*

**Hero verde abajo:** `Net annual upside: +$X` (suma).

#### Step 3 — What Nick captures from the deal

Card azul con toggle sub-agent/primary inline. 3 cards:
- Today (% del premium): commission anual de Nick
- Future (otro %): con primary agent
- Upside per carrier deal: multiplier + delta

**Fórmula:**
```
nickAnnualCommission = (premiumUplift + recoveredRenewals) × nickTakeRate
```

**Por qué solo incremental:** Nick no cobra commission sobre el book existente del carrier (no fluyó por BondGenius). Solo sobre el premium que BondGenius generó (uplift) + las renewals recuperadas.

**TAM:** *"Closing 3 carrier integrations like Travelers → $X/yr today, $Y/yr as primary."*

#### Step 3b — Deal structure & break-even (feature 15/04 noche)

Anticipa la contra-pregunta del carrier: *"¿cuánto cuesta integrar y cuándo paga back?"*

Dos cards:
- **Who keeps what:** lista explícita carrier-vs-Nick
- **Carrier break-even:** $500K integration cost / monthly upside = month X

Para Travelers-tier deals, break-even M1-M2. Para mid-sized, M3-M6. ROI obvio.

#### Step 4 — AI Chat (colapsado)

Botón expandible al final. Mock mode (gratis, keyword-based) o live (Claude Sonnet 4.6 con prompt caching cuando se agregue ANTHROPIC_API_KEY). System prompt cargado con datos surety.

**Por qué colapsado:** en mock mode las respuestas son pattern-matched, no son AI real. Es un nice-to-have, no central. Cuando se active la API real cambia de categoría.

### Cómo pitchearlo (script)

> *"Panel 3 is the pitch Nick uses with a VP of Surety. Pick Travelers — $35B in premiums, 4% surety, $1.4B GWP. [click Travelers]*
>
> *Today: 4 days to issue, 840 FTEs, $180M in lost renewals from friction.*
>
> *With BondGenius: 1-minute issuance, 280 FTEs, renewals recovered, premium up 15%. Net annual upside to Travelers: $400+ million.*
>
> *And here's what Nick captures: $X million a year as sub-agent, $Y million as primary. Multiply by 3 carrier integrations — that's the TAM.*
>
> *Carrier asks 'how fast does this pay off?' Break-even is month 2."*

---

## 8. Panel 4 — Carrier Appetite Match

**URL:** `/panel4`
**Pregunta:** *¿Por qué es un marketplace defendible y no solo un canal de distribución más?*

### El argumento central (refraseado el 15/04 noche post-research)

V1 decía "1 carrier = 60% approval, 5 carriers = 99%". **Ese claim no es publicamente defensible** — SFAA no publica industry approval rates.

V2 reframea como:
> *"Multi-carrier expande el menu de placements. Cada carrier individual tiene appetite finita (ciertos bond types, ciertos estados, ciertos treasury limits). El marketplace mejora la **placement rate en hard-to-place risks** (sub-680 FICO, large bonds, niche states). Ese es el moat — no precio."*

Y agrega el disclaimer:
> *"Approval modeling below is a directional simulation. Real approval depends on the '3 Cs' (character, capacity, capital). Industry-level approval data is not publicly disclosed by SFAA — these numbers should be calibrated against Nick's own BuySuretyBonds book before pitching."*

### Lo que se calcula

**Inputs:** State (50 US), business type, bond amount, credit score.

**Per-carrier fit score:**
```
fit_score = 0.4 × treasury_match + 0.3 × state_match + 0.3 × segment_match
treasury_match = min(1, carrier.treasury_limit / (bond_amount × 5))
state_match = licensed_states includes(state) ? 1 : 0
segment_match = target_segments includes(business_category) ? 1 : 0.3
```

**Per-carrier approval probability:**
```
credit_adjustment = 1 + ((credit_score - 720) / 80) × 0.15
approval_prob = base(0.60) × fit_score × credit_adjustment
```

**Combined approval con N carriers** (asumiendo independencia):
```
approval_combined = 1 - ∏(1 - p_i)
```

Esta es la fórmula correcta de "al menos un éxito en N intentos independientes". La simplificación `1 - (1-p)^N` solo aplica si todas las p son iguales — acá usamos la real porque cada carrier tiene fit distinto.

### Hero "The marketplace moat, in two numbers"

3 stats grandes: With 1 carrier → X% / With 5 → Y% / With all → Z%.

Punch line: *"Customers don't choose BuySuretyBonds to save money. They choose it because their approval odds go from X% to Z%."*

### Ranked carrier table

8 columnas: Rank, Carrier, AM Best, Treasury, Fit (visual bar), Approval (individual), Cumulative, Integrated with BondGenius (✓).

10 carriers seedeadas en Supabase (Travelers, Liberty Mutual, CNA, Zurich, Old Republic, Hartford, Chubb, Nationwide, Merchants Bonding, RLI Corp).

### Approval curve

Bar chart horizontal: 1, 3, 5, 7, 10 carriers. Colores: rojo (1) → ámbar (3) → verde (5+).

**Diminishing returns visible:** pasar de 1→5 es mágico, pero de 5→10 es marginal. **Importante:** Nick no necesita 50 carriers — con 5-7 ya capturó el efecto. **Escalable.**

### Nick's economic angle

3 metric cards:
- Conversion lift (5/1)
- Carriers integrated with BondGenius (X/Y)
- Revenue per bond (Nick @ take rate sobre ~2% premium)

### Cómo pitchearlo (script)

> *"Panel 4 closes the pitch. Why can't Travelers just build this in-house?*
>
> *Because of this. [hero] Direct to one carrier, X% placement on this applicant. Multi-carrier marketplace, Z%. Customers don't come for price — they come for the placement rate.*
>
> *Try it [cambia state]. Some carriers already integrated with BondGenius [✓]; each new integration Nick closes compounds the entire model.*
>
> *That's the defensibility. Marketplace, not channel."*

---

## 9. El stack técnico

```
Node.js v22.22.2 · pnpm 10.33.0 · Next.js 16.2.3 (TypeScript)
Supabase (Postgres + auth + APIs) · Tailwind CSS · Chart.js + react-chartjs-2
Zustand (state management con persist) · @anthropic-ai/sdk (Panel 3 chat)
Vercel (hosting) · Claude Code + 3 MCP servers
```

### Por qué cada herramienta

| Herramienta | Por qué |
|---|---|
| **Next.js 16** | Framework frontend + backend en un solo lugar. Routing automático para `/panel1..4`. Deploys instantáneos en Vercel. |
| **TypeScript** | Atrapa errores en edición. Crítico porque no sos developer profesional — sin esto romperías cosas sin notar. |
| **Tailwind CSS** | Estilos con clases en HTML. UI profesional rápida sin ser diseñador. |
| **Chart.js** | Standard de la industria para gráficos. Los paneles son 80% visualización. |
| **Supabase** | Postgres + auth hosteado. Sin esto tendrías que configurar una base de datos vos mismo. |
| **Zustand** | State management que persiste en localStorage. Permite que los 4 paneles compartan estado. |
| **Claude Code + MCPs** | El diferencial AI-native — manejás Supabase, Notion, Calendar desde el chat. |
| **Vercel** | Hosting gratuito con un click desde GitHub. URL pública para Nick. |

### MCP Servers — el diferencial técnico

Los **MCP servers** permiten que Claude Code **actúe sobre sistemas externos directamente desde el chat**. En este proyecto usamos 3:

- **Supabase MCP** — creé las tablas `bond_types` y `carrier_profiles` + cargué seed data sin abrir el dashboard
- **Notion MCP** — escribo y actualizo todas estas guías sin abrir Notion
- **Google Calendar MCP** — bloqueé jueves 16 y viernes 17 sin abrir Calendar

**Por qué importa:** esto es "AI-native tooling 2026". Para Nick, que construye productos de IA, es el stack que va a valorar. Lo va a notar en el Loom — *"hice esto desde un chat"* es no-trivial.

### Arquitectura de los archivos clave

```
app/
  layout.tsx            ← navbar global + theme provider
  page.tsx              ← landing con executive summary + risk register
  globals.css           ← theme dark slate + amber/gold (estilo Nick)
  panel1/page.tsx       ← Unit Economics Waterfall
  panel2/page.tsx       ← Renewal Revenue Engine
  panel3/page.tsx       ← Carrier Pitch Before/After
  panel4/page.tsx       ← Carrier Appetite Match
  api/chat/route.ts     ← Anthropic API integration con mock fallback
components/
  nav.tsx               ← navbar sticky con accent dorado
  panel-ui.tsx          ← MetricCard, NumberSliderInput, TableNumberInput (compartidos)
lib/
  store.ts              ← Zustand store (mode, portfolio, assumptions, churn, growth)
  simulation.ts         ← simulatePortfolio (cohort math, compartido P1+P2)
  utils.ts              ← money(), pct() formatters
  supabase/             ← client.ts, server.ts, proxy.ts
```

---

## 10. Análisis crítico honesto — ¿es A-player?

**Pregunta directa:** ¿esto demuestra que sos A-player?

**Respuesta honesta:** **No del todo, pero estás cerca. 70-75/100.** Y eso es excelente para un sprint de 3 días sin background de developer.

### Lo que tenés A-player:

1. ✅ **Modelo financiero correcto matemáticamente** — el cohort-based simulation está bien hecho. Un PE serio mira eso y reconoce que sabés de lo que hablás.
2. ✅ **Narrativa de 4 paneles cierra** — cada panel responde una pregunta de DD distinta. Es una estructura de pensamiento sólida.
3. ✅ **State management compartido** — los 4 paneles son **un solo modelo**, no calculadoras sueltas. Esto es no-trivial y un dev senior lo nota.
4. ✅ **Estilo ejecutivo aplicado** — el restyle dark slate + amber/gold matches el aesthetic de BuySuretyBonds. No parece "side project".
5. ✅ **MCP usage demostrable** — Supabase + Notion + Calendar manejados desde Claude Code. Es el stack AI-native 2026.
6. ✅ **Documentación viva** — Notion + markdown locales + plan estructurado. No hay disorganización.

### Lo que NO tenés A-player todavía:

1. ❌ **Sources citados en cada panel.** Agregamos un footer en home con sources, pero idealmente cada panel tendría tooltips "📊 source" en cada metric. Para A-player, cada número defendido.
2. ❌ **Sensitivity analysis matrix.** No hay un view "what if churn +5%? renewal -5%?" lado a lado. PE serio lo pide.
3. ❌ **Valuation framework.** No mencionamos múltiplos comparables (Lemonade 2x, Betterment 6x, brokerages 1.5x). No hay ARR × multiple = enterprise value calculator.
4. ❌ **Risk register completo.** Agregamos 4 risks en home. Falta un panel/sección dedicada con scenarios concretos (recession, carrier withdrawal, adverse selection).
5. ❌ **Mobile responsive.** Las tablas en Panel 4 y Panel 2 desbordan en mobile. Investor mira en celular el primer click.
6. ❌ **Animations / micro-interactions.** Es un modeling tool — moverlos sliders debería sentirse fluido. Hoy es OK pero no premium.
7. ⚠️ **El claim "60%→99% approval" no defendible publicamente** — refraseado pero el inversor con conocimiento puede pinchar si vos no anticipás.
8. ⚠️ **Algunos números son assumptions internas** (override 3%, CAC 1.2%, OpEx 0.4%, integration cost $500K) — están flageados como editables pero no validados con Nick.

### Verdict para Nick específicamente

**Nick NO es un VC de Series A típico — es un fundador-operador.** Lo que él va a valorar:

- ✅ **Velocidad** (3 días → app deployable)
- ✅ **AI-native execution** (Claude Code + MCPs)
- ✅ **Conocimiento del negocio** (sabés qué es un primary agent vs sub-agent, conocés el split del premium, mencionás SFAA)
- ✅ **Estética coherente con su marca** (dark + amber matches sus sites)
- ⚠️ Le va a importar menos el "valuation framework para investors" que la **utilidad práctica** del tool

**Para Nick específicamente, esto SÍ es A-player.** Demostrás dominio del negocio + ejecución AI-native rápida + entendimiento del aesthetic. Lo que falta (sensitivity matrix, valuation comps, mobile polish) son cosas que él no espera de un trial de 3 días.

**Para un Series A investor cold, no lo es todavía.** Necesitarías otros 2-3 días de polish.

### Mi recomendación honesta

**Para el deadline del viernes con Nick:** estás bien. Foco en deploy + Loom + mensaje. **No agregues más features** — tenés que cerrar lo que hay.

**Si Nick quiere mostrarlo a un VC después:** documentás que necesitamos otra semana de trabajo (sources framework, sensitivity matrix, valuation page, mobile pass).

---

## 11. Plan para mañana y viernes — DEADLINE

### Jueves 16/04

#### Mañana (9-13:00) — verificar todo lo que dejé hecho

1. **Abrí localhost:3001** — verificá que el restyle dark slate + amber/gold se ve bien
2. **Recorré los 4 paneles** en orden, con la guía de cada uno (Notion) al lado
3. **Probá el flujo end-to-end:**
   - Home → Mid-market preset → snapshot → flip → preview Panel 2 → Panel 3 Travelers → Panel 4
4. **Si algo se ve raro estéticamente** (ej. contrast bajo, padding inconsistente), me decís y lo arreglo

#### Tarde (14-18:00) — agregar las 2 features que quedaron pendientes

1. **Sensitivity matrix en Panel 2** (90 min) — 4×4 grid con churn × renewal rate, cells = cumulative Nick net
2. **Tooltips "source" en metric cards clave** (60 min) — cada metric importante con un ℹ️ que explica de dónde sale
3. **Mobile responsive pass** (60 min) — Panel 4 table scroll, Panel 2 year-table scroll, Panel 1 metric grid

#### Noche (19-21:00) — confirmaciones con Nick (si podés)

Mandale las **9 open questions** (sección 13 de este doc) para que las responda y poder calibrar los números antes del Loom.

### Viernes 17/04 — DEADLINE EOD

#### 9-10:30 → polish final

- Build local: `pnpm build` para asegurar Vercel no falla
- README final actualizado
- Type check final

#### 10:30-12:00 → Vercel deploy

1. Cuenta en vercel.com → login con GitHub
2. Import `FedeMDPArg/surety-economics`
3. Env vars en dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL=https://xekaidmynbrhkuadtpcu.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...` (mismo valor)
   - `ANTHROPIC_API_KEY=...` (OPCIONAL — sin esto el chat queda en mock mode gratis)
4. Deploy → URL pública
5. Test en otro browser incógnito + en celular

#### 12-13 → screenshots + smoke test

#### 13-15 → grabar Loom

Usá Loom (https://loom.com — gratis hasta 25 videos). Script abajo en sección 12. 3-5 min ideal.

#### 15-16 → mensaje a Nick

Template del mensaje en el README + en el Notion hub. Personalizá si querés.

#### 16+ → enviado, descansa

---

## 12. Cómo le explicás a Nick que sos capaz de todo

### El mensaje conceptual

Nick contrata talento porque necesita **velocidad de ejecución + entendimiento del negocio**. Tu pitch demostrativo a él tiene que probar 3 cosas:

1. **Entendés el negocio** (no sos solo un dev random)
2. **Ejecutás rápido con AI** (no necesitás 3 meses para algo tangible)
3. **Tenés gusto y criterio** (no entregás cualquier cosa funcional)

### El mensaje verbal (Loom o llamada)

> *"Nick, in 3 days I built you an interactive model of your unit economics. Not a deck — a tool you can show carriers and investors live and let them play with the assumptions.*
>
> *I structured it as 4 panels because that's how an investor evaluates a business: unit economics → why does it compound → why do partners want in → why is it defensible.*
>
> *I made it on Claude Code with MCP servers — Supabase tables, Notion docs, Calendar scheduling, all from the chat. AI-native workflow applied to financial modeling.*
>
> *I pulled real industry data (SFAA, AM Best, McKinsey) but flagged where assumptions are mine and where I need your numbers — there's a list of 9 open questions I'd love to confirm.*
>
> *The most important insight I want to highlight: the regulatory unlock from sub-agent to primary agent is a 5x revenue multiplier without changing operations. I've never seen that argued this clearly elsewhere. Worth pushing in your fundraising or M&A conversations.*
>
> *Take a look — if it's useful, let's talk about what's next. If it's not, tell me where I missed."*

### Lo que NO decir

- ❌ "Aprendí Next.js esta semana" → suena junior
- ❌ "Es mi primera app" → resta credibilidad
- ❌ "Espero que te guste" → posición débil

### Lo que SÍ decir

- ✅ "Aplico mi background de PE a tu negocio" → posicionamiento fuerte
- ✅ "Quiero ver si esto te suma — si no, decime qué falta" → confianza
- ✅ "Hice esto en 3 días con Claude Code" → demostración de velocidad

### Qué hacer si te pregunta detalles técnicos

**Si pregunta "¿y cómo manejás la escala?"** → "Está hecho para ser un pitch tool, no producción. Para producción habría que cachear queries de Supabase, server-side rendering en Panels, y monitoring con Sentry. Pero el framework está armado correctamente, es Next.js + Vercel, escala lineal."

**Si pregunta "¿la AI chat realmente entiende surety?"** → "Right now está en mock mode (gratis, keyword-based). Cuando agregues API key de Anthropic queda live con Claude Sonnet 4.6 + prompt caching. El system prompt tiene cargados todos los datos del mercado SFAA — te lo paso si querés."

**Si pregunta "¿cuánto te costó hostear?"** → "Vercel hobby tier es gratis para esto. Supabase free tier cubre la data. Anthropic API solo cobra cuando alguien escribe en el chat — con ~$5 al mes está cubierto el uso típico."

---

## 13. Open questions para Nick

Antes del Loom, idealmente confirmás estos 9 puntos con Nick (mensaje corto). Cada uno cambia un número del modelo.

1. **¿Confirmás que el sub-agent override actual es 3% del premium?** ¿Es uniforme entre carriers o varía?
2. **¿Qué primary agency(s) usas hoy?** Para entender la relación comercial.
3. **¿En qué estados/jurisdicciones están las licencias en gestión** para pasar a primary agent?
4. **¿Timeline estimado** para completar la transición a primary? Es el deal-breaker del upside.
5. **¿Cuáles son los CAC reales de BuySuretyBonds?** ¿Blended? ¿Por canal (SEO vs ads)?
6. **¿Mix real commercial vs contract** en el book de BuySuretyBonds?
7. **¿Qué carriers están integrados hoy con BondGenius?** Para poblar Panel 4 con datos reales (hoy puse 4 con `integrated=true` arbitrarios).
8. **¿Tenés números concretos de FTE reduction / time-to-quote** de casos reales que BondGenius ya cerró? Para reemplazar mis assumptions.
9. **¿Tu renewal rate interno** vs industry average 75-88%? Podría ser mejor por UX superior — sería un bullet point clave.

### Mensaje sugerido

```
Hey Nick — antes de pasarte el Loom, querría confirmar 9 datos
de tu modelo para que las cifras del pitch sean tuyas, no estimaciones.
Si podés escribir respuestas cortas a estas preguntas, ajusto los números
y te paso el demo final con tus datos:

[lista las 9 arriba]

Sin presión — si no tenés tiempo, uso assumptions razonables y dejo
flageado donde aplica.
```

---

## 14. Quick reference

### URLs

- **App local:** http://localhost:3001 (port 3001 porque hay zombies en 3000)
- **GitHub repo:** https://github.com/FedeMDPArg/surety-economics (privado)
- **Vercel (futuro):** se genera el viernes
- **Supabase dashboard:** https://supabase.com/dashboard/project/xekaidmynbrhkuadtpcu

### Notion páginas vivas

- **Hub principal:** https://www.notion.so/33de4afe6f5a81698060e571eb8603c7
- **Guía Explicada:** https://www.notion.so/343e4afe6f5a81d28f51c4313280604a
- **Assumptions & Sources:** https://www.notion.so/343e4afe6f5a81eda56ee4d05dc13557
- **Guía Home:** https://www.notion.so/343e4afe6f5a8166ba46c89abdfa0668
- **Guía Panel 1:** https://www.notion.so/343e4afe6f5a8108b0c1f03990f95786
- **Guía Panel 2:** https://www.notion.so/343e4afe6f5a8141b42fc0f75c54f097
- **Guía Panel 3 v2:** https://www.notion.so/343e4afe6f5a8141b44ae0c132fda07b
- **Guía Panel 4:** https://www.notion.so/343e4afe6f5a8121b0fef0b194c9c4f1
- **Contexto para Claude:** https://www.notion.so/341e4afe6f5a81d8b679dc21e04c19bc

### Comandos críticos

```bash
# Iniciar dev server
cd c:/Users/scarc/surety-economics
pnpm dev

# Type check
pnpm tsc --noEmit

# Build (testear antes de deploy)
pnpm build

# Git workflow
git add .
git commit -m "descripción"
git push

# Si dev server se cuelga
tasklist | findstr node     # listar procesos
taskkill //PID XXXXX //F    # matar uno específico
```

### Variables de entorno (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=https://xekaidmynbrhkuadtpcu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIs... (mismo valor)
ANTHROPIC_API_KEY=sk-ant-... (OPCIONAL — sin esto el chat es mock gratis)
```

### Documentos en el proyecto

- `README.md` — overview público (lo ven los que abren GitHub)
- `CONTEXTO_Nick60Days.md` — contexto para pegar al inicio de chats nuevos
- `GUIA_EXPLICADA.md` — explicación de cada panel (versión local del Notion)
- `DOCUMENTO_MAESTRO.md` — **este documento**

---

## 🎯 Conclusión

Estás en una posición buena. Tenés:

- Una app con 4 paneles que cuenta una historia coherente de unit economics → moat → carrier ROI → marketplace defensibility
- Documentación robusta en Notion + locales
- GitHub repo pusheado con todos los commits
- Una guía honesta de qué falta y qué hacer

**Para mañana:** verificar el restyle, agregar sensitivity matrix + sources tooltips + mobile pass.
**Para el viernes:** deploy a Vercel + Loom + mensaje a Nick.

**No agregues más scope.** Tenés que cerrar lo que hay con polish. El éxito del trial con Nick depende de la calidad de la entrega final, no del número de features.

Si pasás el viernes con app deployada + Loom + mensaje enviado, **ya hiciste el trial.** Lo que pase después depende de Nick — pero vos hiciste tu parte.

Buena suerte. Descansá esta noche, mañana arrancás con todo este contexto cargado.

— *Cierre del 15/04, 23:30*
