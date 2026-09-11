import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { whoWeServe, sectors } from "@/lib/site"

export function WhoWeServe() {
  return (
    <section id="who-we-serve" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              {whoWeServe.eyebrow}
            </span>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              {whoWeServe.heading}
            </h2>
          </div>
          <p className="text-pretty leading-relaxed text-muted-foreground">{whoWeServe.intro}</p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-3">
          {sectors.map((sector) => (
            <div key={sector.code} className="flex flex-col bg-card p-6 sm:p-8">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {sector.code}
              </span>
              <h3 className="mt-4 text-balance text-xl font-semibold leading-snug tracking-tight text-foreground">
                {sector.title}
              </h3>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                {sector.description}
              </p>
              <ul className="mt-6 flex flex-col gap-2.5 border-t border-border pt-6">
                {sector.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span
                      className="mt-2 h-px w-3 shrink-0 bg-primary"
                      aria-hidden="true"
                    />
                    <span className="font-mono text-[13px] text-foreground/90">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Button
            render={<Link href="/who-we-serve" />}
            nativeButton={false}
            size="lg"
            variant="outline"
            className="font-medium"
          >
            See how we serve each sector
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </section>
  )
}
