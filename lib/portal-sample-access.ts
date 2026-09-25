import type { verifiedPortalIdentity } from "./portal-access-policy";

/** Receives only the result of the shared server-side verified identity check. */
export function canUsePortalSamples(identity: ReturnType<typeof verifiedPortalIdentity> | null): boolean {
  return !!identity && identity.user.email?.toLowerCase() === "chris@shipfivenines.com";
}

export type PortalSampleView = "setup" | "carrier" | "customer";

export function portalSampleView(value?: string): PortalSampleView {
  return value === "carrier" || value === "customer" ? value : "setup";
}
