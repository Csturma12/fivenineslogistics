import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  Mail,
  Phone,
  Briefcase,
  TrendingUp,
  Calculator,
  Headset,
  HardHat,
  Truck,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Work With Us | Careers at Five Nines Logistics",
  description:
    "Build with a growing Houston freight practice. Freight agents, owner-operators with no ceiling on growth, in-house accounting, and operations roles—accepting interest now.",
}

const roles = [
  {
    icon: Briefcase,
    title: "Freight agents",
    body: "Bring your book of business and run it on an established platform. Back-office, credit, carrier setup, and 24/7 dispatch support behind every load you move.",
    points: ["Book of business welcome", "Established operating platform", "Full back-office support"],
  },
  {
    icon: TrendingUp,
    title: "Independent contractors & owner-operators",
    body: "No ceiling on growth. Keep more of what you build, with steady freight, fair rates, quick-pay, and dispatch that actually answers.",
    points: ["Uncapped earning potential", "Steady, planned freight", "Quick-pay available"],
  },
  {
    icon: Calculator,
    title: "In-house accounting",
    body: "Own settlements, billing, and AP/AR for a growing brokerage. Build the financial backbone that keeps carriers paid and customers invoiced right.",
    points: ["Settlements & carrier pay", "Billing and AP/AR", "Process ownership"],
  },
  {
    icon: Headset,
    title: "Administrative & operations",
    body: "Dispatch support, documentation, and customer service for shippers who run on tight windows. The people who keep every shipment accountable.",
    points: ["Dispatch & track-and-trace", "Documentation & compliance", "Customer service"],
  },
]

const experience = [
  {
    icon: Truck,
    title: "Drivers with 10+ years on the road",
    body: "Our staff includes drivers who have spent a decade or more hauling real freight—people who know what it takes to deliver on time.",
  },
  {
    icon: HardHat,
    title: "Foremen & superintendents from the field",
    body: "We have leaders who have worked in the field, run crews, and understand jobsite demands from the inside.",
  },
  {
    icon: ShieldCheck,
    title: "A decade in the refractory industry",
    body: "Ten years of field work in the refractory industry grounds how we plan, communicate, and execute for industrial customers.",
  },
]

const applySubject = "Work With Us — Application Interest"
const applyBody = [
  "Please share the following so we can route your interest to the right role:",
  "",
  "Role of interest (agent / owner-operator / accounting / operations):",
  "Years of experience:",
  "Current location:",
  "Best phone number:",
  "Email:",
  "A few sentences about your background:",
  "",
  "Please attach your résumé to this email.",
].join("\n")
const applyHref = `mailto:${site.infoEmail}?subject=${encodeURIComponent(applySubject)}&body=${encodeURIComponent(applyBody)}`

export default function WorkWithUsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero-grid border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <p className="font-mono text-xs uppercase tracking-wider text-primary">Work With Us</p>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Build with a growing freight practice.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Five Nines is early, experienced, and expanding. We are accepting interest now from agents,
              owner-operators, accounting, and operations people who want to grow with a company that
              treats its people the way it treats its freight—accountable, direct, and built to last.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button render={<Link href={applyHref} />} nativeButton={false} size="lg" className="font-medium">
                <Mail className="size-4" data-icon="inline-start" />
                Apply / express interest
              </Button>
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

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-primary">Open roles</p>
                <h2 className="mt-3 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Where you fit.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                Accepting interest now. If you are strong at what you do and tired of a ceiling, we want to
                hear from you.
              </p>
            </div>
            <div className="mt-9 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2">
              {roles.map((role) => {
                const Icon = role.icon
                return (
                  <article key={role.title} className="bg-card p-6 sm:p-8">
                    <Icon className="size-5 text-primary" aria-hidden="true" />
                    <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">{role.title}</h3>
                    <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{role.body}</p>
                    <ul className="mt-5 flex flex-col gap-2" aria-label={`${role.title} highlights`}>
                      {role.points.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-sm text-foreground">
                          <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-secondary/50">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <p className="font-mono text-xs uppercase tracking-wider text-primary">Who you would work with</p>
            <h2 className="mt-3 max-w-3xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Experience you can lean on.
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              Our staff is not learning freight on your time. It is built from people who have already done
              the work—on the road, on the jobsite, and in the field.
            </p>
            <div className="mt-9 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
              {experience.map((item) => {
                const Icon = item.icon
                return (
                  <article key={item.title} className="bg-card p-6 sm:p-8">
                    <Icon className="size-5 text-primary" aria-hidden="true" />
                    <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">{item.title}</h3>
                    <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{item.body}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="grid gap-10 rounded-xl border border-border bg-secondary/50 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-primary">Ready when you are</p>
                <h2 className="mt-3 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-foreground">
                  Tell us the role, your experience, and attach a résumé.
                </h2>
                <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                  Send us your background and contact details. We read every message and follow up on the
                  ones that fit as the team grows.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button render={<Link href={applyHref} />} nativeButton={false} size="lg" className="font-medium">
                  <Mail className="size-4" data-icon="inline-start" />
                  Apply / express interest
                </Button>
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
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
