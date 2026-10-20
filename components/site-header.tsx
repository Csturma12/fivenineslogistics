"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { FiveNinesForged } from "@/components/five-nines-forged";
import { FiveNinesMark } from "@/components/five-nines-mark";
import { FiveNinesFlatbedMark } from "@/components/five-nines-flatbed-mark";
import { useRequestCapacity } from "@/components/request-capacity-panel";
import { site } from "@/lib/site";
const links = [
  { href: "/who-we-serve", label: "Who We Serve" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/request-documents", label: "Compliance & Onboarding" },
  { href: "/work-with-us", label: "Work With Us" },
];
const portalLinks = [
  {
    href: "/portal/customer",
    label: "Shipper Portal",
    sub: "Live freight, quotes & compliance docs",
    kind: "shipper" as const,
  },
  {
    href: "/portal",
    label: "Carrier Portal",
    sub: "Highway setup, load board & lane bids",
    kind: "carrier" as const,
  },
];
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const openedByHoverRef = useRef(false);
  const { openPanel } = useRequestCapacity();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        openedByHoverRef.current = false;
        setPortalOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        const hadFocusInside =
          dropdownRef.current?.contains(document.activeElement) ?? false;
        openedByHoverRef.current = false;
        setPortalOpen(false);
        if (hadFocusInside) {
          triggerRef.current?.focus();
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

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
            <div
              ref={dropdownRef}
              className="portal-dropdown"
              onMouseEnter={() => {
                if (!portalOpen) openedByHoverRef.current = true;
                setPortalOpen(true);
              }}
              onMouseLeave={() => {
                openedByHoverRef.current = false;
                setPortalOpen(false);
              }}
            >
              <button
                ref={triggerRef}
                type="button"
                className="portal-dropdown__trigger"
                aria-expanded={portalOpen}
                aria-haspopup="menu"
                onClick={() => {
                  if (openedByHoverRef.current) {
                    openedByHoverRef.current = false;
                    setPortalOpen(true);
                    return;
                  }
                  setPortalOpen((prev) => !prev);
                }}
              >
                Control Tower Portal
                <ChevronDown
                  size={15}
                  aria-hidden="true"
                  className={
                    portalOpen
                      ? "portal-dropdown__chevron is-open"
                      : "portal-dropdown__chevron"
                  }
                />
              </button>
              {portalOpen && (
                <div
                  role="menu"
                  aria-label="Control Tower Portal options"
                  className="portal-dropdown__menu"
                >
                  {portalLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      className="portal-dropdown__item"
                      onClick={() => {
                        openedByHoverRef.current = false;
                        setPortalOpen(false);
                      }}
                    >
                      <span className="portal-dropdown__icon" aria-hidden="true">
                        {item.kind === "shipper" ? (
                          <FiveNinesMark className="h-5 w-5" />
                        ) : (
                          <FiveNinesFlatbedMark className="h-5 w-5" />
                        )}
                      </span>
                      <span className="portal-dropdown__body">
                        <span className="portal-dropdown__title">
                          {item.label}
                          <ArrowUpRight size={14} aria-hidden="true" />
                        </span>
                        <span className="portal-dropdown__sub">{item.sub}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
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
            {portalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="mobile-nav__portal"
              >
                <span className="inline-flex items-center gap-2.5">
                  {item.kind === "shipper" ? (
                    <FiveNinesMark className="h-4 w-4 text-primary" />
                  ) : (
                    <FiveNinesFlatbedMark className="h-4 w-4 text-primary" />
                  )}
                  <span>Control Tower · {item.label}</span>
                </span>
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
