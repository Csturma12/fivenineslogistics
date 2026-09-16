import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CondensedWordmark, GridNineMark, HybridPlateMark, IsoStackMark, MarkApplication, NetworkFiveMark, SerialPlateMark, ViewfinderMark } from "@/components/brand-lab/candidate-marks"
import { PortalPreview, DashboardPreview } from "@/components/brand-lab/portal-preview"
import { GatePreview } from "@/components/brand-lab/gate-preview"

export const metadata: Metadata = { title: "Brand Lab — Five Nines Logistics", description: "Private Five Nines identity exploration.", robots: { index: false, follow: false } }

const directions = [
  { id: "A", name: "5N Network Plate", tag: "Recommended lead", note: "The machinery tag and the five-node network become one mark. It has enough character for a truck door and stays orderly in a document header.", Mark: HybridPlateMark },
  { id: "B", name: "Five-Node Network", tag: "Most compact", note: "A reduced standalone network for favicons, embroidery, social avatars, and small digital placements. One live node carries the uptime idea.", Mark: NetworkFiveMark },
  { id: "C", name: "5N Serial Plate", tag: "Most industrial", note: "A direct equipment-nameplate reference. The green lamp reads as system status without turning the primary mark into a dashboard graphic.", Mark: SerialPlateMark },
  { id: "D", name: "Nine-Cell Rack", tag: "Nines, made literal", note: "A 3×3 grid of nine with the ninth cell live green — server-rack / rack-unit energy. The name becomes the mark: nine units, all accounted for, one reporting live.", Mark: GridNineMark },
  { id: "E", name: "Viewfinder Lock", tag: "Never loses the load", note: "Four corner brackets locked on a live green core — a viewfinder that keeps the shipment in frame. Reads instantly at favicon scale and stencils cleanly onto a gate.", Mark: ViewfinderMark },
  { id: "F", name: "Deck Stack", tag: "Freight-native", note: "Flatbed decks stacked in isometric with the live load riding on top in green. Same dimensional language as the reference boards, but ownable.", Mark: IsoStackMark },
  { id: "G", name: "5N Heavyweight", tag: "No metaphor, just weight", note: "Ultra-condensed 900-weight 5N with a green N. Nothing to decode — the kind of mark you weld onto a gate or press onto a truck door.", Mark: CondensedWordmark },
]

const labTheme = { "--primary": "oklch(0.47 0.14 256)", "--navy": "oklch(0.19 0.025 255)", "--navy-foreground": "oklch(0.96 0.006 250)", "--status-ok": "oklch(0.78 0.22 145)" } as React.CSSProperties

export default function BrandLabPage() {
  return <main style={labTheme} className="bg-background"><SiteHeader />
    <section className="border-t border-border bg-grid-technical"><div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="font-mono text-xs uppercase tracking-wider text-[color:var(--status-ok)]">Private · Identity study 02</p>
      <h1 className="mt-5 max-w-4xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">Five nodes. One live signal. Built like a machine tag.</h1>
      <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-muted-foreground">Three directions built from the same operating idea. Slate/navy is the primary field because it feels at home on equipment, portals, and workwear. White remains the required reverse version for paperwork and bright applications.</p>
      <div className="mt-8 flex flex-wrap gap-5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><span>Slate/navy · primary</span><span>White · reverse</span><span className="text-[color:var(--status-ok)]">Green · live node only</span><span>One-color · always available</span></div>
    </div></section>
    <section className="border-t border-border"><div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6">
      {directions.map(({ id, name, tag, note, Mark }) => <article key={id} className="grid gap-7 border-b border-border pb-12 last:border-0 lg:grid-cols-[0.72fr_1.28fr]">
        <div><p className="font-mono text-xs uppercase tracking-wider text-primary">Direction {id} · {tag}</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{name}</h2><p className="mt-4 max-w-md leading-relaxed text-muted-foreground">{note}</p></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <MarkApplication label="Slate field" dark><Mark className="h-20 w-auto max-w-full" animated /></MarkApplication>
          <MarkApplication label="White / document"><Mark className="h-20 w-auto max-w-full text-foreground" /></MarkApplication>
          <MarkApplication label="One color"><Mark className="h-14 w-auto max-w-full text-foreground" monochrome /></MarkApplication>
          <MarkApplication label="Small scale"><div className="flex items-end gap-5"><Mark className="h-12 w-auto text-foreground"/><Mark className="h-8 w-auto text-foreground"/><Mark className="h-5 w-auto text-foreground"/></div></MarkApplication>
        </div>
      </article>)}
    </div></section>
    <section className="border-t border-border bg-grid-technical"><div className="mx-auto max-w-6xl px-4 py-16 sm:px-6"><p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Inside the gates</p><h2 className="mt-3 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-foreground">The setup flow customers and carriers see once they&apos;re through the door.</h2><p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">The mark holds on the gate header while the body stays quiet and document-first — same navy chrome as the portal, green reserved for what is confirmed and live.</p><div className="mt-8"><GatePreview /></div></div></section>
    <section className="border-t border-border"><div className="mx-auto max-w-6xl px-4 py-16 sm:px-6"><p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Portal direction</p><div className="mt-8"><PortalPreview /></div></div></section>
    <section className="border-t border-border"><div className="mx-auto max-w-6xl px-4 py-16 sm:px-6"><p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Post-login direction</p><div className="mt-8"><DashboardPreview /></div></div></section>
    <SiteFooter /></main>
}
