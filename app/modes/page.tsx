import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NetworkCta } from "@/components/network-cta";
import { DedicatedFleet } from "@/components/dedicated-fleet";
import {
  modes,
  site,
  warehousing,
  jobSiteCoordination,
  certificationsIntro,
  certificationGroups,
  crossBorder,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Modes & Services | Five Nines Logistics",
  description:
    "A Houston-based 3PL arranging flatbed, dry van, sprinter van, refrigerated trucking, expedited, drayage, hotshot, heavy haul, crane and rigging, ocean, LTL, and warehousing through nationwide and global partners.",
};

export default function ModesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero-grid border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              Modes &amp; Services
            </span>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Twelve modes. One tolerance for failure.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Owned capacity, affiliated carriers, and a vetted nationwide and
              global network give us the reach to solve the whole shipment. Our
              relationships run both ways: partners extend enterprise
              capabilities to Five Nines, and we support them with freight and
              services outside their own coverage.
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
                render={<Link href="/loads" />}
                nativeButton={false}
                size="lg"
                variant="outline"
                className="font-medium"
              >
                View Load Board
                <ArrowRight className="size-4" data-icon="inline-end" />
              </Button>
            </div>
          </div>
        </section>

        <DedicatedFleet />

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border">
              {modes.map((mode, i) => (
                <div
                  key={mode.slug}
                  id={mode.slug}
                  className="scroll-mt-24 bg-card"
                >
                  <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.4fr_1fr]">
                    <div>
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                        {mode.name}
                      </h2>
                      <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
                        {mode.detail}
                      </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:gap-5">
                      <div>
                        <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                          Equipment
                        </h3>
                        <ul className="mt-3 flex flex-col gap-2">
                          {mode.equipment.map((item) => (
                            <li
                              key={item}
                              className="flex items-center gap-2 text-sm text-foreground"
                            >
                              <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                          Typical loads
                        </h3>
                        <ul className="mt-3 flex flex-col gap-2">
                          {mode.typicalLoads.map((item) => (
                            <li
                              key={item}
                              className="flex items-center gap-2 text-sm text-foreground"
                            >
                              <span className="size-1.5 shrink-0 rounded-full bg-border" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="warehousing"
          className="scroll-mt-24 border-b border-border"
        >
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              {warehousing.eyebrow}
            </span>
            <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              {warehousing.heading}
            </h2>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {warehousing.intro}
            </p>

            <div className="mt-10">
              <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Warehouse markets
              </h3>
              <div className="mt-4 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
                {warehousing.locations.map((loc) => (
                  <div key={loc.city} className="bg-card p-5">
                    <p className="text-sm font-semibold text-foreground">
                      {loc.city}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {loc.note}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                + vetted partner space nationwide
              </p>
            </div>

            <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-3">
              {warehousing.capabilities.map((cap) => (
                <div key={cap.title} className="bg-card p-6 sm:p-8">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {cap.title}
                  </h3>
                  <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {cap.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hands-on job site coordination */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              {jobSiteCoordination.eyebrow}
            </span>
            <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              {jobSiteCoordination.heading}
            </h2>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {jobSiteCoordination.intro}
            </p>
            <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-3">
              {jobSiteCoordination.capabilities.map((cap) => (
                <div key={cap.title} className="bg-card p-6 sm:p-8">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {cap.title}
                  </h3>
                  <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {cap.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications & compliance */}
        <section
          id="certifications"
          className="scroll-mt-24 border-b border-border"
        >
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              {certificationsIntro.eyebrow}
            </span>
            <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              {certificationsIntro.heading}
            </h2>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {certificationsIntro.intro}
            </p>

            <div className="mt-10 flex flex-col gap-8">
              {certificationGroups.map((group) => (
                <div key={group.title}>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                      {group.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {group.note}
                    </p>
                  </div>
                  <div className="mt-4 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((item) => (
                      <div
                        key={item.name}
                        className="flex flex-col bg-card p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-sm font-semibold leading-snug text-foreground">
                            {item.name}
                          </h4>
                          {item.abbr ? (
                            <span className="shrink-0 rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                              {item.abbr}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          {item.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cross-border emphasis */}
        <section
          id="cross-border"
          className="scroll-mt-24 border-b border-border"
        >
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-primary">
                {crossBorder.eyebrow}
              </span>
              <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
                {crossBorder.heading}
              </h2>
              <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                {crossBorder.intro}
              </p>
            </div>
            <ul className="flex flex-col gap-px overflow-hidden rounded-xl border border-border bg-border">
              {crossBorder.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 bg-card p-5 text-sm text-foreground"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <NetworkCta />
      </main>
      <SiteFooter />
    </>
  );
}
