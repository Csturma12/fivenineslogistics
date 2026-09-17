import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { MarkApplication } from "@/components/brand-lab/candidate-marks"
import { PortalPreview, DashboardPreview } from "@/components/brand-lab/portal-preview"
import { FiveNinesBadge } from "@/components/brand/five-nines-badge"
import { FiveNinesWordmark } from "@/components/brand/five-nines-wordmark"
import { GridOfNineMark, StackedDecksMark, ViewfinderMark } from "@/components/brand/icon-concepts"

export const metadata: Metadata = {
  title: "Brand Lab — Five Nines Logistics",
  description: "Private Five Nines identity exploration.",
  robots: { index: false, follow: false },
}

const labTheme = {
  "--primary": "oklch(0.47 0.14 256)",
  "--navy": "oklch(0.19 0.025 255)",
  "--navy-foreground": "oklch(0.96 0.006 250)",
  "--status-ok": "oklch(0.78 0.22 145)",
} as React.CSSProperties

const iconDirections = [
  {
    id: "6a",
    name: "Stacked Decks",
    tag: "Most on-brand",
    note: "Flatbed decks stacked in isometric — the live load on top runs green. Same dimensional language as heavy-haul equipment, but ownable.",
    Mark: StackedDecksMark,
  },
  {
    id: "6b",
    name: "Grid of Nine",
    tag: "Most literal",
    note: 'A 3×3 grid of nine — the last one live green. "Nines" made literal, with rack-unit / server-room energy that reads instantly at favicon size.',
    Mark: GridOfNineMark,
  },
  {
    id: "6c",
    name: "Viewfinder",
    tag: "Most conceptual",
    note: "Four corner brackets locked on a live green core — a viewfinder that never loses the load. Strongest metaphor for tracking and visibility.",
    Mark: ViewfinderMark,
  },
]

export default function BrandLabPage() {
  return (
    <main style={labTheme} className="bg-background">
      <SiteHeader />

      <section className="border-t border-border bg-grid-technical">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="font-mono text-xs uppercase tracking-wider text-[color:var(--status-ok)]">
            Private · Identity study 03
          </p>
          <h1 className="mt-5 max-w-4xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
            No metaphor. Just weight. The kind of mark you weld onto a gate.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            An ultra-condensed 900-weight 5N with one live green node, plus three icon directions built
            from the same operating idea. Slate/navy is the primary field; white is the required reverse
            for paperwork; green only ever marks the live element.
          </p>
          <div className="mt-8 flex flex-wrap gap-5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>Slate/navy · primary</span>
            <span>White · reverse</span>
            <span className="text-[color:var(--status-ok)]">Green · live element only</span>
            <span>One-color · always available</span>
          </div>
        </div>
      </section>

      {/* PRIMARY LOCKUP */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-wider text-primary">Primary · Recommended lead</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">5N badge + FIVE NINES wordmark</h2>
          <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
            The badge is the atom; the wordmark is the full signature. Everything else in the system is
            an application of these two pieces.
          </p>

          <div className="mt-10 grid gap-3 lg:grid-cols-2">
            <div className="flex min-h-56 flex-col justify-between gap-6 rounded-lg bg-[color:var(--navy)] p-8">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[color:var(--navy-foreground)]/50">
                Slate field · truck door
              </span>
              <FiveNinesWordmark dark stacked showLogistics showAgent badgeSize={72} />
            </div>
            <div className="flex min-h-56 flex-col justify-between gap-6 rounded-lg border border-border bg-card p-8">
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60">
                White · document header
              </span>
              <FiveNinesWordmark stacked showLogistics showAgent badgeSize={72} />
            </div>
          </div>

          {/* application tiles */}
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <MarkApplication label="App icon" dark>
              <div className="flex items-center gap-4">
                <FiveNinesBadge size={56} variant="light" foot />
                <FiveNinesBadge size={40} variant="dark" />
                <FiveNinesBadge size={40} variant="green" />
              </div>
            </MarkApplication>
            <MarkApplication label="Doc header">
              <FiveNinesWordmark badgeSize={30} showLogistics />
            </MarkApplication>
            <MarkApplication label="Nav / inline" dark>
              <FiveNinesWordmark dark badgeSize={26} />
            </MarkApplication>
          </div>

          {/* scale ramp */}
          <div className="mt-3 rounded-lg border border-border bg-card p-6">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60">
              Scale ramp · 64 → 16px
            </span>
            <div className="mt-5 flex flex-wrap items-end gap-6">
              <FiveNinesBadge size={64} />
              <FiveNinesBadge size={48} />
              <FiveNinesBadge size={32} />
              <FiveNinesBadge size={24} />
              <FiveNinesBadge size={16} />
            </div>
          </div>
        </div>
      </section>

      {/* ICON DIRECTIONS */}
      <section className="border-t border-border bg-grid-technical">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Standalone icon · three directions
            </p>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
              For placements where the wordmark is too much — favicons, embroidery, avatars, map pins.
              Each carries one live green element.
            </p>
          </div>

          {iconDirections.map(({ id, name, tag, note, Mark }) => (
            <article
              key={id}
              className="grid gap-7 border-b border-border pb-12 last:border-0 lg:grid-cols-[0.72fr_1.28fr]"
            >
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-primary">
                  Direction {id} · {tag}
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{name}</h2>
                <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">{note}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <MarkApplication label="Slate field" dark>
                  <Mark className="h-20 w-auto max-w-full text-[color:var(--navy-foreground)]" animated />
                </MarkApplication>
                <MarkApplication label="White / document">
                  <Mark className="h-20 w-auto max-w-full text-foreground" />
                </MarkApplication>
                <MarkApplication label="One color">
                  <Mark className="h-14 w-auto max-w-full text-foreground" monochrome />
                </MarkApplication>
                <MarkApplication label="Small scale">
                  <div className="flex items-end gap-5 text-foreground">
                    <Mark className="h-12 w-auto" />
                    <Mark className="h-8 w-auto" />
                    <Mark className="h-5 w-auto" />
                  </div>
                </MarkApplication>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Portal direction</p>
          <div className="mt-8">
            <PortalPreview />
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Post-login direction</p>
          <div className="mt-8">
            <DashboardPreview />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
