const points = [
  {
    title: "One lane, mastered",
    body: "They don't chase whatever load pays today. The transcon is all they run — every scale, every fuel stop, every mountain pass and season on it is known.",
  },
  {
    title: "Loaded out, loaded home",
    body: "East Coast and Midwest out to California, then back. Round-trip lanes keep the trucks earning both directions and keep your capacity predictable.",
  },
  {
    title: "Your freight, our people",
    body: "Company drivers on company equipment — not a rotating cast of brokered carriers. The same names handle your load from pickup to delivery.",
  },
]

const stats = [
  { value: "40+", label: "Company drivers" },
  { value: "2", label: "Coasts, every week" },
  { value: "Transcon", label: "The only lane they run" },
  { value: "Round trip", label: "Out loaded, back loaded" },
]

export function DedicatedFleet() {
  return (
    <section id="fleet" className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              Dedicated fleet
            </span>
            <div className="mt-6 flex items-end gap-4">
              <span className="text-7xl font-semibold leading-none tracking-tight text-foreground sm:text-8xl">
                40
              </span>
              <span className="mb-2 text-5xl font-semibold leading-none tracking-tight text-primary sm:text-6xl">
                +
              </span>
            </div>
            <h2 className="mt-6 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Drivers who live on one lane.
            </h2>
            <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
              Our own drivers run strictly transcontinental — East Coast and Midwest to
              California and back. Same trucks, same people, every round trip. No lane
              roulette, no rotating carriers on your freight.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-xl border border-border bg-border">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1 bg-card p-6">
                <dt className="text-2xl font-semibold tracking-tight text-foreground">
                  {stat.value}
                </dt>
                <dd className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
          {points.map((point) => (
            <div key={point.title} className="flex flex-col bg-card p-6 sm:p-8">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                {point.title}
              </h3>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                {point.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
