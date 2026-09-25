import type { verifiedPortalIdentity } from "./portal-access-policy";

const AUTH_DESTINATIONS = new Set([
  "/portal/home",
  "/portal",
  "/portal/customer",
  "/portal/carrier",
  "/portal/reset-password",
  "/agent-desk",
]);

/** Auth links may choose an app destination, never an arbitrary redirect URL. */
export function authRedirectPath(next: string | null | undefined): string {
  return next && AUTH_DESTINATIONS.has(next) ? next : "/portal/home";
}

/** Receives only the identity verified by the shared server auth policy. */
export function portalHomeDestination(
  identity: ReturnType<typeof verifiedPortalIdentity>,
  profileRole?: string | null,
): "/agent-desk" | "/portal/customer" | "/portal" {
  if (identity.staff) return "/agent-desk";
  return (profileRole || identity.user.app_metadata?.role) === "customer"
    ? "/portal/customer"
    : "/portal";
}
