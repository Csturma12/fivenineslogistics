"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { FiveNinesForged } from "@/components/five-nines-forged";
import { site } from "@/lib/site";
const links = [
  { href: "/who-we-serve", label: "Who we serve" },
  { href: "/modes", label: "Capabilities" },
  { href: "/company", label: "Our company" },
  { href: "/carriers", label: "For carriers" },
];
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <a className="skip-link" href="#page-content">
        Skip to content
      </a>
      <div className="utility-bar">
        <div className="design-container utility-inner">
          <span>
            <i className="brand-node" aria-hidden="true" />
            Houston roots. Global reach.
          </span>
          <span className="utility-right">
            <a href={site.phoneHref}>
              24/7 dispatch{" "}
              <span className="utility-phone">· {site.phone}</span>
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            <Link href="/portal" className="utility-signin">
              Sign in
              <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
          </span>
        </div>
      </div>
      <header className="design-header">
        <div className="design-container header-inner">
          <Link
            href="/"
            className="brand-lockup"
            aria-label="Five Nines Logistics home"
          >
            <FiveNinesForged className="brand-mark" />
            <span className="brand-name">
              FIVE NINES<span>LOGISTICS</span>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="Primary">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link href="/portal" className="portal-link">
              Client portal
            </Link>
            <Link href="/request-capacity" className="design-button header-cta">
              Request capacity
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <button
              className="menu-toggle"
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
              >
                {link.label}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            ))}
            <Link href="/portal" onClick={() => setOpen(false)}>
              Sign in
            </Link>
            <Link href="/portal" onClick={() => setOpen(false)}>
              Client & carrier portal
            </Link>
            <Link href="/request-capacity" onClick={() => setOpen(false)}>
              Request capacity
            </Link>
          </nav>
        )}
      </header>
      <span id="page-content" tabIndex={-1} className="content-anchor" />
    </>
  );
}
