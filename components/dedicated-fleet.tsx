const groups = [
  { value: "≈40", label: "Affiliated trucks & trailers", title: "Affiliated carrier capacity", body: "Long-standing carrier relationships built over roughly a decade. These assets are not presented as owned by Five Nines; they are capacity we know, call first, and coordinate through the brokerage." },
  { value: "2 + 1 + 1", label: "Hotshots · sprinter · power unit", title: "Current direct equipment", body: "Two hotshots, one sprinter van, and one power unit support current operations. Flatbeds, vans, and reefers are accessed through leases, borrowing arrangements, affiliated carriers, and other partners as the load requires." },
  { value: "50 states", label: "Vetted partner reach", title: "Extended carrier network", body: "Additional vetted carriers cover one-way lanes, specialty equipment, drayage, LTL, ocean connections, and overflow when affiliated capacity is committed elsewhere." },
]

export function DedicatedFleet() {
  return <section id="fleet" className="border-t border-border bg-secondary/80"><div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
    <p className="font-mono text-xs uppercase tracking-wider text-primary">How capacity is structured</p>
    <div className="mt-5 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14"><div><h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Clear about what we own, what we access, and who moves the load.</h2><p className="mt-4 text-pretty leading-relaxed text-muted-foreground">Five Nines is a freight brokerage brand operating as an agent of Primary Freight LLC. We combine direct equipment, affiliated carrier relationships, and a wider vetted network. The right category depends on the lane and equipment—not a marketing label.</p></div>
      <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border">{groups.map((group) => <article key={group.title} className="grid gap-4 bg-card p-6 sm:grid-cols-[10rem_1fr] sm:p-7"><div><div className="text-3xl font-semibold tracking-tight text-foreground">{group.value}</div><div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{group.label}</div></div><div><h3 className="text-lg font-semibold text-foreground">{group.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{group.body}</p></div></article>)}</div>
    </div>
    <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted-foreground">Planned sign-ons and equipment additions are reported separately on Watch Us Grow and are not counted as active capacity until they are operating with us.</p>
  </div></section>
}
