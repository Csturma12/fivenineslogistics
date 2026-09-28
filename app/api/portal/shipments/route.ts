import { PortalProblem } from "@/lib/portal-contract";
import { failure, portalIdentity, profileFor } from "@/lib/portal-service";
import {
  carrierNamesForEmail,
  listCustomerNames,
  queryShipments,
  resolveCustomerName,
  type ReferenceType,
  type ShipmentScope,
} from "@/lib/portal-shipments";

export const dynamic = "force-dynamic";

const REF_TYPES: ReferenceType[] = ["any", "po", "load"];

export async function GET(request: Request) {
  try {
    const { user, staff } = await portalIdentity();
    const params = new URL(request.url).searchParams;
    const profile = await profileFor(user.id);
    if (!staff && !profile) throw new PortalProblem("Set up your portal profile first.", 403);
    if (!staff && profile?.status === "suspended")
      throw new PortalProblem("Your account is paused. Contact dispatch.", 403);

    // Staff may preview either role; everyone else is pinned to their own profile role.
    const requested = params.get("role");
    const role =
      staff && (requested === "carrier" || requested === "customer") ? requested : profile?.role;

    let scope: ShipmentScope | null = null;
    let notice = "";
    if (staff) {
      scope =
        role === "carrier"
          ? { kind: "all" }
          : { kind: "all", customer: params.get("customer")?.slice(0, 120) || undefined };
    } else if (profile?.status !== "approved") {
      notice = "Your shipments appear here once dispatch approves your account.";
    } else if (role === "customer") {
      const name = await resolveCustomerName(String(profile.customer_account_id || ""));
      if (name) scope = { kind: "customer", customer: name };
      else notice = "Your account is not linked to a TAI customer yet. Contact your coordinator.";
    } else if (role === "carrier") {
      const carriers = await carrierNamesForEmail(user.email || "");
      if (carriers.length) scope = { kind: "carrier", carriers };
      else notice = "No carrier record matches your login email yet. Contact dispatch.";
    }

    const refType = REF_TYPES.includes(params.get("refType") as ReferenceType)
      ? (params.get("refType") as ReferenceType)
      : "any";
    const [shipments, customers] = await Promise.all([
      scope
        ? queryShipments(scope, {
            from: params.get("from") || undefined,
            to: params.get("to") || undefined,
            refType,
            ref: params.get("ref") || undefined,
          })
        : Promise.resolve([]),
      staff && role !== "carrier" ? listCustomerNames() : Promise.resolve(undefined),
    ]);

    return Response.json(
      { shipments, customers, notice, showCustomer: role !== "carrier" },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (e) {
    if (!(e instanceof PortalProblem)) console.error("portal shipments failed:", e);
    return failure(e);
  }
}
