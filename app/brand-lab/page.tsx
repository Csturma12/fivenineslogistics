import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  AssetTagMark,
  BracketLockupMark,
  CompassLockMark,
  GaugeLockMark,
  HybridPlateMark,
  MarkApplication,
  NetworkFiveMark,
  NodeFiveMark,
  ReticleMark,
  RouteFiveMark,
  SerialPlateMark,
  ViewfinderCrossMark,
  ViewfinderLoadMark,
  ViewfinderMark,
} from "@/components/brand-lab/candidate-marks"
import { PortalPreview, DashboardPreview } from "@/components/brand-lab/portal-preview"
import { GatePreview } from "@/components/brand-lab/gate-preview"

export const metadata: Metadata = { title: "Brand Lab — Five Nines Logistics", description: "Private Five Nines identity exploration.", robots: { index: false, follow: false } }

const families = [
  {
    key: "E",
    title: "E — Viewfinder Lock",
    blurb: "The current lead. Iterating on what the brackets actually hold.",
    variants: [
      { id: "E", name: "Original — point core", Mark: ViewfinderMark, note: "Brackets locked on a single live core. The cleanest favicon of the set." },
      { id: "E1", name: "Load bar", Mark: ViewfinderLoadMark, note: "The core becomes a horizontal load riding the bed — reads more explicitly as freight, not just a target." },
      { id: "E2", name: "Crosshair", Mark: ViewfinderCrossMark, note: "Converging ticks add a precision-instrument read. Trades a little favicon simplicity for more character." },
    ],
  },
  {
    key: "B",
    title: "B — Five-Node Network",
    blurb: "Back from the cutting board. The original mesh was generic, so both iterations give the five nodes a real job.",
    variants: [
      { id: "B", name: "Original — mesh", Mark: NetworkFiveMark, note: "The generic pentagon mesh, kept for reference. This is the version I'd still argue against." },
      { id: "B1", name: "Shipment route", Mark: RouteFiveMark, note: "Five waypoints on one route, destination live. A path with direction, not an anonymous web of dots." },
      { id: "B2", name: "Nodes form the 5", Mark: NodeFiveMark, note: "The five nodes trace the numeral 5 — the network literally becomes the name. The only node concept with an actual idea." },
    ],
  },
  {
    key: "J",
    title: "J — Reticle / Round",
    blurb: "Pulling the round sibling away from being just a circular E.",
    variants: [
      { id: "J", name: "Original — reticle", Mark: ReticleMark, note: "Targeting reticle with N/E/S/W ticks on a live core." },
      { id: "J1", name: "Open gauge lock", Mark: GaugeLockMark, note: "An open lock ring that reads as a status dial — distinct from E, good as a stamp or seal." },
      { id: "J2", name: "Bearing needle", Mark: CompassLockMark, note: "A needle locked onto the live destination node — tracking a heading rather than framing a point." },
    ],
  },
]

const held = [
  { id: "H", name: "Bracket Lockup", Mark: BracketLockupMark },
  { id: "A", name: "5N Network Plate", Mark: HybridPlateMark },
  { id: "C", name: "5N Serial Plate", Mark: SerialPlateMark },
  { id: "I", name: "Freight Hang Tag", Mark: AssetTagMark },
]

const labTheme = { "--primary": "oklch(0.47 0.14 256)", "--navy": "oklch(0.19 0.025 255)", "--navy-foreground": "oklch(0.96 0.006 250)", "--status-ok": "oklch(0.78 0.22 145)" } as React.CSSProperties

export default function BrandLabPage() {
  return <main style={labTheme} className="bg-background"><SiteHeader />
    <section className="border-t border-border bg-grid-technical"><div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="font-mono text-xs uppercase tracking-wider text-[color:var(--status-ok)]">Private · Identity study 02</p>
      <h1 className="mt-5 max-w-4xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">Lock on the load. Built like a machine tag.</h1>
      <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-muted-foreground">One family, two instincts: an equipment nameplate and a viewfinder that never loses the load. Slate/navy is the primary field because it feels at home on equipment, portals, and workwear. White remains the required reverse version for paperwork and bright applications.</p>
      <div className="mt-8 flex flex-wrap gap-5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><span>Slate/navy · primary</span><span>White · reverse</span><span className="text-[color:var(--status-ok)]">Green · live node only</span><span>One-color · always available</span></div>
    </div></section>
    <section className="border-t border-border"><div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-16 sm:px-6">
      {families.map(({ key, title, blurb, variants }) => <div key={key} className="border-b border-border pb-14 last:border-0">
        <div className="max-w-2xl"><p className="font-mono text-xs uppercase tracking-wider text-primary">Iterating · Direction {key}</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{title}</h2><p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{blurb}</p></div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {variants.map(({ id, name, note, Mark }) => <article key={id} className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
            <div className="flex items-baseline justify-between"><span className="font-mono text-xs uppercase tracking-wider text-primary">{id}</span><span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Live · animated</span></div>
            <div className="flex items-center justify-center rounded-md bg-[color:var(--navy)] p-8"><Mark className="h-24 w-auto max-w-full text-[color:var(--navy-foreground)]" animated /></div>
            <div className="flex items-end gap-4 rounded-md border border-border bg-background px-4 py-3"><Mark className="h-10 w-auto text-foreground"/><Mark className="h-6 w-auto text-foreground"/><Mark className="h-4 w-auto text-foreground"/><span className="ml-auto self-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Favicon scale</span></div>
            <div><h3 className="text-lg font-semibold tracking-tight text-foreground">{name}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{note}</p></div>
          </article>)}
        </div>
      </div>)}
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Also held in the lab</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {held.map(({ id, name, Mark }) => <div key={id} className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5"><div className="flex items-center justify-center rounded-md border border-border bg-background p-6"><Mark className="h-16 w-auto max-w-full text-foreground" /></div><div><span className="font-mono text-xs uppercase tracking-wider text-primary">{id}</span><h3 className="mt-1 text-base font-semibold tracking-tight text-foreground">{name}</h3></div></div>)}
        </div>
      </div>
    </div></section>
    <section className="border-t border-border bg-grid-technical"><div className="mx-auto max-w-6xl px-4 py-16 sm:px-6"><p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Inside the gates</p><h2 className="mt-3 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-foreground">The setup flow customers and carriers see once they&apos;re through the door.</h2><p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">The mark holds on the gate header while the body stays quiet and document-first — same navy chrome as the portal, green reserved for what is confirmed and live.</p><div className="mt-8"><GatePreview /></div></div></section>
    <section className="border-t border-border"><div className="mx-auto max-w-6xl px-4 py-16 sm:px-6"><p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Portal direction</p><div className="mt-8"><PortalPreview /></div></div></section>
    <section className="border-t border-border"><div className="mx-auto max-w-6xl px-4 py-16 sm:px-6"><p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Post-login direction</p><div className="mt-8"><DashboardPreview /></div></div></section>
    <SiteFooter /></main>
}
