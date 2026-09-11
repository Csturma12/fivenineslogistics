import Link from "next/link"
import { FiveNinesMark } from "@/components/five-nines-mark"
import { navLinks } from "@/lib/site"

export function SiteFooter() {
  return (
    <footer id="company" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5" aria-label="Five Nines home">
              <FiveNinesMark className="h-7 w-7 shrink-0" />
              <span className="text-sm font-semibold tracking-tight text-foreground">FIVE NINES</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Freight operations engineered to 99.999% reliability. Instrumented, monitored, and
              accountable to the SLA.
            </p>
          </div>

          <div className="flex flex-wrap gap-10 sm:gap-16">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Company
              </span>
              <ul className="mt-3 space-y-2 text-sm">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Contact
              </span>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="mailto:dispatch@fivenines.freight" className="hover:text-foreground">
                    dispatch@fivenines.freight
                  </a>
                </li>
                <li>Control tower: 24/7/365</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Five Nines Logistics. All rights reserved.</p>
          <p className="font-mono">99.999% ON-TIME · SLA-GRADE FREIGHT</p>
        </div>
      </div>
    </footer>
  )
}
