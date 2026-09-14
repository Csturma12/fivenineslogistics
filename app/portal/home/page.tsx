import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PortalDashboardPreview } from "@/components/portal/portal-access"
import { SignOutButton } from "@/components/portal/sign-out-button"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Your control tower — Five Nines Logistics",
}

export default async function PortalHomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/portal")
  }

  const role = (user.user_metadata?.role as string) ?? "customer"

  return (
    <main>
      <SiteHeader />
      <section className="border-t border-border bg-grid-technical">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-[color:var(--status-ok)]"
                  aria-hidden="true"
                />
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Signed in · {role}
                </span>
              </div>
              <h1 className="mt-5 text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
                Welcome back to the control tower.
              </h1>
              <p className="mt-3 truncate text-sm leading-relaxed text-muted-foreground">
                {user.email}
              </p>
            </div>
            <SignOutButton />
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
