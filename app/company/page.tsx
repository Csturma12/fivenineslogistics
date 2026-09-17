import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Method } from "@/components/method"
import { Reliability } from "@/components/reliability"
import { NetworkCta } from "@/components/network-cta"
import { companyPage, companyStory, companyModel, credentials, site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Who We Are | Five Nines Logistics",
  description:
    "Built on ten years in plant maintenance and ten years coordinating logistics across all 50 states, Canada and Mexico. Five Nines is growing a team grounded in experience and trusted driver relationships.",
}

export default function CompanyPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero-grid border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              {companyPage.eyebrow}
            </span>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {companyPage.heading}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {companyPage.intro}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                render={<Link href="/request-capacity" />}
                nativeButton={false}
                size="lg"
                className="font-medium"
              >
                Request Capacity
                <ArrowRight className="size-4" data-icon="inline-end" />
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
            <div className="mb-12 max-w-3xl">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">{companyStory[0].title}</h2>
              {companyStory[0].body.split("\n\n").map((paragraph) => <p key={paragraph} className="mt-5 text-lg leading-relaxed text-muted-foreground">{paragraph}</p>)}
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              {companyStory.slice(1).map((item, i) => (
                <div key={item.title} className="rounded-xl border border-border bg-card p-6 sm:p-8">
                  <span className="font-mono text-xs tabular-nums text-primary">
                    {String(i + 2).padStart(2, "0")}
                  </span>
                  <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Authority &amp; credentials
            </h2>
            <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
              The paperwork mission-critical shippers check before they tender. If anything below reads
              &ldquo;pending,&rdquo; it&apos;s being finalized — ask dispatch for current documentation.
            </p>
            <dl className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
              {credentials.map((c) => (
                <div key={c.label} className="flex flex-col gap-1 bg-card p-6">
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {c.label}
                  </dt>
                  <dd className="font-mono text-lg tabular-nums text-foreground">{c.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="rounded-xl border border-border bg-secondary/60 p-8 sm:p-12">
              <h2 className="max-w-2xl text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {companyModel.heading}
              </h2>
              <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                {companyModel.body}
              </p>
            </div>
          </div>
        </section>

        <Method />
        <Reliability />
        <NetworkCta />
      </main>
      <SiteFooter />
    </>
  )
}
