import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { portalIdentity, profileFor } from "@/lib/portal-service";
import { PortalProblem, type PortalRole } from "@/lib/portal-contract";
import { canUsePortalSamples } from "@/lib/portal-sample-access";
import { PortalSignIn } from "./portal-access";
import { PortalWorkspace } from "./workspace";

export async function PortalEntry({ role }: { role: PortalRole }) {
  let identity: Awaited<ReturnType<typeof portalIdentity>> | null = null;
  try {
    identity = await portalIdentity();
  } catch (error) {
    if (!(error instanceof PortalProblem) || error.status !== 401) throw error;
  }
  // Match the API's verified-session policy before mounting its workspace.
  // An unconfirmed or anonymous cookie must show sign-in instead of looping
  // between the workspace's 401 redirect and this same page.
  const user = identity?.user;
  // Persisted onboarding role wins over a URL or a legacy account-view hint.
  const profile = user ? await profileFor(user.id) : null;
  const accountRole = profile?.role || user?.app_metadata?.role;
  // Staff-domain users may open either portal, so skip the single-role redirect
  // for them while carrier onboarding paperwork is being finalized.
  const staff = isPortalStaff(user?.email);
  if (user && !staff && accountRole === "customer" && role === "carrier") redirect("/portal/customer");
  if (user && !staff && accountRole === "carrier" && role === "customer") redirect("/portal");

  return (
    <main>
      <SiteHeader />
      {canUsePortalSamples(identity) ? (
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <Link className="text-sm font-medium text-primary underline underline-offset-4" href="/portal/test">Test carrier and customer portals with sample data →</Link>
        </div>
      ) : null}
      {user ? <PortalWorkspace initialRole={role} /> : (
        <section className="border-t border-border bg-grid-technical">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
            <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-primary">Ship Five Nines · Secure access</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {role === "carrier" ? "Carrier portal" : "Customer portal"}
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
                  {role === "carrier"
                    ? "Complete your setup, find available lanes and send your bid to dispatch. Load-board access opens after approval."
                    : "Request capacity, access company documents and follow shipments linked to your verified account."}
                </p>
              </div>
              <Link className="text-sm font-medium text-primary underline underline-offset-4" href={role === "carrier" ? "/portal/customer" : "/portal"}>
                {role === "carrier" ? "Looking for the customer portal?" : "Looking for the carrier portal?"}
              </Link>
            </div>
            <PortalSignIn role={role} />
          </div>
        </section>
      )}
      <SiteFooter />
    </main>
  );
}
