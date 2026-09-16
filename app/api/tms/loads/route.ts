import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

const VALID_STATUSES = ["available", "booked", "in_transit", "delivered", "cancelled"] as const
type ValidStatus = (typeof VALID_STATUSES)[number]

type IngestRow = {
  external_id?: unknown
  reference?: unknown
  status?: unknown
  origin_city?: unknown
  origin_state?: unknown
  dest_city?: unknown
  dest_state?: unknown
  pickup_date?: unknown
  delivery_date?: unknown
  equipment?: unknown
  mode?: unknown
  weight_lbs?: unknown
  commodity?: unknown
  distance_mi?: unknown
  rate_usd?: unknown
  stops?: unknown
  notes?: unknown
}

function str(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

function num(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function normalizeStatus(value: unknown): ValidStatus {
  const s = str(value)?.toLowerCase()
  return (VALID_STATUSES as readonly string[]).includes(s ?? "") ? (s as ValidStatus) : "available"
}

function mapRow(row: IngestRow) {
  return {
    external_id: str(row.external_id),
    reference: str(row.reference),
    status: normalizeStatus(row.status),
    origin_city: str(row.origin_city),
    origin_state: str(row.origin_state),
    dest_city: str(row.dest_city),
    dest_state: str(row.dest_state),
    pickup_date: str(row.pickup_date),
    delivery_date: str(row.delivery_date),
    equipment: str(row.equipment),
    mode: str(row.mode),
    weight_lbs: num(row.weight_lbs),
    commodity: str(row.commodity),
    distance_mi: num(row.distance_mi),
    rate_usd: num(row.rate_usd),
    stops: num(row.stops),
    notes: str(row.notes),
    updated_at: new Date().toISOString(),
  }
}

export async function POST(request: Request) {
  const token = process.env.TMS_INGEST_TOKEN
  if (!token) {
    return NextResponse.json(
      { error: "ingest not configured", detail: "TMS_INGEST_TOKEN is not set." },
      { status: 503 },
    )
  }

  const authHeader = request.headers.get("authorization") ?? ""
  const provided = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : ""
  if (!provided || provided !== token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 })
  }

  const rows = Array.isArray(body) ? body : [body]
  if (rows.length === 0) {
    return NextResponse.json({ error: "no loads provided" }, { status: 400 })
  }

  const mapped = rows.map((row) => mapRow((row ?? {}) as IngestRow))
  const missingExternalId = mapped.some((row) => !row.external_id)
  if (missingExternalId) {
    return NextResponse.json(
      { error: "every load must include an external_id for idempotent upsert" },
      { status: 400 },
    )
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("loads")
    .upsert(mapped, { onConflict: "external_id" })
    .select("external_id, status")

  if (error) {
    console.error("[v0] TMS ingest upsert error:", error.message)
    return NextResponse.json({ error: "failed to store loads", detail: error.message }, { status: 500 })
  }

  return NextResponse.json({ ingested: data?.length ?? 0, loads: data ?? [] })
}
