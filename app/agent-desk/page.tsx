import { SiteHeader } from "@/components/site-header";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { PortalWorkspace } from "@/components/portal/workspace";
import { PortalSignIn } from "@/components/portal/portal-access";
import { SignOutButton } from "@/components/portal/sign-out-button";
import { portalIdentity } from "@/lib/portal-service";
import { PortalProblem } from "@/lib/portal-contract";
import { canUsePortalSamples } from "@/lib/portal-sample-access";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Agent desk — Five Nines Logistics",
  robots: { index: false, follow: false },
};
export default async function AgentDeskPage() {
  let identity: Awaited<ReturnType<typeof portalIdentity>> | null = null;
  try {
    identity = await portalIdentity();
  } catch (error) {
    if (!(error instanceof PortalProblem) || error.status !== 401) throw error;
  }
  return (
    <main>
      <SiteHeader />
      {canUsePortalSamples(identity) ? (
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <Link className="text-sm font-medium text-primary underline underline-offset-4" href="/portal/test">Test carrier and customer portals with sample data →</Link>
        </div>
      ) : null}
      {identity?.staff ? <PortalWorkspace desk /> : (
        <section className="border-t border-border bg-grid-technical">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
            <p className="font-mono text-xs uppercase tracking-wider text-primary">Five Nines · Team access</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {identity ? "Agent desk access restricted" : "Agent desk sign in"}
            </h1>
            <p className="mt-3 mb-8 max-w-2xl text-base leading-7 text-muted-foreground">
              Only signed-in users with a verified @shipfivenines.com email can access the agent desk.
            </p>
            {identity ? (
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="mb-5 text-sm text-muted-foreground">
                  You are signed in as {identity.user.email}. Sign out and use your Five Nines work account.
                </p>
                <SignOutButton redirectTo="/agent-desk" />
              </div>
            ) : <PortalSignIn role="staff" />}
          </div>
        </section>
      )}
      <SiteFooter />
    </main>
  );
}
