"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { FiveNinesForged } from "@/components/five-nines-forged";
import { useRequestCapacity } from "@/components/request-capacity-panel";
import { site } from "@/lib/site";
const links = [
  { href: "/who-we-serve", label: "Who We Serve" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/request-documents", label: "Compliance & Onboarding" },
  { href: "/work-with-us", label: "Work With Us" },
  { href: "/portal", label: "Control Tower Portal" },
];
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { openPanel } = useRequestCapacity();
  return (
    <>
      <a className="skip-link" href="#page-content">
        Skip to content
      </a>
      <div className="utility-bar">
        <div className="design-container utility-inner">
          <span className="utility-left">
            <span className="utility-standard">
              <i className="brand-node" aria-hidden="true" />
              99.999% Operating Standard
            </span>
            <span className="utility-reach">
              Houston Roots · Global Reach · {site.mc}
            </span>
          </span>
          <span className="utility-right">
            <a href={site.phoneHref}>
              24/7 Live Dispatch:{" "}
              <span className="utility-phone">{site.phone}</span>
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            <a href={`mailto:${site.dispatchEmail}`} className="utility-signin">
              {site.dispatchEmail}
            </a>
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
            <button
              type="button"
              onClick={openPanel}
              className="design-button header-cta"
            >
              Request Capacity
              <ArrowUpRight size={16} aria-hidden="true" />
            </button>
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
            <a href={site.phoneHref} onClick={() => setOpen(false)}>
              24/7 Live Dispatch: {site.phone}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a href={`mailto:${site.dispatchEmail}`} onClick={() => setOpen(false)}>
              {site.dispatchEmail}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <button
              type="button"
              className="design-button"
              onClick={() => {
                setOpen(false);
                openPanel();
              }}
            >
              Request Capacity
            </button>
          </nav>
        )}
      </header>
      <span id="page-content" tabIndex={-1} className="content-anchor" />
    </>
  );
}
