import { redirect } from "next/navigation";
import { portalIdentity, profileFor } from "@/lib/portal-service";
import { PortalProblem } from "@/lib/portal-contract";
import { portalHomeDestination } from "@/lib/portal-auth-routing";
export const dynamic = "force-dynamic";
export default async function LegacyPortalHome() {
  let identity: Awaited<ReturnType<typeof portalIdentity>>;
  try {
    identity = await portalIdentity();
  } catch (error) {
    if (!(error instanceof PortalProblem) || error.status !== 401) throw error;
    redirect("/portal");
  }
  // Staff recovery links return here too. Do not require a customer/carrier
  // profile before sending a verified company account back to its desk.
  if (identity.staff) redirect(portalHomeDestination(identity));
  const profile = await profileFor(identity.user.id);
  redirect(portalHomeDestination(identity, profile?.role));
}
