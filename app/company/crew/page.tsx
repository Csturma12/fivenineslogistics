import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RequestCapacityButton } from "@/components/request-capacity-trigger"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Meet the Crew | Five Nines Logistics",
  description:
    "The people behind Five Nines Logistics: plant-floor experience applied to critical freight planning and dispatch.",
}

const roles = [
  {
    title: "Dispatch & operations",
    body: "Team profiles are being added. This section will introduce the people who plan, dispatch and follow your freight through delivery.",
  },
  {
    title: "Drivers & carrier partners",
    body: "Featured with permission. Affiliated drivers and independent carriers will be identified as partners, separate from Five Nines team members.",
  },
]

export default function CrewPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero-grid border-b border-border" data-hero="company">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">Our team</span>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Meet the crew.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              A small team that knows both sides of the delivery: the work inside the facility and the freight
              that supports it.
            </p>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_2fr]">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-primary">Founder</span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Chris</h2>
              <p className="mt-2 text-muted-foreground">Five Nines Logistics</p>
            </div>
            <div className="flex flex-col gap-5 text-lg leading-relaxed text-muted-foreground">
              <p>
                Chris spent about ten years in plant maintenance, specializing in refractory work, before
                spending about ten more coordinating logistics across North America.
              </p>
              <p>
                That time on the plant floor shapes how Five Nines plans freight. A delivery is part of a
                larger schedule, and the crew on site is waiting on it. We plan each move around site access,
                equipment and the install window, and we keep the customer informed until it is complete.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-2">
            {roles.map((role) => (
              <div key={role.title} className="rounded-xl border border-border bg-card p-6 sm:p-8">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">{role.title}</h2>
                <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{role.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6 sm:py-20 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Work with the team.</h2>
              <p className="mt-2 text-muted-foreground">
                Shippers can request capacity. Carriers can{" "}
                <Link href="/carriers" className="text-primary underline underline-offset-4">
                  apply to haul with us
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <RequestCapacityButton size="lg" className="font-medium">
                Request Capacity
                <ArrowRight className="size-4" data-icon="inline-end" />
              </RequestCapacityButton>
              <Button
                render={<Link href={site.phoneHref} />}
                nativeButton={false}
                size="lg"
                variant="outline"
                className="font-medium"
              >
                <Phone className="size-4" data-icon="inline-start" />
                {site.phone}
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
