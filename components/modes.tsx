import { modes, modesIntro } from "@/lib/site"

export function Modes() {
  return (
    <section id="modes" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              {modesIntro.eyebrow}
            </span>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              {modesIntro.heading}
            </h2>
          </div>
          <p className="text-pretty leading-relaxed text-muted-foreground">{modesIntro.intro}</p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {modes.map((mode) => (
            <div key={mode.name} className="flex flex-col bg-card p-6">
              <span
                className={`font-mono text-[11px] uppercase tracking-wider ${
                  mode.tier === "Core" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {mode.tier}
              </span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
                {mode.name}
              </h3>
              <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                {mode.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
