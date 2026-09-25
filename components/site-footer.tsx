import Link from "next/link";
import Image from "next/image";
import { FiveNinesForged } from "@/components/five-nines-forged";
import { RequestCapacityTrigger } from "@/components/request-capacity-trigger";
import { site } from "@/lib/site";
const groups = [
  {
    label: "Capabilities",
    links: [
      { href: "/modes", label: "Modes & equipment" },
      { href: "/consulting", label: "Supply chain consulting" },
      { href: "/request-capacity", label: "Request capacity", panel: true },
    ],
  },
  {
    label: "Five Nines",
    links: [
      { href: "/company", label: "Our company" },
      { href: "/who-we-serve", label: "Who we serve" },
      { href: "/growth", label: "Our growth" },
      { href: "/work-with-us", label: "Work with us" },
    ],
  },
  {
    label: "Partners",
    links: [
      { href: "/carriers", label: "Haul with us" },
      { href: "/portal", label: "Customer & carrier portal" },
      { href: "/portal/customer#documents", label: "Request documents" },
    ],
  },
];
export function SiteFooter() {
  return (
    <footer className="design-footer">
      <div className="design-container">
        <div className="footer-grid">
          <div className="footer-brand">
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
            <p>
              Critical freight. Clear communication.
              <br />
              From Houston to wherever the job takes us.
            </p>
            <a href={`mailto:${site.dispatchEmail}`}>{site.dispatchEmail}</a>
            <a href={site.phoneHref}>{site.phone}</a>
          </div>
          <nav className="footer-nav" aria-label="Footer">
            {groups.map((group) => (
              <div className="footer-links" key={group.label}>
                <h2>{group.label}</h2>
                {group.links.map((link) =>
                  "panel" in link && link.panel ? (
                    <RequestCapacityTrigger key={link.href} className="footer-link-button">
                      {link.label}
                    </RequestCapacityTrigger>
                  ) : (
                    <Link key={link.href} href={link.href}>
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            ))}
          </nav>
          <div className="footer-authority">
            <span className="footer-authority__label">Mission critical agency of Primary Freight</span>
            <Image
              src="/primary-freight-logo.png"
              alt="Primary Freight, LLC"
              width={200}
              height={124}
              className="footer-authority__logo"
            />
          </div>
        </div>
        <div className="footer-legal">
          <p>
            Five Nines Logistics is a 3PL and freight brokerage operating
            as an agent of Primary Freight LLC, MC# 841023. Capacity may be
            owned, affiliated, or provided through vetted carrier and facility
            partners. The applicable operating provider is identified in
            shipment documentation.
          </p>
          <div>
            <span>
              © {new Date().getFullYear()} Five Nines Logistics · Houston, Texas
            </span>
            <span>Authority & insurance documents available on request.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
