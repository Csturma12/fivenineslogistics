import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  Building2,
  Network,
  ShieldCheck,
  Truck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { RequestCapacityButton } from "@/components/request-capacity-trigger"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Watch Us Grow | Five Nines Logistics",
  description:
    "Follow the Five Nines Logistics roadmap as we build the brand, team, assets, systems, partnerships, and operating footprint behind an experienced freight practice.",
}

const availableNow = [
  {
    icon: ShieldCheck,
    title: "Field-tested experience",
    body: "Our staff includes drivers with 10+ years on the road, foremen and superintendents who have worked in the field, plus a decade of field work in the refractory industry—all behind us from day one.",
  },
  {
    icon: Building2,
    title: "Primary Freight platform",
    body: "Brokerage service operates through Primary Freight LLC, giving Five Nines an established foundation for customer freight.",
  },
  {
    icon: Truck,
    title: "Full-service capacity",
    body: "Owned capacity, affiliated carriers, and a vetted network support truckload, expedited, drayage, LTL, specialized, and final-mile freight.",
  },
  {
    icon: Network,
    title: "Nationwide + global reach",
    body: "Reciprocal relationships extend enterprise transportation, warehousing, and international capabilities to our customers.",
  },
]

const roadmap = [
  {
    status: "Building next",
    title: "Grow the Five Nines book of business",
    body: "Bring more of our existing shipper relationships under the Five Nines name, deepen repeat lanes, and add density where customers already trust us to run freight.",
    items: ["Expand direct shipper base", "Deeper repeat-lane density", "Documented operating playbooks"],
  },
  {
    status: "Building next",
    title: "Strengthen the operating network",
    body: "Formalize the carrier, warehouse, drayage, and specialist relationships that already move our freight every week.",
    items: ["Carrier onboarding", "Partner scorecards", "Hub and facility documentation"],
  },
  {
    status: "Building next",
    title: "Expand the team and systems",
    body: "Add people and tools without losing the direct communication and accountability that define the brand.",
    items: ["Operations personnel", "Customer portal adoption", "Reporting and automation"],
  },
  {
    status: "On the roadmap",
    title: "Grow owned and dedicated equipment",
    body: "Add hotshots, power units, trailers, and dedicated capacity when customer demand supports responsible expansion.",
    items: ["Additional hotshots", "Dedicated fleet growth", "Specialized trailer access"],
  },
  {
    status: "On the roadmap",
    title: "Develop a wider facility footprint",
    body: "Build dependable leased and partner warehouse coverage around customer volume, port activity, and strategic distribution markets.",
    items: ["Leased warehouse space", "Additional operating hubs", "Transload and fulfillment depth"],
  },
  {
    status: "On the roadmap",
    title: "Deepen international and advisory service",
    body: "Expand the partners, technology, and expertise behind customs, global forwarding, supply-chain reporting, and consulting.",
    items: ["Customs and international depth", "Technology upgrades", "Consulting practice"],
  },
]

const measures = [
  { label: "Shipments", value: "Up to 500/wk", note: "Freight we already move every week" },
  { label: "Repeat lanes", value: "Established", note: "Built on relationships that reorder" },
  { label: "Capacity relationships", value: "Established", note: "A decade of industry relationships" },
  { label: "Equipment", value: "Expanding", note: "Added when utilization supports it" },
  { label: "Facilities", value: "Planned", note: "Leased and partner locations" },
  { label: "Team + technology", value: "Building", note: "Scale without losing accountability" },
]

const constants = [
  "A real person accountable for every shipment",
  "Proactive communication before problems become surprises",
  "Capacity matched to the load, not forced into a template",
  "Enterprise execution with better customer service",
]

export default function GrowthPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero-grid border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <p className="font-mono text-xs uppercase tracking-wider text-primary">Watch Us Grow</p>
            <h1 className="mt-4 max-w-5xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
              An established freight practice, entering its next chapter.
            </h1>
            <div className="mt-7 grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
              <p className="max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">
                Five Nines is the next chapter of a ten-year freight career—not a first day in
                logistics. Built by an operations and account manager already overseeing up to 500
                shipments a week, we are moving toward a customer and carrier centered network that
                brings solutions across every aspect of the supply chain. Our staff brings drivers
                with 10+ years on the road, foremen and superintendents from the field, and a decade
                of field work in the refractory industry. This page tracks where we take it next.
              </p>
              <p className="border-l border-primary pl-5 font-mono text-xs uppercase leading-relaxed tracking-wider text-foreground">
                Real customers, real freight, and a decade of relationships already in place. This
                roadmap is where we grow from here—reported as it becomes real.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-primary">Available now</p>
                <h2 className="mt-3 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Ready on day one.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                The Five Nines name is new. The customers, work, relationships, and standards behind it are not.
              </p>
            </div>
            <div className="mt-9 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2">
              {availableNow.map((item) => {
                const Icon = item.icon
                return (
                  <article key={item.title} className="bg-card p-6 sm:p-8">
                    <Icon className="size-5 text-primary" aria-hidden="true" />
                    <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">{item.title}</h3>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-secondary/50">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <p className="font-mono text-xs uppercase tracking-wider text-primary">Public roadmap</p>
            <h2 className="mt-3 max-w-3xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Build in the right order. Report what becomes real.
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              Timing will follow demand, utilization, and the right partnerships. The sequence matters more than a date chosen for marketing.
            </p>
            <div className="mt-10 flex flex-col border-t border-border">
              {roadmap.map((item, index) => (
                <article key={item.title} className="grid gap-5 border-b border-border py-8 lg:grid-cols-[9rem_1fr_0.8fr] lg:gap-10">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-primary">{item.status}</p>
                    <p className="mt-2 font-mono text-xs tabular-nums text-muted-foreground">{String(index + 1).padStart(2, "0")}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">{item.title}</h3>
                    <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{item.body}</p>
                  </div>
                  <ul className="flex flex-col gap-2" aria-label={`${item.title} objectives`}>
                    {item.items.map((objective) => (
                      <li key={objective} className="flex items-start gap-2 text-sm text-foreground">
                        <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-primary">How we will measure it</p>
                <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground">
                  Growth you can see—not just claims.
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  As the business develops, these are the operating categories we will update. Numbers will be published when they are verified and useful.
                </p>
              </div>
              <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
                {measures.map((measure) => (
                  <article key={measure.label} className="bg-card p-5 sm:p-6">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{measure.label}</p>
                    <p className="mt-3 text-xl font-semibold text-foreground">{measure.value}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{measure.note}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-card">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-primary">What will not change</p>
              <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground">
                Scale the company. Protect the standard.
              </h2>
            </div>
            <ul className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
              {constants.map((item, index) => (
                <li key={item} className="flex gap-4 bg-background p-5 text-sm leading-relaxed text-foreground sm:p-6">
                  <span className="font-mono text-[10px] text-primary">{String(index + 1).padStart(2, "0")}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="grid gap-10 rounded-xl border border-border bg-secondary/50 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-primary">Grow with us</p>
                <h2 className="mt-3 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-foreground">
                  Bring us the lane, capability, or relationship worth building around.
                </h2>
                <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                  Shippers, carriers, warehouse operators, and strategic partners all have a place in this roadmap. We are already moving freight every week and growing from there.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <RequestCapacityButton size="lg">
                  Talk with Five Nines
                  <ArrowRight data-icon="inline-end" />
                </RequestCapacityButton>
                <Button render={<Link href="/carriers" />} nativeButton={false} size="lg" variant="outline">
                  Partner with us
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
