const groups = [
  { value: "≈40", label: "Established trucks & trailers", title: "Long-standing carrier capacity", body: "Independent carrier relationships built over roughly a decade. These assets are not owned by Five Nines; they are familiar capacity we can evaluate alongside other qualified options for each shipment." },
  { value: "2 + 1 + 1", label: "Hotshots · sprinter · power unit", title: "Current equipment access", body: "Two hotshots, one sprinter van, and one power unit are currently available through operating and carrier relationships. Flatbeds, vans, and reefers may be leased, borrowed, or supplied by qualified carriers as the load requires." },
  { value: "Nationwide + global", label: "Reciprocal partner reach", title: "Extended 3PL network", body: "Top-tier partners extend specialty, warehousing, drayage, LTL, and international capabilities to our customers. We support them with freight and services outside their own lanes, equipment, or geographic scope." },
]

export function DedicatedFleet() {
  return <section id="fleet" className="border-t border-border bg-secondary/80"><div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
    <p className="font-mono text-xs uppercase tracking-wider text-primary">How capacity is structured</p>
    <div className="mt-5 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14"><div><h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Clear about what we own, what we access, and who moves the load.</h2><p className="mt-4 text-pretty leading-relaxed text-muted-foreground">Five Nines is a 3PL and freight brokerage brand operating as an agent of Primary Freight LLC. We combine established carrier relationships, current equipment access, and a wider nationwide and global network. The right provider depends on the shipment—not a marketing label.</p></div>
      <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border">{groups.map((group) => <article key={group.title} className="grid gap-4 bg-card p-6 sm:grid-cols-[10rem_1fr] sm:p-7"><div><div className="text-3xl font-semibold tracking-tight text-foreground">{group.value}</div><div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{group.label}</div></div><div><h3 className="text-lg font-semibold text-foreground">{group.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{group.body}</p></div></article>)}</div>
    </div>
    <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted-foreground">Planned sign-ons and equipment additions are reported separately on Watch Us Grow and are not counted as active capacity until they are operating with us.</p>
  </div></section>
}
