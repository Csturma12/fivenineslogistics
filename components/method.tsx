import { methodSteps, methodIntro } from "@/lib/site"

export function Method() {
  return (
    <section id="method" className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              {methodIntro.eyebrow}
            </span>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              {methodIntro.heading}
            </h2>
          </div>
          <p className="text-pretty leading-relaxed text-muted-foreground">{methodIntro.intro}</p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {methodSteps.map((step) => (
            <div key={step.n} className="flex flex-col gap-3 border-t-2 border-primary/70 pt-4">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {step.n}
              </span>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">{step.title}</h3>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
