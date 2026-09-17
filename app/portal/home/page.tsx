import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CustomerHome } from "@/components/portal/customer-home"
import { CarrierHome } from "@/components/portal/carrier-home"
import { SignOutButton } from "@/components/portal/sign-out-button"
import { LoadBoard } from "@/components/loads/load-board"
import { createClient } from "@/lib/supabase/server"
import { getAvailableLoads, getLoadsBookedBy } from "@/lib/loads"

export const metadata: Metadata = {
  title: "Approved portal access — Five Nines Logistics",
}

export default async function PortalHomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/portal")
  }

  const role = user.app_metadata?.role === "carrier" ? "carrier" : "customer"
  const company =
    (typeof user.app_metadata?.company === "string" && user.app_metadata.company.trim()) ||
    (role === "carrier" ? "Your authority" : "Your account")

  const [availableLoads, bookedLoads] =
    role === "carrier"
      ? await Promise.all([getAvailableLoads(), getLoadsBookedBy(user.email ?? "")])
      : [[], []]

  return (
    <main>
      <SiteHeader />
      <section className="border-t border-border bg-grid-technical">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--status-ok)]" aria-hidden="true" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Approved · {role} access
                </span>
              </div>
              <h1 className="mt-5 text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
                {role === "carrier" ? "Carrier connection" : "Customer connection"}
              </h1>
              <p className="mt-3 break-all text-sm leading-relaxed text-muted-foreground">
                Signed in as {user.email}
              </p>
            </div>
            <SignOutButton />
          </div>

          <div className="mt-10">
            {role === "carrier" ? <CarrierHome company={company} /> : <CustomerHome company={company} />}
          </div>

          {role === "carrier" ? (
            <div className="mt-14 flex flex-col gap-10">
              <div>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
                      Load board
                    </span>
                    <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight text-foreground">
                      Open freight — book it now
                    </h2>
                    <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
                      Approved access lets you book directly. Booking a load notifies dispatch and
                      removes it from the board immediately.
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <LoadBoard loads={availableLoads} mode="carrier" />
                </div>
              </div>

              {bookedLoads.length > 0 ? (
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    Your booked loads
                  </span>
                  <div className="mt-4 grid gap-px overflow-hidden rounded-xl border border-border bg-border">
                    {bookedLoads.map((load) => (
                      <div
                        key={load.id}
                        className="flex flex-wrap items-center justify-between gap-3 bg-card p-5"
                      >
                        <div className="min-w-0">
                          <p className="font-mono text-[11px] uppercase tracking-wider text-primary">
                            {load.reference || load.external_id || "Load"}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-foreground">
                            {[load.origin_city, load.origin_state].filter(Boolean).join(", ") || "Origin"} →{" "}
                            {[load.dest_city, load.dest_state].filter(Boolean).join(", ") || "Destination"}
                          </p>
                        </div>
                        <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          {load.status.replace("_", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
