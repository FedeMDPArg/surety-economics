# 📘 Guía Explicada — Surety Bond Unit Economics Platform

> **Qué es este documento:** la explicación de TODO lo que estamos construyendo — qué es cada panel, qué se calcula, cómo se calcula, por qué importa, y cómo pitchearlo. Escrito para que puedas explicárselo a Nick, a un inversor o a un carrier sin referencias al código.

**Última actualización:** 2026-04-15 — modelo económico reescrito (Nick = sub-agent 3% → primary agent 15%)

---

## 📖 Glosario rápido (memorizar esto primero)

| Término | Qué es | Ejemplo |
|---|---|---|
| **Bond amount** | El monto de la garantía (cuánto cubre el bond si hay incumplimiento) | $100,000 |
| **Premium** | Lo que el cliente paga anualmente para obtener el bond. Fracción chica del bond amount | $2,000 (2% de $100K) |
| **Rate** | Premium expresado como % del bond amount | 2% |
| **Carrier** | Aseguradora que emite el bond y pone el capital de garantía | Travelers, Liberty Mutual, CNA, Zurich |
| **Carrier retention** | % del premium que se queda el carrier | 85% = $1,700 |
| **Channel commission** | % del premium que el carrier paga al canal de distribución | 15% = $300 |
| **Primary agency** | Agencia licenciada con contrato directo con carriers. Hace underwriting y emite bonds | SuretyOne (12% del premium) |
| **Sub-agent** | Actor que trae clientes a una primary agency. No tiene contrato directo con carriers | BuySuretyBonds HOY (3% del premium) |
| **CAC** | Customer Acquisition Cost — plata que gasta Nick para traer un cliente | ~1.2% del premium = $24 |
| **Net income** | Ganancia real de Nick después de pagar CAC + OpEx + team | $15–$30 por bond |

---

## 🎯 0. La tesis del proyecto

Nick ya tiene **3 productos que funcionan** (BuySuretyBonds.com, BondGenius.ai, BondSigner.com). Lo que no tiene es una herramienta visual para **explicarle a otros en 3 minutos por qué el negocio es atractivo**.

**Esta app resuelve eso.** Es:
- Una herramienta de **venta a carriers** (Travelers, Liberty) para convencerlos de integrarse
- Una herramienta de **pitch a inversores** (para levantar capital o vender)
- Un **simulador de unit economics** que Nick puede usar internamente

**Por qué yo y no cualquier developer:** con background de PE, modelo la tesis de inversión en código. Cada panel responde una pregunta de due-diligence real.

### La lógica de los 4 paneles

| Panel | Pregunta que responde | Audiencia clave |
|---|---|---|
| **1 — Unit Economics Waterfall** | ¿Cómo se reparte el premium y cuánto gana Nick hoy vs como primary agent? | Inversores + Nick |
| **2 — Renewal Engine** | ¿Por qué el revenue compone? (el moat) | Inversores |
| **3 — Carrier Pitch + AI** | ¿Cuál es el ROI para un carrier que se integra? | Carriers |
| **4 — Appetite Match** | ¿Por qué multi-carrier > single-carrier? | Carriers + Nick |

---

## 🛠️ 1. El stack — qué hace cada herramienta y por qué está acá

### Herramientas de desarrollo

| Herramienta | Qué hace | Por qué está en este proyecto |
|---|---|---|
| **Node.js** | Motor que corre JavaScript fuera del browser | Sin esto, nada funciona |
| **Next.js 16** | Framework frontend + backend en un solo lugar | Routing (`/panel1..4`), Server Components, deploys a Vercel |
| **TypeScript** | JavaScript con tipos | Atrapa errores en edición. Crítico para no-developers |
| **Tailwind CSS** | Estilos con clases en el HTML | UI profesional rápido sin ser diseñador |
| **Chart.js + react-chartjs-2** | Gráficos (bar, line, stacked area) | Los paneles son 80% visualización |
| **Supabase** | PostgreSQL + auth + APIs hosteado | Guardar `bond_types` y `carrier_profiles` |
| **pnpm** | Instalador de paquetes (más rápido que npm) | Agregar librerías |
| **Vercel** | Hosting gratuito conectado a GitHub | URL pública para Nick |
| **Claude API (Anthropic)** | API de IA con contexto | El chat del Panel 3 |

### MCP Servers — el diferencial técnico

Los **MCP servers** permiten que Claude Code **actúe sobre sistemas externos directamente desde el chat**:

| MCP | Qué hace | Cómo lo usé |
|---|---|---|
| **Supabase MCP** | Ejecuta SQL, crea tablas y migraciones | Creé `bond_types` y `carrier_profiles` sin abrir el dashboard |
| **Notion MCP** | Lee y edita Notion | Actualicé las páginas del workspace sin abrir Notion |
| **Google Calendar MCP** | Crea eventos | Bloqueé jueves 16 y viernes 17 sin abrir Calendar |

**Por qué importa:** esto es "AI-native tooling 2026". Para Nick, que construye productos de IA, es exactamente el stack que va a valorar.

---

## 📊 2. Panel 1 — Unit Economics Waterfall

**URL:** `/panel1`
**Pregunta que responde:** *¿Cómo se reparte cada dólar de premium, y cuánto de ese premium toca Nick hoy como sub-agent vs mañana como primary agent? ¿Cómo escala con volumen?*

El Panel tiene **dos modos de análisis** (toggle Single bond / Portfolio) y **un toggle de rol** (Sub-agent / Primary agent). Combinados te dan 4 vistas distintas del mismo modelo económico.

### 🎛️ Controles globales

- **Rol:** "Sub-agent (today)" / "Primary agent (future) 🚀" — cambia el % del channel commission que captura Nick (3% → 15%)
- **Vista:** "Single bond" / "Portfolio"
- **Timeframe (solo en Portfolio):** "Monthly" / "Annual (×12)" — multiplica todos los totales

### 🧮 Single bond view

Un solo bond, análisis completo de unit economics:

- **Inputs (todos con slider + text input para valores precisos):**
  - Dropdown de tipo de bond (desde Supabase)
  - Bond amount ($5K–$500K, o cualquier valor que tipees)
  - Credit score (550–800)
  - Sub-agent override % O Primary commission % (según modo)
  - CAC % del premium
  - Platform OpEx % del premium
- **5 metric cards:** Premium, Nick gross, Nick net, Net margin %, Upside multiplier
- **Waterfall chart** de 3 niveles + breakdown tree con USD absolutos
- **Botón "+ Add this bond to portfolio"** — copia el bond actual a la vista Portfolio (qty default 100)

### 📂 Portfolio view

Análisis de múltiples bond configs al mismo tiempo:

- **6 metric cards** agregadas: Total bonds, Premium volume, Nick gross, Nick net, **LTV (5y book)**, Blended margin
- **Tabla editable** con una fila por config: Bond type, Qty/mo, Bond amount, Credit score, Premium/bond, Nick net/bond, Total net, **LTV/bond**
- **3 presets quick-load:**
  - **Small agency** (100 bonds/mo) — un broker solo en 1 estado
  - **Mid-market** (1,000 bonds/mo) — agencia multi-estado
  - **BuySuretyBonds scale** (5,000 bonds/mo) — target de Nick
- **Aggregate waterfall chart** + breakdown del portfolio entero
- **Scenario comparison (snapshot):** guardás el estado actual, cambiás algo, la app muestra las 3 métricas principales con delta en $ y % (útil para demo en vivo)
- **📋 Copy for Excel** — exporta la tabla como TSV (tab-separated), al pegar en Excel/Sheets va directo a columnas

### Qué se calcula — el waterfall completo

Ejemplo base: bond de **$100,000** con rate 2% → **premium $2,000**.

#### Nivel 1 — El premium se parte en 2

| Destino | % | USD |
|---|---|---|
| Carrier retention | 85% | $1,700 |
| Channel commission | 15% | $300 |

#### Nivel 2 — Qué hace el carrier con su 85%

| Sub-componente | % del premium | USD | Fuente |
|---|---|---|---|
| Losses / claims paid | 25% | $500 | SFAA 2024 loss ratio YTD: 24.9% |
| Carrier OpEx | 15% | $300 | Industry standard (underwriting, reinsurance) |
| Carrier underwriting profit | 45% | $900 | Derivado |

#### Nivel 3 — Cómo se divide el 15% del channel

**Modo sub-agent (hoy):**

| Quién | % del premium | USD |
|---|---|---|
| Primary agency (licenciada) | 12% | $240 |
| **Nick sub-agent override** | **3%** | **$60** |

**Modo primary agent (futuro):**

| Quién | % del premium | USD |
|---|---|---|
| **Nick primary** | **15%** | **$300** |

#### Nivel 4 — Dentro del take de Nick

| Sub-componente | % premium | USD (modo sub-agent) | Qué es |
|---|---|---|---|
| CAC (SEO + ads + content) | 1.0–1.5% | $20–$30 | Costo de traer al cliente al sitio |
| Platform OpEx | 0.3–0.5% | $6–$10 | Vercel, Supabase, Stripe fees, software |
| Team / labor prorateado | 0.2–0.4% | $4–$8 | Support + engineering distribuido por bond |
| **Net income de Nick** | **0.8–1.5%** | **$15–$30** | **Ganancia real por bond** |

### 📈 Concepto clave: LTV (Lifetime Value)

Cada bond no se paga una sola vez — **renueva todos los años**. Notary bonds renuevan al 75%, Contractor al 88%, Performance al 60%. El LTV agrega el net income del bond a través de 5 años de renovaciones.

**Fórmula:**
```
LTV = net_per_bond × (1 + r + r² + r³ + r⁴)
donde r = renewal_rate × (1 − annual_churn)
usamos churn = 10% (assumption)
```

**Ejemplos concretos:**
- Contractor License, renewal 88%, churn 10% → r = 0.79 → multiplier 3.28x
  - Si Nick net/bond = $30 → **LTV = $98**
- Performance Bond, renewal 60%, churn 10% → r = 0.54 → multiplier 2.06x
  - Si Nick net/bond = $750 → **LTV = $1,545**

**Por qué importa para la valuación:** una agencia valuada por revenue del año 1 se ve chica. Valuada por LTV, el mismo book vale 2–3x más. **Esto es lo que justifica múltiplos de valuación más altos en surety que en brokers de una sola transacción.** Cierra el loop con Panel 2 (Renewal Engine).

### ⚡ Presets — por qué son útiles

Los 3 presets son **ejemplos de escala**, no tipos de agencia diferentes. Son snapshots típicos de cómo se ve un book de bonds a distintos volúmenes:

- **Small agency = 100 bonds/mo:** un broker solo, típicamente 1 estado, mix commercial-heavy. El baseline de la industria.
- **Mid-market = 1K bonds/mo:** agencia con equipo, multi-estado, mix más diverso (incluye freight broker).
- **BuySuretyBonds scale = 5K bonds/mo:** marketplace DTC nacional — el target de Nick.

Los cargás en 1 click en la demo: *"Nick, acá está Small agency con sub-agent, genera $X/mes. Y acá está BuySuretyBonds scale con primary agent, son $Y/mes."* — en 20 segundos le mostrás el path de crecimiento.

### 📸 Snapshot comparison — la herramienta de pitch

Funciona así durante la demo:
1. Cargás **Mid-market** en modo **sub-agent**
2. Click **"Save snapshot now"** → guarda los totales actuales
3. Click **"Primary agent 🚀"** → el toggle cambia, el waterfall se redibuja
4. Aparecen **3 delta cards en verde** mostrando: Total premium → antes $X / ahora $X / +$0 (no cambia), Nick gross → antes $Y / ahora $Y×5 / +400% (verde brillante), Nick net → antes $Z / ahora mucho más

Es la forma visual más fuerte de mostrar la palanca del 5x.

### 📊 Copy for Excel

Exporta la tabla del portfolio como TSV (tab-separated) — al pegar con Ctrl+V en Excel, Google Sheets o Numbers, va directo a columnas. Incluye LTV y totales. Para que Nick pueda llevar los números a su propio modelo después de la demo.

### Por qué este panel gana

1. **Es el único que muestra la palanca del cambio regulatorio** — el 5x multiplier sin mover volumen
2. **Los sliders + text inputs** permiten a Nick ajustar assumptions en vivo durante la demo → transparencia + herramienta útil
3. **Portfolio + presets** muestra el camino de escala — no es teórico, son scenarios cargables en 1 click
4. **LTV** cierra el loop con Panel 2 y argumenta la valuación alta
5. **Snapshot comparison** convierte la abstracción del 5x en un delta concreto en USD sobre la pantalla
6. Técnicamente demuestra: Supabase read, state management complejo (múltiples modos), waterfall interactivo con drill-down, data export, sliders + inputs híbridos

### Cómo pitchearlo (recomendado: seguir este orden)

> *"Este panel muestra qué pasa con cada dólar de premium. Arrancamos en **Single bond** — un bond de $100K, rate 2%. El cliente paga $2,000 de premium, vos como sub-agent tocás $60. De esos $60, sacando CAC y OpEx te queda ~$30 de net.*
>
> *Ahora cambio al toggle **Primary agent**. Mirá el waterfall — ahora tocás $300 por bond. 5x. Ese es el unlock del cambio regulatorio.*
>
> *Pero un bond es abstracto. Voy a **Portfolio** y cargo el preset **Mid-market** — 1,000 bonds/mo. En sub-agent eso son $X/mes netos. Guardo snapshot. Cambio a Primary. Mirá la comparison card — +$YK/mes netos. Y eso es mensual; flipeo a **Annual** y ves $ZM/año de diferencia.*
>
> *Y esto es solo año 1. La columna **LTV** muestra que cada bond vale 2-3x su net del año 1 porque renuevan. Eso es lo que justifica múltiplos de valuación altos."*

---

## 🚀 3. La palanca del cambio a primary agent

**Este es el argumento de valuación más importante del pitch.** Merece su propia sección porque se mezcla con Panel 1 pero es conceptualmente más grande.

### Por qué Nick hoy es sub-agent

Para ser primary agent necesita:
- **Licencias de producer de seguros** en cada estado (50 estados)
- **Appointment formal de cada carrier** (contratos + due-diligence)
- **Capacidad de underwriting propia**
- **Capital backing** y cumplimiento regulatorio

Hoy Nick tiene la **plataforma tecnológica + canal de tráfico**, pero apoya underwriting y emisión en una primary agency.

### Analogía: Kayak vs Expedia

| Rol en surety | Equivalente en travel | Qué hace |
|---|---|---|
| Carrier | Aerolínea (American, Delta) | Vende producto / asume riesgo |
| Primary agency | Expedia, Booking | Contratos directos, comisión grande |
| Sub-agent (Nick HOY) | Kayak, Skyscanner | Manda tráfico → primary, cobra fee chico |
| Primary agent (Nick FUTURO) | Expedia | Salta intermediario, commission completo |

### Impacto de la transición — sin mover volumen

| Bonds/mes | Premium total/mes | Nick como sub-agent (3%) | Nick como primary (15%) | **Upside mensual** |
|---|---|---|---|---|
| 500 | $1,000,000 | $30,000 | $150,000 | **+$120,000** |
| 2,000 | $4,000,000 | $120,000 | $600,000 | **+$480,000** |
| 5,000 | $10,000,000 | $300,000 | $1,500,000 | **+$1,200,000** |

**Es un cambio regulatorio, no operativo.** No requiere aumentar volumen, mejorar conversión, ni bajar costos. Solo completar las licencias. Por eso es la palanca de valuación más limpia del pitch.

---

## 🔄 4. Panel 2 — Renewal Revenue Engine

**URL:** `/panel2` ✅ YA CONSTRUIDO
**Pregunta que responde:** *¿Por qué el revenue de este negocio compone? ¿Cuánto del revenue al año 5 es recurrente vs ventas netas?*

**Este es el panel financiero más importante.** Es el argumento del moat.

### Qué ve el usuario

- **6 sliders** con inputs del modelo
- **4 metric cards:** MRR mes 12, 36, 60, y **% revenue from renewals al mes 60**
- **Stacked area chart** mes a mes hasta 60 meses, mostrando new bonds revenue (azul) y renewal revenue (verde)
- **Box explicativo** con la lectura PE-grade

### Qué se calcula

Modelo **cohort-based** — cada mes entra una cohorte de bonds nuevos que intenta renovar cada 12 meses.

**Para cada mes `m` del horizonte:**

```
New revenue(m) = bonds_per_month × avg_premium
Renewal revenue(m) = Σ (cohortes previas c donde (m-c) es múltiplo de 12):
                     bonds_per_month × avg_premium × renewal_rate × survival_factor

survival_factor = (1 - annual_churn) ^ (edad_de_la_cohorte_en_años)
```

### Inputs ajustables

| Input | Default | Rango | Por qué importa |
|---|---|---|---|
| New bonds per month | 500 | 50–5000 | El volumen del negocio |
| Commercial mix | 80% | 0–100% | Commercial son chicos ($400) pero renuevan al 85%. Contract son grandes ($5000) pero renuevan al 60% |
| Renewal commercial | 85% | 50–95% | Market: 75–88% |
| Renewal contract | 60% | 30–85% | Performance bonds son one-off más frecuentes |
| Annual churn | 10% | 5–25% | Clientes que cierran el negocio |
| Horizon | 5 años | 1–5 años | Cuánto tiempo ver el compounding |

### Por qué este cálculo (y no una fórmula lineal)

1. **Cohortes tienen edades distintas.** Una del mes 1 ya renovó 4 veces al mes 60; una del mes 48 todavía no renovó
2. **El churn se compone.** Si churn es 10% anual, al año 5 sobrevive el 59% de la cohorte original, no el 50%
3. **Las renewals son eventos discretos** cada 12 meses, no continuos

Un PE analyst mira un gráfico así y sabe que el modelo está bien hecho.

### Cómo pitchearlo

> *"Mové el commercial mix al 80% — así es tu mix real. Mirá al mes 60: el 70% del revenue viene de renovaciones. No estás vendiendo bonds nuevos cada mes — cada bond que vendiste hace 2 años está todavía pagando. Ese es el moat, y acá está visible. Un inversor entiende por qué el múltiplo de valuación en surety es mayor que en un broker tradicional."*

---

## 🤖 5. Panel 3 — Carrier Pitch Calculator + AI Chat (próximo)

**URL:** `/panel3`
**Pregunta que responde:** *Si yo soy Travelers / Liberty Mutual, ¿cuál es mi ROI concreto de integrarme con BondGenius?*

**Este es el panel que cierra una venta a un carrier.**

### Sección A — Calculator

**Inputs:** annual premiums del carrier, % en surety, # de agencias en su red, tiempo actual de issuance

**Outputs calculados:**

```
Projected incremental premiums = annual_premiums × surety_share × 0.15
FTE reduction = (GWP_in_surety / 10M) × 4
Lost renewals recovered = annual_premiums × surety_share × renewal_rate × 0.13
Time-to-quote improvement = ((baseline_days × 24 × 60) - 1) / (baseline_days × 24 × 60)
```

**Assumptions (basadas en research):**
- Digitalization uplift: +15% de premium volume (McKinsey)
- FTE baseline: 6 → 2 por $10M GWP, ahorro de 4 FTEs × $120K loaded = $480K/$10M GWP
- Lost renewals recoverable: 12–15%
- Time-to-quote: de 2–5 días a 60 segundos

### Sección B — AI Chat

**Flujo técnico:**
1. Usuario escribe un mensaje
2. Frontend manda a `/api/chat` (Next.js Route Handler en server)
3. Server llama Anthropic API con:
   - **Modelo:** `claude-sonnet-4-6` (2026)
   - **Prompt caching** habilitado en el system prompt (reduce costo 10x)
   - **System prompt** con datos del mercado surety
4. Respuesta vuelve al frontend

### Por qué incluir un chat con IA

Nick es fundador de **BondGenius.ai**. Que yo integre IA con system prompt cargado de domain knowledge (surety) **demuestra que puedo hacer exactamente lo que hace BondGenius internamente**.

### Cómo pitchearlo

> *"Sección A: si sos un carrier con $500M en premiums anuales, 8% en surety, integrarte con BondGenius te da $6M de upside + ahorrás 16 FTEs. Sección B: este chat está alimentado con los datos reales del mercado — preguntale cualquier cosa de surety y responde con los números correctos. Esto es BondGenius embebido como demo."*

---

## 🎯 6. Panel 4 — Carrier Appetite Match (próximo)

**URL:** `/panel4`
**Pregunta que responde:** *¿Por qué un agente/principal está mejor con multi-carrier access que con un solo carrier?*

### Qué ve el usuario

- Dropdown: estado US (50 estados)
- Dropdown: business type (contractor, notary, freight broker, auto dealer, executor)
- Input: bond amount
- **Tabla rankeada de carriers** con fit score
- Visualización "With 1 carrier X% approval, 3 carriers Y%, 5 carriers Z%"

### Qué se calcula

**Fit score por carrier:**
```
score = (treasury_limit_match) × 0.4 + (state_licensed ? 1 : 0) × 0.3 + (segment_match ? 1 : 0) × 0.3
```

**Approval rate con N carriers** (asumiendo p ≈ 60% por carrier):
```
approval_rate = 1 - (1 - p)^N
```

- 1 carrier: 60%
- 3 carriers: 94%
- 5 carriers: 99%

### Cómo pitchearlo

> *"Si un contratista en Texas necesita un bond de $100K, con 1 carrier capturás el 60% del mercado. Con 5 llegás al 99%. Ese es el argumento de por qué un marketplace de surety gana a un carrier directo — y es cuantificable."*

---

## 📦 7. Navegación + Landing + Deploy (Día 3)

### Navegación
Sidebar con links a los 4 paneles. Profesional, oscura, responsive.

### Landing (`/`)
Reemplaza el starter default. Explica la app en 1 pantalla:
- "Surety Bond Unit Economics Platform"
- "Understanding the economics of a $9.5B market, built in 3 days"
- 4 cards linkeando a cada panel

### Deploy
1. `git init` → push a GitHub
2. Conectar GitHub a Vercel (5 min)
3. Configurar env vars en Vercel (SUPABASE_URL/KEYS, ANTHROPIC_API_KEY)
4. Deploy automático → URL pública

### Mensaje a Nick
Email con 3 links: URL pública, GitHub, Loom (3–5 min).

---

## 🎬 8. Cómo presentar a Nick — orden recomendado

1. **Abrir con la tesis (30 seg):** *"Nick, instead of a generic tool, I modeled the full unit economics of your business. Every panel answers a due-diligence question."*
2. **Panel 1 (2 min) — la vedette nueva:** *"How a premium dollar breaks down, and why moving from sub-agent to primary agent is a 5x revenue unlock."*
3. **Panel 2 (2 min):** *"Why this business compounds — 70% of revenue at month 60 is renewals."*
4. **Panel 3 (2 min):** *"Your pitch to carriers, quantified. And a live chat with Claude Sonnet 4.6 loaded with surety data — essentially BondGenius embedded."*
5. **Panel 4 (1 min):** *"Why multi-carrier access beats any single carrier."*
6. **Cerrar (30 seg):** *"Built in 3 days using Claude Code + MCP servers to manage Supabase, Notion, and Calendar without leaving the chat. It's the AI-native workflow applied to financial modeling. Let's talk next steps."*

---

*Documento vivo — se actualiza cada vez que cambian los números o se completa un panel.*
