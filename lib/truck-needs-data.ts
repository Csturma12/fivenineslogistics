import "server-only";
import { centralToday } from "@/lib/portal-contract";
import { createLoadsAdminClient } from "@/lib/supabase/loads-admin";
import { addDays, buildTruckNeeds, TRUCK_NEEDS_DAYS, type TruckNeedRow, type TruckNeeds } from "@/lib/truck-needs";

// No rate, weight, load number or note columns. customer_name is read only so
// hidden customers can be left out; buildTruckNeeds never returns it.
const COLUMNS = "status,carrier_name,customer_name,from_city,from_state,to_city,to_state,ship_date,equipment_type";

/**
 * Open pickups for the public Carriers page. Returns null when the operations
 * database is not configured or cannot be read, so the page hides the section
 * instead of failing.
 */
export async function getTruckNeeds(today = centralToday()): Promise<TruckNeeds | null> {
  try {
    const { data, error } = await createLoadsAdminClient()
      .from("shipments")
      .select(COLUMNS)
      .eq("status", "Committed")
      // TAI writes uncovered shipments with an empty carrier string rather than null.
      .or("carrier_name.is.null,carrier_name.eq.")
      // ship_date is text; ISO dates compare correctly as strings.
      .gte("ship_date", today)
      .lt("ship_date", addDays(today, TRUCK_NEEDS_DAYS))
      .limit(1000);
    if (error) return null;
    return buildTruckNeeds((data ?? []) as TruckNeedRow[], today);
  } catch {
    return null;
  }
}
