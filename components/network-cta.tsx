import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RequestCapacityButton } from "@/components/request-capacity-trigger"
import { CoverageMap } from "@/components/coverage-map"
import { hubs, site } from "@/lib/site"

export function NetworkCta() {
  return (
    <section id="network" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-primary">Network</span>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Coverage that holds up coast to coast — and across both borders.
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Regional gateways feed a network of 2,400+ monitored lanes across all 50 states, with
              cross-border operations into Mexico and Canada. At every listed hub, our partners can
              unload loaded containers, mount them on chassis, and complete the final mile. Every
              move reports into the same control tower, so capacity requests are routed against
              current carrier and equipment availability — not a spreadsheet.
            </p>

            <div className="mt-8 grid grid-cols-4 gap-3 sm:grid-cols-4">
              {hubs.map((hub) => (
                <div
                  key={hub.code}
                  className="rounded-lg border border-border bg-card/50 px-3 py-3 text-center"
                >
                  <div className="font-mono text-sm font-semibold text-primary">{hub.code}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{hub.city}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <RequestCapacityButton size="lg" className="font-medium">
                Request Capacity
                <ArrowRight className="size-4" data-icon="inline-end" />
              </RequestCapacityButton>
              <Button
                render={<Link href={`mailto:${site.dispatchEmail}`} />}
                nativeButton={false}
                size="lg"
                variant="outline"
                className="font-medium"
              >
                Talk to Dispatch
              </Button>
            </div>
          </div>

          <CoverageMap />
        </div>
      </div>
    </section>
  )
}
