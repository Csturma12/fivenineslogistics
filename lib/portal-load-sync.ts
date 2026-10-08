import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { createLoadsAdminClient } from "@/lib/supabase/loads-admin";
import { allPortalRows, PORTAL_PAGE_SIZE } from "@/lib/portal-pages";
import type { pickupWindow } from "@/lib/portal-load-window";
import { PortalProblem } from "@/lib/portal-contract";

type OpenShipment = {
  id: number | string;
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
  "id,shipment_id,status,carrier_name,from_city,from_state,to_city,to_state,ship_date,delivery_date,equipment_type,total_weight";

const MIN_INTERVAL_MS = 60_000;
const FORCED_MIN_INTERVAL_MS = 15_000;
type PickupWindow = ReturnType<typeof pickupWindow>;
const lastRun = new Map<string, number>();
const running = new Map<string, Promise<number>>();

function weight(value: number | string | null) {
  const n = value == null || value === "" ? NaN : Number(value);
  return Number.isFinite(n) && n > 0 && n <= 2_000_000 ? n : null;
}

function closedStatus(row: OpenShipment | undefined) {
  // Another feed may own a portal load with this external ID; don't cancel it
  // just because no matching TAI shipment was found.
  if (!row) return null;
  if (row.status === "Cancelled") return "cancelled";
  if (row.status === "Delivered") return "delivered";
  if (row.status === "Dispatched") return "in_transit";
  if (row.carrier_name) return "booked";
  return null;
}

async function runSync(window: PickupWindow) {
  const main = createLoadsAdminClient();
  const portal = createAdminClient();
  const now = new Date().toISOString();

  const shipments = await allPortalRows<OpenShipment>((afterId) => {
    const query = main
      .from("shipments")
      .select(COLUMNS, { count: "exact" })
      .in("status", ["Committed", "Quote"])
      // TAI writes uncovered shipments with an empty carrier string rather than null.
      .or("carrier_name.is.null,carrier_name.eq.")
      .gte("ship_date", window.from)
      .lt("ship_date", window.until)
      .order("id", { ascending: true })
      .limit(PORTAL_PAGE_SIZE);
    return afterId == null ? query : query.gt("id", afterId);
  });
  const open = shipments.filter(
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

  // Take loads off the board once TAI shows them covered or cancelled.
  const openIds = new Set(rows.map((r) => r.external_id));
  const posted = await allPortalRows<{ id: string; external_id: string }>((afterId) => {
    const query = portal
      .from("fn_loads")
      .select("id,external_id", { count: "exact" })
      .eq("status", "available")
      .is("reserved_by", null)
      .gte("pickup_date", window.from)
      .lte("pickup_date", window.through)
      .order("id", { ascending: true })
      .limit(PORTAL_PAGE_SIZE);
    return afterId == null ? query : query.gt("id", afterId);
  });
  const stale = posted
    .map((p) => p.external_id)
    .filter((id) => !openIds.has(id));
  for (let i = 0; i < stale.length; i += 200) {
    const batch = stale.slice(i, i + 200);
    const { data: current, error } = await main.from("shipments").select(COLUMNS).in("shipment_id", batch);
    if (error) throw new Error(`Shipment status read failed: ${error.message}`);
    const byId = new Map(
      ((current ?? []) as OpenShipment[]).map((r) => [String(r.shipment_id), r]),
    );
    for (const id of batch) {
      const status = closedStatus(byId.get(id));
      if (!status) continue;
      const { error: updateError } = await portal
        .from("fn_loads")
        .update({ status, updated_at: now })
        .eq("external_id", id)
        .eq("status", "available");
      if (updateError) throw new Error(`Load status update failed: ${updateError.message}`);
    }
  }
  return written;
}

/** Pulls uncovered TAI shipments (Committed + Quote) onto the carrier board on demand. */
export async function syncOpenLoads({ window, force = false }: { window: PickupWindow; force?: boolean }) {
  const key = `${window.from}:${window.through}`;
  const active = running.get(key);
  if (active) return active;
  const wait = force ? FORCED_MIN_INTERVAL_MS : MIN_INTERVAL_MS;
  if (Date.now() - (lastRun.get(key) || 0) < wait) return 0;
  const task = runSync(window)
    .catch((error) => {
      console.error("Open load sync failed", error instanceof Error ? error.message : error);
      throw new PortalProblem("The load board could not be refreshed. Please try again.", 503);
    })
    .then((count) => {
      lastRun.set(key, Date.now());
      return count;
    })
    .finally(() => {
      running.delete(key);
    });
  running.set(key, task);
  return task;
}
