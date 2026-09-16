import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = { title: "Watch Us Grow | Five Nines Logistics", description: "A transparent operating journal covering Five Nines Logistics capacity, equipment, carrier relationships, and service growth." }

const capacity = [
 {label:"Available today",value:"2 hotshots · 1 sprinter · 1 power unit",body:"Current equipment access through operating and carrier relationships. Trailer access may be leased, borrowed, or carrier-supplied depending on the job."},
 {label:"Established carrier capacity",value:"Approximately 40 trucks & trailers",body:"Independent carrier assets available through relationships built over roughly a decade. We coordinate them through the brokerage and do not call them a Five Nines-owned fleet."},
 {label:"Signing on",value:"4–5 additional hotshots planned",body:"Recruiting and onboarding are underway. These units are not counted as active capacity until agreements, insurance, and operating requirements are complete."},
]
const updates = [
 {date:"September 2026",title:"Publishing the capacity model",body:"We separated current equipment access, established carrier capacity, and the extended partner network across the site. Customers should know who is providing the equipment before a load moves."},
 {date:"September 2026",title:"Supply Chain Consulting opens",body:"Four practical first reviews are now available at no cost: freight cost audit, delay analysis, risk assessment, and route optimization."},
 {date:"Next report",title:"Equipment and hub additions",body:"New hotshots, trailers, power units, warehouse access, and drayage hubs will be posted here after they are active—not while they are still planned."},
]

export default function GrowthPage(){return <><SiteHeader/><main>
<section className="hero-grid border-b border-border"><div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"><p className="font-mono text-xs uppercase tracking-wider text-primary">Watch Us Grow</p><h1 className="mt-4 max-w-4xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">What is operating now. What we are adding next.</h1><p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">This is an operating journal, not a press-release feed. We will publish meaningful additions when equipment, carrier capacity, hubs, or services are actually ready to support a customer.</p></div></section>
<section className="border-b border-border"><div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"><p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Capacity snapshot · September 2026</p><div className="mt-7 grid gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-3">{capacity.map(item=><article key={item.label} className="bg-card p-6 sm:p-8"><p className="font-mono text-[10px] uppercase tracking-wider text-primary">{item.label}</p><h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{item.value}</h2><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.body}</p></article>)}</div></div></section>
<section className="border-b border-border bg-secondary/50"><div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"><h2 className="text-3xl font-semibold tracking-tight text-foreground">Operating updates</h2><div className="mt-8 flex flex-col border-t border-border">{updates.map(item=><article key={item.title} className="grid gap-4 border-b border-border py-8 md:grid-cols-[11rem_1fr]"><p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{item.date}</p><div><h3 className="text-xl font-semibold text-foreground">{item.title}</h3><p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{item.body}</p></div></article>)}</div></div></section>
<section><div className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-4 py-16 sm:px-6 sm:py-20"><h2 className="text-3xl font-semibold tracking-tight text-foreground">Have a lane we should build around?</h2><p className="max-w-xl leading-relaxed text-muted-foreground">Tell us where dependable capacity is missing. Customer demand determines what we add and where we stage it.</p><Button render={<Link href="/request-capacity"/>} nativeButton={false}>Start the conversation<ArrowRight data-icon="inline-end"/></Button></div></section>
</main><SiteFooter/></>}
