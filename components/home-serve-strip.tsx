import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { sectors } from "@/lib/site"

export function HomeServeStrip() {
  return (
    <section className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              Who we serve
            </span>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Freight for a window that will not move.
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              More than half of what we move is refractory, plant maintenance, and PFV — headed for a
              furnace, a unit, or a shutdown. Data halls and job sites run on the same clock.
            </p>
          </div>
          <Link
            href="/who-we-serve"
            className="group inline-flex shrink-0 items-center gap-2 font-medium text-primary"
          >
            See all sectors
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector, i) => (
            <Link
              key={sector.code}
              href="/who-we-serve"
              className="group bg-card p-6 transition-colors hover:bg-card/70"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
                  {sector.code}
                </span>
              </div>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
                {sector.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
