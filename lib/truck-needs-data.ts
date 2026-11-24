import "server-only";
import { centralToday } from "@/lib/portal-contract";
import { allPortalRows, PORTAL_PAGE_SIZE } from "@/lib/portal-pages";
import { createLoadsAdminClient } from "@/lib/supabase/loads-admin";
import { addDays, buildTruckNeeds, TRUCK_NEEDS_DAYS, type TruckNeedRow, type TruckNeeds } from "@/lib/truck-needs";

// No rate, weight, load number or note columns. `id` is only the paging cursor
// and customer_name is read only so hidden customers can be left out;
// buildTruckNeeds returns neither.
const COLUMNS = "id,status,carrier_name,customer_name,from_city,from_state,to_city,to_state,ship_date,equipment_type";

/**
 * Open pickups for the public Carriers page. Returns null when the operations
 * database is not configured or cannot be read, so the page hides the section
 * instead of failing.
 */
export async function getTruckNeeds(today = centralToday()): Promise<TruckNeeds | null> {
  let readError = "";
  try {
    const client = createLoadsAdminClient();
    const until = addDays(today, TRUCK_NEEDS_DAYS);
    // Page by id so a response cap can never silently understate the counts.
    const rows = await allPortalRows<TruckNeedRow & { id: string | number }>(async (afterId) => {
      const query = client
        .from("shipments")
        .select(COLUMNS, { count: "exact" })
        .eq("status", "Committed")
        // TAI writes uncovered shipments with an empty carrier string rather than null.
        .or("carrier_name.is.null,carrier_name.eq.")
        // ship_date is text; ISO dates compare correctly as strings.
        .gte("ship_date", today)
        .lt("ship_date", until)
        .order("id", { ascending: true })
        .limit(PORTAL_PAGE_SIZE);
      const response = await (afterId == null ? query : query.gt("id", afterId));
      // The paging helper replaces the database's reason with a generic one; keep it for the log.
      if (response.error) readError = response.error.message;
      return response;
    });
    return buildTruckNeeds(rows, today);
  } catch (error) {
    // The reason names the failure only; it never holds shipment data or keys.
    console.error("Truck needs could not be read:", readError || (error instanceof Error ? error.message : "unknown error"));
    return null;
  }
}
