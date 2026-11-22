import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export type LegalSection = {
  id: string
  title: string
  body: React.ReactNode
}

export function LegalPage({
  eyebrow,
  title,
  effectiveDate,
  intro,
  sections,
  related,
}: {
  eyebrow: string
  title: string
  effectiveDate: string
  intro: React.ReactNode
  sections: LegalSection[]
  related: { href: string; label: string }
}) {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero-grid border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">{eyebrow}</span>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Effective {effectiveDate}
            </p>
            <div className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">{intro}</div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:gap-16">
            <nav aria-label="On this page" className="lg:w-64 lg:shrink-0">
              <div className="flex flex-col gap-2 lg:sticky lg:top-24">
                <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">On this page</h2>
                <ol className="flex flex-col gap-2 text-sm">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
                <Link href={related.href} className="mt-4 text-sm font-medium text-primary hover:underline">
                  {related.label}
                </Link>
              </div>
            </nav>

            <div className="flex max-w-3xl flex-col gap-12">
              {sections.map((section) => (
                <article key={section.id} id={section.id} className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">{section.title}</h2>
                  <div className="mt-4 flex flex-col gap-4 leading-relaxed text-muted-foreground">
                    {section.body}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
