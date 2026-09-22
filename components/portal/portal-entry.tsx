import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { createClient } from "@/lib/supabase/server";
import { profileFor } from "@/lib/portal-service";
import type { PortalRole } from "@/lib/portal-contract";
import { PortalSignIn } from "./portal-access";
import { PortalWorkspace } from "./workspace";

export async function PortalEntry({ role }: { role: PortalRole }) {
  const { data: { user } } = await (await createClient()).auth.getUser();
  // Persisted onboarding role wins over a URL or a legacy account-view hint.
  const profile = user ? await profileFor(user.id) : null;
  const accountRole = profile?.role || user?.app_metadata?.role;
  if (user && accountRole === "customer" && role === "carrier") redirect("/portal/customer");
  if (user && accountRole === "carrier" && role === "customer") redirect("/portal");

  return (
    <main>
      <SiteHeader />
      {user ? <PortalWorkspace initialRole={role} /> : (
        <section className="border-t border-border bg-grid-technical">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
            <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-primary">Five Nines · Secure access</p>
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
