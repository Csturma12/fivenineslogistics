import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { createLoadsAdminClient } from "@/lib/supabase/loads-admin";
import { centralToday } from "@/lib/portal-contract";

type OpenShipment = {
  shipment_id: string | number | null;
  status: string | null;
  carrier_name: string | null;
  from_city: string | null;
  from_state: string | null;
  to_city: string | null;
  to_state: string | null;
  ship_date: string | null;
  delivery_date: string | null;
  equipment_type: string | null;
  total_weight: number | string | null;
};

// No buy/sell/customer columns: rates are never posted to carriers.
const COLUMNS =
  "shipment_id,status,carrier_name,from_city,from_state,to_city,to_state,ship_date,delivery_date,equipment_type,total_weight";

const MIN_INTERVAL_MS = 60_000;
const FORCED_MIN_INTERVAL_MS = 15_000;
let lastRun = 0;
let running: Promise<number> | null = null;

function weight(value: number | string | null) {
  const n = value == null || value === "" ? NaN : Number(value);
  return Number.isFinite(n) && n > 0 && n <= 2_000_000 ? n : null;
}

function closedStatus(row: OpenShipment | undefined) {
  if (!row) return "cancelled";
  if (row.status === "Cancelled") return "cancelled";
  if (row.status === "Delivered") return "delivered";
  if (row.status === "Dispatched") return "in_transit";
  if (row.carrier_name) return "booked";
  return null;
}

async function runSync() {
  const main = createLoadsAdminClient();
  const portal = createAdminClient();
  const now = new Date().toISOString();

  const { data, error } = await main
    .from("shipments")
    .select(COLUMNS)
    .in("status", ["Committed", "Quote"])
    // TAI writes uncovered shipments with an empty carrier string rather than null.
    .or("carrier_name.is.null,carrier_name.eq.")
    .gte("ship_date", centralToday())
    .order("ship_date", { ascending: true })
    .limit(500);
  if (error) throw new Error(`Open shipment read failed: ${error.message}`);

  const open = ((data ?? []) as OpenShipment[]).filter(
    (r) => r.shipment_id != null && r.from_city && r.from_state && r.to_city && r.to_state,
  );
  const rows = open.map((r) => ({
    external_id: String(r.shipment_id),
    status: "available",
    customer_account_id: null,
    origin_city: r.from_city,
    origin_state: r.from_state,
    dest_city: r.to_city,
    dest_state: r.to_state,
    pickup_date: r.ship_date,
    delivery_date:
      r.delivery_date && r.ship_date && r.delivery_date < r.ship_date ? null : r.delivery_date,
    equipment: r.equipment_type || null,
    weight_lbs: weight(r.total_weight),
    dimensions: null,
    carrier_offer_usd: null,
    auto_book: false,
    tracking_location: null,
    tracking_at: null,
    updated_at: now,
  }));

  let written = 0;
  for (let i = 0; i < rows.length; i += 100) {
    const { data: count, error: ingestError } = await portal.rpc("fn_ingest_loads", {
      p_rows: rows.slice(i, i + 100),
    });
    if (ingestError) throw new Error(`Load ingest failed: ${ingestError.message}`);
    written += Number(count) || 0;
  }

  // Take loads off the board once TAI shows them covered, cancelled or gone.
  const openIds = new Set(rows.map((r) => r.external_id));
  const { data: posted } = await portal
    .from("fn_loads")
    .select("external_id")
    .eq("status", "available")
    .is("reserved_by", null)
    .limit(1000);
  const stale = (posted ?? [])
    .map((p: { external_id: string }) => p.external_id)
    .filter((id) => !openIds.has(id));
  for (let i = 0; i < stale.length; i += 200) {
    const batch = stale.slice(i, i + 200);
    const { data: current } = await main.from("shipments").select(COLUMNS).in("shipment_id", batch);
    const byId = new Map(
      ((current ?? []) as OpenShipment[]).map((r) => [String(r.shipment_id), r]),
    );
    for (const id of batch) {
      const status = closedStatus(byId.get(id));
      if (!status) continue;
      await portal
        .from("fn_loads")
        .update({ status, updated_at: now })
        .eq("external_id", id)
        .eq("status", "available");
    }
  }
  return written;
}

/** Pulls uncovered TAI shipments (Committed + Quote) onto the carrier board on demand. */
export async function syncOpenLoads({ force = false } = {}) {
  if (running) return running;
  const wait = force ? FORCED_MIN_INTERVAL_MS : MIN_INTERVAL_MS;
  if (Date.now() - lastRun < wait) return 0;
  running = runSync()
    .then((count) => {
      lastRun = Date.now();
      return count;
    })
    .finally(() => {
      running = null;
    });
  return running;
}
