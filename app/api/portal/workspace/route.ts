import { after } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  carrierLoad,
  centralToday,
  money,
  profileDetails,
  setupMissing,
  safeHighwayUrl,
  text,
  uuid,
  calendarDate,
  PortalProblem,
} from "@/lib/portal-contract";
import {
  failure,
  flushNotifications,
  portalIdentity,
  profileFor,
  requireProfile,
  result,
  sameOrigin,
} from "@/lib/portal-service";

export const dynamic = "force-dynamic";
const LOAD_FIELDS =
  "id,status,origin_city,origin_state,dest_city,dest_state,pickup_date,delivery_date,equipment,weight_lbs,dimensions,auto_book,carrier_offer_usd";
export async function GET(request: Request) {
  try {
    const { user, staff } = await portalIdentity();
    const db = createAdminClient();
    const profile = await profileFor(user.id);
    const desk = new URL(request.url).searchParams.get("desk") === "1";
    if (desk && !staff)
      throw new PortalProblem("Agent desk access required.", 403);
    const companyDocuments =
      result(
        await db.from("fn_company_documents").select("id,title").order("title"),
      ) || [];
    const base = {
      email: user.email,
      staff,
      profile,
      hint: user.app_metadata?.role || "",
      company: user.app_metadata?.company || "",
      companyDocuments,
      highwayUrl: safeHighwayUrl(process.env.HIGHWAY_SETUP_URL),
      documents: [],
      loads: [],
      bids: [],
      requests: [],
      bookings: [],
    };
    if (desk) {
      const [
        profiles,
        documents,
        bids,
        bookings,
        requests,
        notifications,
        loads,
      ] = await Promise.all([
        db
          .from("fn_profiles")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(200),
        db
          .from("fn_documents")
          .select("id,user_id,kind,name,created_at")
          .order("created_at", { ascending: false })
          .limit(1000),
        db
          .from("fn_bids")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(200),
        db
          .from("fn_bookings")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(200),
        db
          .from("fn_requests")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(200),
        db
          .from("fn_notifications")
          .select("id,subject,last_error")
          .is("sent_at", null)
          .order("created_at")
          .limit(100),
        db
          .from("fn_loads")
          .select(`${LOAD_FIELDS},external_id`)
          .order("updated_at", { ascending: false })
          .limit(200),
      ]);
      return Response.json(
        {
          ...base,
          profiles: result(profiles),
          documents: result(documents),
          bids: result(bids),
          bookings: result(bookings),
          requests: result(requests),
          notifications: result(notifications),
          loads: result(loads),
        },
        { headers: { "Cache-Control": "private, no-store" } },
      );
    }
    if (!profile)
      return Response.json(base, {
        headers: { "Cache-Control": "private, no-store" },
      });
    if (profile.status === "suspended")
      throw new PortalProblem("Your account is paused. Contact dispatch.", 403);
    const documents =
      result(
        await db
          .from("fn_documents")
          .select("id,kind,name,created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ) || [];
    const requests =
      result(
        await db
          .from("fn_requests")
          .select("id,kind,status,details,load_id")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(200),
      ) || [];
    if (profile.role === "carrier") {
      const bids =
        result(
          await db
            .from("fn_bids")
            .select("*")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false })
            .limit(200),
        ) || [];
      const bookings =
        result(
          await db
            .from("fn_bookings")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(200),
        ) || [];
      const historyIds = [
        ...new Set([...bids, ...bookings].map((row) => row.load_id)),
      ];
      const historyRows = historyIds.length
        ? result(
            await db.from("fn_loads").select(LOAD_FIELDS).in("id", historyIds),
          ) || []
        : [];
      const historyLoads = historyRows.map((row) =>
        carrierLoad({ ...row, auto_book: false, carrier_offer_usd: null }),
      );
      let loads: ReturnType<typeof carrierLoad>[] = [];
      if (
        profile.status === "approved" &&
        profile.highway_status === "verified" &&
        setupMissing(profile, documents, centralToday()).length === 0
      ) {
        const rows =
          result(
            await db
              .from("fn_loads")
              .select(LOAD_FIELDS)
              .eq("status", "available")
              .is("reserved_by", null)
              .gte("updated_at", new Date(Date.now() - 86400000).toISOString())
              .or(`pickup_date.is.null,pickup_date.gte.${centralToday()}`)
              .order("pickup_date", { ascending: true })
              .limit(200),
          ) || [];
        loads = rows.map(carrierLoad);
      }
      return Response.json(
        { ...base, documents, requests, bids, bookings, loads, historyLoads },
        { headers: { "Cache-Control": "private, no-store" } },
      );
    }
    const rows =
      profile.status === "approved" && profile.customer_account_id
        ? result(
            await db
              .from("fn_loads")
              .select(`${LOAD_FIELDS},tracking_location,tracking_at`)
              .eq("customer_account_id", profile.customer_account_id)
              .order("pickup_date", { ascending: false })
              .limit(200),
          ) || []
        : [];
    const loads = rows.map((row) => ({
      ...carrierLoad({ ...row, auto_book: false, carrier_offer_usd: null }),
      tracking_location: row.tracking_location,
      tracking_at: row.tracking_at,
    }));
    return Response.json(
      { ...base, documents, requests, loads },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (e) {
    return failure(e);
  }
}
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const { user, staff } = await portalIdentity();
    const db = createAdminClient();
    const raw = await request.text();
    if (raw.length > 15000) throw new PortalProblem("Request too large.", 413);
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      throw new PortalProblem("Invalid request.");
    }
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new PortalProblem("Invalid request.");
    const action = body.action;
    if (action === "initialize") {
      if (!["carrier", "customer"].includes(body.role))
        throw new PortalProblem("Choose a portal.");
      result(
        await db
          .from("fn_profiles")
          .upsert(
            {
              user_id: user.id,
              email: user.email,
              role: body.role,
              company: text(body.company || ""),
            },
            { onConflict: "user_id", ignoreDuplicates: true },
          ),
      );
    } else if (action === "save_profile") {
      const profile = await requireProfile(user.id);
      const company = text(body.company);
      const details = profileDetails(body.details);
      if (body.submit === true) {
        const docs =
          result(
            await db
              .from("fn_documents")
              .select("id,kind")
              .eq("user_id", user.id),
          ) || [];
        const missing = setupMissing(
          { ...profile, company, details },
          docs,
          centralToday(),
        );
        if (missing.length)
          throw new PortalProblem(`Please complete: ${missing.join(", ")}.`);
      }
      result(
        await db.rpc("fn_save_profile", {
          p_user: user.id,
          p_company: company,
          p_details: details,
          p_submit: body.submit === true,
        }),
      );
    } else if (
      [
        "submit",
        "auto_book",
        "accept_counter",
        "accept",
        "deny",
        "counter",
      ].includes(action)
    ) {
      const isStaffAction = ["accept", "deny", "counter"].includes(action);
      if (isStaffAction && !staff)
        throw new PortalProblem("Agent desk access required.", 403);
      if (!isStaffAction) {
        const p = await requireProfile(user.id, "carrier");
        const docs =
          result(
            await db
              .from("fn_documents")
              .select("id,kind")
              .eq("user_id", user.id),
          ) || [];
        if (
          p.status !== "approved" ||
          p.highway_status !== "verified" ||
          setupMissing(p, docs, centralToday()).length
        )
          throw new PortalProblem(
            "Complete approved carrier setup before bidding or booking.",
            403,
          );
      }
      result(
        await db.rpc("fn_bid_action", {
          p_actor: user.id,
          p_staff: staff,
          p_action: action,
          p_load: uuid(body.loadId),
          p_amount: ["submit", "auto_book", "counter"].includes(action)
            ? money(body.amount)
            : null,
          p_note: text(body.note || "", 1000),
          p_bid: body.bidId ? uuid(body.bidId) : null,
          p_version: Number.isInteger(body.version) ? body.version : null,
        }),
      );
    } else if (action === "customer_request") {
      await requireProfile(user.id, "customer");
      if (!["load", "pod", "invoice"].includes(body.kind))
        throw new PortalProblem("Choose a request type.");
      const details: Record<string, string> = {};
      if (body.kind === "load") {
        for (const key of [
          "origin",
          "destination",
          "equipment",
          "weight",
          "dimensions",
          "notes",
        ])
          details[key] = text(body.details?.[key] || "", 1000);
        details.pickup_date = calendarDate(body.details?.pickup_date, true);
        details.delivery_date = calendarDate(body.details?.delivery_date);
        if (!details.origin || !details.destination || !details.equipment)
          throw new PortalProblem("Enter origin, destination and equipment.");
        if (
          details.delivery_date &&
          details.delivery_date < details.pickup_date
        )
          throw new PortalProblem("Delivery cannot be before pickup.");
      }
      result(
        await db.rpc("fn_customer_request", {
          p_user: user.id,
          p_kind: body.kind,
          p_load: body.kind === "load" ? null : uuid(body.loadId),
          p_details: details,
        }),
      );
    } else if (action === "review_profile") {
      if (!staff) throw new PortalProblem("Agent desk access required.", 403);
      const p = await profileFor(uuid(body.userId));
      const status = text(body.status);
      if (!p) throw new PortalProblem("Profile not found.", 404);
      if (!["approved", "changes_requested", "suspended"].includes(status))
        throw new PortalProblem("Choose a review outcome.");
      const highway = ["awaiting_invitation", "invited", "verified"].includes(
        body.highway,
      )
        ? body.highway
        : p.highway_status;
      const account = text(body.accountId || "", 120);
      if (status === "approved") {
        const docs =
          result(
            await db
              .from("fn_documents")
              .select("id,kind")
              .eq("user_id", p.user_id),
          ) || [];
        const missing = setupMissing(p, docs, centralToday());
        if (p.role === "carrier" && highway !== "verified")
          missing.push("Highway verification");
        if (p.role === "customer" && !account)
          missing.push("Verified TAI customer account ID");
        if (missing.length)
          throw new PortalProblem(`Approval needs: ${missing.join(", ")}.`);
      }
      const updated = result(
        await db
          .from("fn_profiles")
          .update({
            status,
            highway_status: highway,
            customer_account_id: p.role === "customer" ? account || null : null,
            review_note: text(body.note || "", 1000),
            version: p.version + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", p.user_id)
          .eq("version", body.version)
          .select("user_id"),
      );
      if (!updated?.length)
        throw new PortalProblem(
          "Profile changed. Refresh before reviewing.",
          409,
        );
    } else if (action === "complete_request") {
      if (!staff) throw new PortalProblem("Agent desk access required.", 403);
      result(
        await db
          .from("fn_requests")
          .update({ status: "completed" })
          .eq("id", uuid(body.id)),
      );
    } else if (action === "retry_notifications") {
      if (!staff) throw new PortalProblem("Agent desk access required.", 403);
    } else throw new PortalProblem("Unknown action.");
    after(flushNotifications);
    return Response.json({
      ok: true,
      message: "Saved. Notifications are queued for delivery.",
    });
  } catch (e) {
    return failure(e);
  }
}
