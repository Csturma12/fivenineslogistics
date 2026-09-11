import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReliabilityMonitor } from "@/components/reliability-monitor"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid-technical">
      <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                SLA-Grade Freight Operations
              </span>
            </div>

            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Freight reliability, measured to five nines.
            </h1>

            <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Five Nines Logistics applies infrastructure-grade monitoring and SLA discipline to
              physical freight. Every lane is instrumented, every exception is caught early, and
              every load is held to 99.999% — so it arrives on schedule, without exception.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                render={<Link href="#request-capacity" />}
                nativeButton={false}
                size="lg"
                className="font-medium"
              >
                Request Capacity
                <ArrowRight className="size-4" data-icon="inline-end" />
              </Button>
              <Button
                render={<Link href="#network" />}
                nativeButton={false}
                size="lg"
                variant="outline"
                className="font-medium"
              >
                View Network Status
              </Button>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-6">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  On-time
                </dt>
                <dd className="mt-1 font-mono text-xl font-semibold text-foreground">99.999%</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Coverage
                </dt>
                <dd className="mt-1 font-mono text-xl font-semibold text-foreground">24/7/365</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Lanes
                </dt>
                <dd className="mt-1 font-mono text-xl font-semibold text-foreground">2,400+</dd>
              </div>
            </dl>
          </div>

          <ReliabilityMonitor />
        </div>
      </div>
    </section>
  )
}
