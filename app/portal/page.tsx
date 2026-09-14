import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PortalSignIn, PortalDashboardPreview } from "@/components/portal/portal-access"

export const metadata: Metadata = {
  title: "Portal — Five Nines Logistics",
  description:
    "One login for customers and carriers. Track loads, pull documents, and settle — the same control tower that runs your freight, on your screen.",
}

export default function PortalPage() {
  return (
    <main>
      <SiteHeader />
      <section className="border-t border-border bg-grid-technical">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[color:var(--status-ok)]"
                aria-hidden="true"
              />
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Portal · one door, two roles
              </span>
            </div>
            <h1 className="mt-6 text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Sign in to the control tower.
            </h1>
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
              Customers track live loads, pull documents, and read a monthly scorecard. Carriers see
              offered freight, accept loads, and watch settlements. One login, the same five-nines
              standard behind it.
            </p>
          </div>

          <div className="mt-10">
            <PortalSignIn />
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Inside the portal
            </span>
            <h2 className="mt-3 text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
              A preview of what you&apos;ll see after you log in.
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
              Green means on plan. Amber means we&apos;re watching it. Red is reserved for a genuine
              exception — the same signals the control tower runs on.
            </p>
          </div>

          <div className="mt-10">
            <PortalDashboardPreview />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
