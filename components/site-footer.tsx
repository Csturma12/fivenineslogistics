import Link from "next/link"
import { FiveNinesMark } from "@/components/five-nines-mark"
import { footerLinks, site } from "@/lib/site"

export function SiteFooter() {
  return (
    <footer id="company" className="bg-navy text-navy-foreground">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5" aria-label="Five Nines Logistics home">
              <FiveNinesMark className="h-7 w-7 shrink-0" />
              <span className="text-sm font-semibold tracking-tight text-navy-foreground">FIVE NINES LOGISTICS</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-navy-foreground/70">
              Five Nines operates as the mission-critical agency of Primary Freight LLC. Backed by
              assets and tier-five partners, we run on the same clock our customers do — 24/7/365.
              When a load can&apos;t go to the open market, it doesn&apos;t. Built around the 99.999%
              availability standard: every load planned like it can&apos;t fail — because for our
              customers, it can&apos;t.
            </p>
          </div>

          <div className="flex flex-wrap gap-10 sm:gap-16">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-navy-foreground/60">
                Company
              </span>
              <ul className="mt-3 space-y-2 text-sm">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-navy-foreground/70 hover:text-navy-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-navy-foreground/60">
                Contact
              </span>
              <ul className="mt-3 space-y-2 text-sm text-navy-foreground/70">
                <li>
                  <a href={site.phoneHref} className="font-mono hover:text-navy-foreground">
                    {site.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.dispatchEmail}`} className="hover:text-navy-foreground">
                    {site.dispatchEmail}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.carriersEmail}`} className="hover:text-navy-foreground">
                    {site.carriersEmail}
                  </a>
                </li>
                <li>Control tower: 24/7/365</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-navy-foreground/60 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1 font-mono">
            <span>© {new Date().getFullYear()} Five Nines Logistics · Houston, Texas</span>
            <span>An agent of Primary Freight LLC · Brillion, WI · MC# 841023</span>
          </div>
          <p className="font-mono text-navy-foreground/80">99.999% is a standard, not a slogan.</p>
        </div>
      </div>
    </footer>
  )
}
