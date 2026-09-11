import { ninesLadder, reliabilityStats } from "@/lib/site"

export function Reliability() {
  return (
    <section id="reliability" className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-wider text-primary">Reliability</span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            The math behind the name.
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            &ldquo;Five nines&rdquo; is SLA vocabulary borrowed from data-center uptime — 99.999%
            availability, the highest tier a system can commit to. We hold physical freight to
            the same standard: over a full year, that&apos;s just over five minutes where a load
            is unaccounted for.
          </p>
        </div>

        {/* Nines ladder */}
        <div className="mt-12 overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-3 gap-4 bg-card/60 px-5 py-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground sm:grid-cols-[1fr_1fr_1.4fr]">
            <span>Reliability</span>
            <span className="hidden sm:block">Tier</span>
            <span className="text-right sm:text-left">Unaccounted time / year</span>
          </div>
          {ninesLadder.map((row) => (
            <div
              key={row.level}
              className={`grid grid-cols-3 items-center gap-4 border-t border-border px-5 py-4 sm:grid-cols-[1fr_1fr_1.4fr] ${
                row.highlight ? "bg-primary/10" : ""
              }`}
            >
              <span
                className={`font-mono text-lg font-semibold ${row.highlight ? "text-primary" : "text-foreground"}`}
              >
                {row.level}
              </span>
              <span className="hidden text-sm text-muted-foreground sm:block">{row.tier}</span>
              <span
                className={`text-right text-sm sm:text-left ${row.highlight ? "font-medium text-foreground" : "text-muted-foreground"}`}
              >
                {row.downtimePerYear}
              </span>
            </div>
          ))}
        </div>

        {/* Stat row */}
        <dl className="mt-16 grid grid-cols-2 gap-8 border-t border-border pt-10 sm:grid-cols-4">
          {reliabilityStats.map((stat) => (
            <div key={stat.label}>
              <dt className="font-mono text-2xl font-semibold text-foreground sm:text-3xl">
                {stat.value}
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
