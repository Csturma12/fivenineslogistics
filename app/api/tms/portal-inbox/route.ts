import { after } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireBridgeToken } from "@/lib/portal-bridge-auth";
import { failure, flushNotifications, result } from "@/lib/portal-service";
import { PortalProblem } from "@/lib/portal-contract";

export const dynamic = "force-dynamic";
// Agent Desk server only; never accepted as carrier authentication. No documents,
// bank/tax data, or browser credentials cross this connection.
export async function GET(request: Request) {
  try {
    requireBridgeToken(request, process.env.TMS_INGEST_TOKEN);
    const db = createAdminClient();
    const [bids, bookings, reviews, notifications] = await Promise.all([
      db.from("fn_bids").select("id,amount,status,updated_at,fn_loads(external_id,origin_city,origin_state,dest_city,dest_state),fn_profiles(company)")
        .in("status", ["submitted", "countered"]).order("updated_at", { ascending: false }).limit(50),
      db.from("fn_bookings").select("id,amount,status,created_at,fn_loads(external_id,origin_city,origin_state,dest_city,dest_state),fn_profiles(company)")
        .eq("status", "awaiting_dispatch").order("created_at", { ascending: false }).limit(50),
      db.from("fn_profiles").select("user_id", { count: "exact", head: true }).eq("status", "submitted"),
      db.from("fn_notifications").select("id", { count: "exact", head: true }).is("sent_at", null),
    ]);
    result(reviews); result(notifications);
    return Response.json({ bids: result(bids), bookings: result(bookings),
      pendingReviews: reviews.count || 0, pendingEmails: notifications.count || 0,
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) { return failure(error); }
}

export async function POST(request: Request) {
  try {
    requireBridgeToken(request, process.env.TMS_INGEST_TOKEN);
    const raw = await request.text();
    if (raw.length > 1000) throw new PortalProblem("Request too large.", 413);
    let body;
    try { body = JSON.parse(raw); } catch { throw new PortalProblem("Invalid JSON."); }
    if (body?.action !== "retry_notifications") throw new PortalProblem("Unknown bridge action.");
    after(flushNotifications);
    return Response.json({ queued: true }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) { return failure(error); }
}
