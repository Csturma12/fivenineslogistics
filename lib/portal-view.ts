import type { PortalRole } from "./portal-contract";

/** A staff view selection is read access, never a change of the saved role. */
export function portalView({
  staff,
  profileRole,
  requestedRole,
}: {
  staff: boolean;
  profileRole?: PortalRole | null;
  requestedRole?: string | null;
}) {
  const role = staff && (requestedRole === "carrier" || requestedRole === "customer")
    ? requestedRole
    : profileRole;
  return { role, readOnly: !!profileRole && role !== profileRole };
}
