import Link from "next/link"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FiveNinesMark } from "@/components/five-nines-mark"
import { StatusTicker } from "@/components/status-ticker"
import { navLinks, site } from "@/lib/site"

export function SiteHeader() {
  return (
    <>
      <StatusTicker />
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Five Nines Logistics home">
          <FiveNinesMark className="h-8 w-8 shrink-0" />
          <span className="flex flex-col leading-tight">
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
              FIVE NINES LOGISTICS
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:inline">
              {site.agentOf}, {site.location}
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={site.phoneHref}
            className="hidden items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground lg:flex"
          >
            <Phone className="size-3.5" />
            {site.phone}
          </a>
          <Button
            render={<Link href="/request-capacity" />}
            nativeButton={false}
            size="sm"
            className="font-medium"
          >
            Request Capacity
          </Button>
        </div>
        </div>
      </header>
    </>
  )
}
