import Image from "next/image"
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

        <figure className="relative mt-12 overflow-hidden rounded-xl border border-border">
          <Image
            src="/images/long-haul.png"
            alt="A long-haul semi truck running an interstate at dusk"
            width={1600}
            height={720}
            className="h-48 w-full object-cover sm:h-64 lg:h-80"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
          <figcaption className="absolute bottom-0 left-0 p-5 sm:p-6">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              Long haul
            </span>
            <p className="mt-1 max-w-md text-pretty text-sm leading-relaxed text-white/90">
              48-state coverage on dedicated and one-way lanes — planned like it can&apos;t fail.
            </p>
          </figcaption>
        </figure>

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-2">
          {capacityBlocks.map((block) => (
            <div key={block.title} className="flex flex-col bg-card p-6 sm:p-8">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">{block.title}</h3>
              <p className="mt-3 flex-1 text-pretty leading-relaxed text-muted-foreground">
                {block.description}
              </p>
              {block.partners && block.partners.length > 0 ? (
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
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
