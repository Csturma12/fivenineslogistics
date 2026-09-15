import type { Metadata } from "next"
import { BarChart3, Clock3, Route, ShieldAlert } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ConsultationForm } from "@/components/consultation-form"

export const metadata: Metadata = { title: "Supply Chain Consulting | Five Nines Logistics", description: "Practical, no-cost freight audits, delay analysis, risk reviews, and route consultations from Five Nines Logistics." }

const services = [
  { title: "Freight cost audit", Icon: BarChart3, input: "Recent freight invoices, lanes, and accessorials", output: "A short list of billing leakage, mode mismatches, and realistic savings opportunities" },
  { title: "Shipping delay analysis", Icon: Clock3, input: "Late shipments, appointment history, and known handoff points", output: "A plain-language breakdown of where time is being lost and what to change first" },
  { title: "Supply-chain risk assessment", Icon: ShieldAlert, input: "Critical suppliers, facilities, modes, and recovery constraints", output: "A prioritized risk map with practical backup options for the highest-exposure lanes" },
  { title: "Route-optimization consultation", Icon: Route, input: "Origins, destinations, frequency, equipment, and delivery rules", output: "A lane and mode review focused on fewer empty miles, cleaner handoffs, and reliable appointments" },
]

export default function ConsultingPage() { return <><SiteHeader/><main>
  <section className="hero-grid border-b border-border"><div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"><p className="font-mono text-xs uppercase tracking-wider text-primary">Supply Chain Consulting</p><h1 className="mt-4 max-w-4xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">Start with the freight problem you can already see.</h1><p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">No slide deck theater. We review the lanes, invoices, delays, and operating constraints, then tell you where the process is leaking time or money. The first assessment is free.</p></div></section>
  <section className="border-b border-border"><div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"><div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2">{services.map(({title,Icon,input,output})=><article key={title} className="bg-card p-6 sm:p-8"><Icon className="size-5 text-primary" aria-hidden="true"/><h2 className="mt-5 text-xl font-semibold tracking-tight text-foreground">{title}</h2><dl className="mt-5 flex flex-col gap-4 text-sm"><div><dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">What we need</dt><dd className="mt-1.5 leading-relaxed text-foreground">{input}</dd></div><div><dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">What you receive</dt><dd className="mt-1.5 leading-relaxed text-foreground">{output}</dd></div></dl></article>)}</div></div></section>
  <section id="request" className="border-b border-border bg-secondary/50"><div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="font-mono text-xs uppercase tracking-wider text-primary">Free first review</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Tell us what is not working.</h2><p className="mt-4 leading-relaxed text-muted-foreground">Pick one assessment and give us enough context to prepare. We will contact you to confirm scope before asking for documents.</p></div><ConsultationForm/></div></section>
</main><SiteFooter/></> }
