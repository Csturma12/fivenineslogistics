import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PortalWorkspace } from "@/components/portal/workspace";
import { portalIdentity } from "@/lib/portal-service";
import { PortalProblem } from "@/lib/portal-contract";
import { canUsePortalSamples, portalSampleView } from "@/lib/portal-sample-access";
import { samplePortalWorkspace } from "@/lib/portal-sample-data";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Portal test views — Five Nines Logistics",
  robots: { index: false, follow: false },
};

export default async function PortalTest({ searchParams }: {
  searchParams: Promise<{ view?: string }>;
}) {
  let identity: Awaited<ReturnType<typeof portalIdentity>>;
  try {
    identity = await portalIdentity();
  } catch (error) {
    if (!(error instanceof PortalProblem) || error.status !== 401) throw error;
    redirect("/agent-desk");
  }
  if (!canUsePortalSamples(identity)) notFound();
  const view = portalSampleView((await searchParams).view);
  return (
    <main>
      <SiteHeader />
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-xl font-semibold">Your portal test views</h1>
            <Link className="text-sm text-primary underline underline-offset-4" href="/agent-desk">Return to agent desk</Link>
          </div>
          <p className="mb-5 text-sm text-muted-foreground">Explore both portal experiences with sample data. Your real account and onboarding profile stay unchanged.</p>
          <nav className="flex flex-wrap gap-3" aria-label="Sample portal view">
            {([["setup", "Carrier setup"], ["carrier", "Carrier load board"], ["customer", "Customer portal"]] as const).map(([value, label]) => (
              <Link key={value} href={`/portal/test?view=${value}`} aria-current={view === value ? "page" : undefined}
                className={`rounded-lg border px-4 py-3 text-sm font-medium ${view === value ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </section>
      <PortalWorkspace key={view} previewData={samplePortalWorkspace(view)} />
      <SiteFooter />
    </main>
  );
}
