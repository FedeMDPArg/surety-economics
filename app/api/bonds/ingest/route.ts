import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/**
 * Webhook endpoint for BuySuretyBonds bond ingestion.
 *
 * Nick's pipeline POSTs here after issuing a bond → it appears
 * in the dashboard automatically. Supports single or batch insert.
 *
 * POST /api/bonds/ingest
 * Body: { bond } or { bonds: [...] }
 *
 * Each bond object:
 * {
 *   bond_type_name: "Contractor License",
 *   bond_amount: 100000,
 *   premium: 2500,
 *   rate: 0.025,
 *   credit_score: 720,        // optional
 *   state: "CA",              // optional
 *   business_type: "contractor", // optional
 *   principal_name: "ABC Corp",  // optional
 *   carrier_name: "Travelers",   // optional
 *   source: "buysurety-api"      // optional, defaults to "webhook"
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Accept single bond or array
    const bonds: Record<string, unknown>[] = body.bonds
      ? body.bonds
      : body.bond
        ? [body.bond]
        : [body];

    if (!bonds.length || !bonds[0].bond_type_name) {
      return NextResponse.json(
        {
          error: "Invalid payload. Provide { bond: {...} } or { bonds: [...] }",
          example: {
            bond: {
              bond_type_name: "Contractor License",
              bond_amount: 100000,
              premium: 2500,
              rate: 0.025,
            },
          },
        },
        { status: 400 },
      );
    }

    // Map to DB schema
    const rows = bonds.map((b) => ({
      bond_type_name: b.bond_type_name,
      bond_amount: b.bond_amount,
      premium: b.premium,
      rate: b.rate,
      credit_score: b.credit_score ?? null,
      state: b.state ?? null,
      business_type: b.business_type ?? null,
      principal_name: b.principal_name ?? null,
      carrier_name: b.carrier_name ?? null,
      source: b.source ?? "webhook",
      status: "active",
      renewal_due_at: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      metadata: b.metadata ?? {},
    }));

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    );

    const { data, error } = await supabase
      .from("bonds_sold")
      .insert(rows)
      .select("id, bond_type_name, bond_amount, premium, status");

    if (error) {
      return NextResponse.json(
        { error: `Supabase error: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      inserted: data?.length ?? 0,
      bonds: data,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * GET /api/bonds/ingest — returns usage documentation
 */
export async function GET() {
  return NextResponse.json({
    name: "BuySuretyBonds → Surety Economics Webhook",
    description:
      "POST bond data here after issuance. The dashboard auto-updates.",
    endpoint: "/api/bonds/ingest",
    method: "POST",
    content_type: "application/json",
    body_format: {
      single: {
        bond: {
          bond_type_name: "Contractor License (required)",
          bond_amount: "100000 (required)",
          premium: "2500 (required)",
          rate: "0.025 (required)",
          credit_score: "720 (optional)",
          state: "CA (optional)",
          business_type: "contractor (optional)",
          principal_name: "ABC Corp (optional)",
          carrier_name: "Travelers (optional)",
          source: "buysurety-api (optional, default: webhook)",
        },
      },
      batch: {
        bonds: ["array of bond objects (same shape as above)"],
      },
    },
    integration_steps: [
      "1. Point your BuySuretyBonds post-issuance hook to POST /api/bonds/ingest",
      "2. Include bond_type_name, bond_amount, premium, rate in each payload",
      "3. The Surety Economics dashboard reads from bonds_sold table in real-time",
      "4. Panel 1 portfolio auto-populates with live data",
    ],
  });
}
