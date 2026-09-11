import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { modes, modesIntro } from "@/lib/site"

export function ModesTeaser() {
  return (
    <section id="modes" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              {modesIntro.eyebrow}
            </span>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              {modesIntro.heading}
            </h2>
          </div>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            Eight modes, run to the same standard — from flatbed and hotshot to drayage, ocean, and
            LTL. See the equipment and the freight we handle in each.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
          {modes.map((mode) => (
            <li key={mode.slug}>
              <Link
                href={`/modes#${mode.slug}`}
                className="group flex h-full items-center justify-between gap-2 bg-card p-5 transition-colors hover:bg-secondary"
              >
                <span className="text-sm font-semibold tracking-tight text-foreground">
                  {mode.name}
                </span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <Button
            render={<Link href="/modes" />}
            nativeButton={false}
            size="lg"
            variant="outline"
            className="font-medium"
          >
            View all modes &amp; services
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </section>
  )
}
