const groups = [
  { value: "Owned", label: "Core operating capacity", title: "Equipment ready to move", body: "Owned capacity supports urgent, dedicated, and regional work where direct control matters most." },
  { value: "≈40", label: "Trucks & trailers", title: "Affiliated capacity", body: "Long-standing relationships built over roughly a decade give us dependable equipment and known operators across repeat lanes." },
  { value: "Nationwide + global", label: "Vetted partner reach", title: "Extended 3PL network", body: "Top-tier partners extend specialty, warehousing, drayage, LTL, and international capabilities. We support them with freight and services outside their own coverage." },
]

export function DedicatedFleet() {
  return <section id="fleet" className="border-t border-border bg-secondary/80"><div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
    <p className="font-mono text-xs uppercase tracking-wider text-primary">How capacity is structured</p>
    <div className="mt-5 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14"><div><h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">The right capacity for the load.</h2><p className="mt-4 text-pretty leading-relaxed text-muted-foreground">Five Nines combines owned equipment, affiliated capacity, and a vetted nationwide and global network under one accountable 3PL relationship.</p></div>
      <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border">{groups.map((group) => <article key={group.title} className="grid gap-4 bg-card p-6 sm:grid-cols-[10rem_1fr] sm:p-7"><div><div className="text-3xl font-semibold tracking-tight text-foreground">{group.value}</div><div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{group.label}</div></div><div><h3 className="text-lg font-semibold text-foreground">{group.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{group.body}</p></div></article>)}</div>
    </div>
    <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted-foreground">Planned sign-ons and equipment additions are reported separately on Watch Us Grow and are not counted as active capacity until they are operating with us.</p>
  </div></section>
}
