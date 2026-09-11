import { capacityBlocks, capacityIntro } from "@/lib/site"

export function Capacity() {
  return (
    <section id="capacity" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-primary">
            {capacityIntro.eyebrow}
          </span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {capacityIntro.heading}
          </h2>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-2">
          {capacityBlocks.map((block) => (
            <div key={block.title} className="flex flex-col bg-card p-6 sm:p-8">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">{block.title}</h3>
              <p className="mt-3 flex-1 text-pretty leading-relaxed text-muted-foreground">
                {block.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {block.partners.map((partner) => (
                  <span
                    key={partner}
                    className="rounded border border-border bg-background px-2.5 py-1 font-mono text-[11px] text-foreground/90"
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
