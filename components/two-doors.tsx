import Link from "next/link"
import { ArrowRight, Truck, PackageCheck } from "lucide-react"

export function TwoDoors() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-wider text-primary">
            Two ways in
          </span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Got freight, or got a truck?
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Pick your door. Shippers get capacity planned around the delivery date. Carriers get
            steady, planned lanes and dispatch that answers.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {/* Shipper door */}
          <Link
            href="/request-capacity"
            className="group flex flex-col rounded-xl border border-border bg-card p-8 transition-colors hover:border-primary/60 sm:p-10"
          >
            <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PackageCheck className="size-5" />
            </span>
            <h3 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
              Ship with us
            </h3>
            <p className="mt-3 flex-1 text-pretty leading-relaxed text-muted-foreground">
              Refractory, PFV, plant maintenance, data centers, and oversize — planned backward from
              the window it has to hit. Tell us the lane and the date.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-medium text-primary">
              Request capacity
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          {/* Carrier door */}
          <Link
            href="/carriers"
            className="group flex flex-col rounded-xl border border-border bg-secondary p-8 transition-colors hover:border-primary/60 sm:p-10"
          >
            <span className="flex size-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Truck className="size-5" />
            </span>
            <h3 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
              Drive with us
            </h3>
            <p className="mt-3 flex-1 text-pretty leading-relaxed text-muted-foreground">
              Run clean, communicate, and show up — and get on the bench for steady freight, fair
              rates, and quick-pay. See what we look for and sign on.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-medium text-primary">
              Haul for Five Nines
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
