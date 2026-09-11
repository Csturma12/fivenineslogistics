import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FiveNinesMark } from "@/components/five-nines-mark"
import { navLinks } from "@/lib/site"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Five Nines Logistics home">
          <FiveNinesMark className="h-8 w-8 shrink-0" />
          <span className="flex items-baseline gap-1.5 text-[15px] font-semibold tracking-tight text-foreground">
            FIVE NINES LOGISTICS
            <span className="hidden font-mono text-[10px] font-normal tracking-wider text-primary sm:inline">
              99.999%
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

        <Button
          render={<Link href="#request-capacity" />}
          nativeButton={false}
          size="sm"
          className="font-medium"
        >
          Request Capacity
        </Button>
      </div>
    </header>
  )
}
