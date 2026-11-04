import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RequestCapacityTrigger } from "@/components/request-capacity-trigger";
import { site } from "@/lib/site";
import "./preview-home.css";

export const metadata: Metadata = {
  title: "Homepage Preview | Five Nines Logistics",
  robots: { index: false, follow: false },
};

const credentials = [
  { label: "Broker authority", value: "Primary Freight LLC" },
  { label: "MC / DOT", value: "MC# 841023 · DOT# 2436508" },
  { label: "Surety bond", value: "BMC-84 held by Primary Freight LLC" },
  { label: "Base of operations", value: "Houston, Texas" },
];

const sectors = [
  {
    image: "/images/home/sector-data-center.png",
    title: "Data centers",
    description: "Switchgear, generators and critical equipment, delivered around your go-live.",
    href: "/who-we-serve",
  },
  {
    image: "/images/home/sector-plant.png",
    title: "Plant maintenance",
    description: "Refractory, valves and line-down parts, planned for the shutdown and the restart.",
    href: "/who-we-serve",
  },
  {
    image: "/images/home/sector-construction.png",
    title: "Critical construction",
    description: "Steel, machinery and oversize loads, sequenced to site access and crane time.",
    href: "/who-we-serve",
  },
  {
    image: "/images/home/sector-3pl.png",
    title: "3PLs & forwarders",
    description: "Domestic execution for OOG transload, heavy haul and jobsite flatbed moves.",
    href: "/who-we-serve#3pl-partners",
  },
];

const services = [
  { name: "Flatbed & open deck", detail: "Flatbed, step deck and RGN for equipment and materials." },
  { name: "Oversize & heavy haul", detail: "Permitted moves coordinated with escorts and site access." },
  { name: "Expedited & hotshot", detail: "Time-sensitive parts and line-down freight." },
  { name: "Drayage & transload", detail: "Port and rail moves through Gulf Coast gateways." },
  { name: "Dry van & LTL", detail: "Palletized and general freight to plants and job sites." },
  { name: "Warehousing", detail: "Staging and storage ahead of a scheduled install." },
];

const steps = [
  {
    title: "Request",
    description: "Share the lane, freight dimensions and the delivery window you are working toward.",
  },
  {
    title: "Plan",
    description: "We review equipment, permits and site requirements, then return a written quote.",
  },
  {
    title: "Dispatch",
    description: "Once approved, we assign a vetted carrier and confirm pickup and delivery details.",
  },
  {
    title: "Delivery",
    description: "Milestone updates through delivery, with paperwork returned when the move closes.",
  },
];

export default function HomePreviewPage() {
  return (
    <>
      <div className="preview-banner" role="note">
        Preview of the proposed homepage. Your live homepage is unchanged.
        <Link href="/">View current homepage</Link>
      </div>
      <SiteHeader />
      <main className="redesign-home">
        <section className="pv-hero" aria-labelledby="pv-hero-title">
          <Image
            src="/images/home/hero-switchgear-dusk.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="pv-hero__photo"
          />
          <div className="pv-hero__shade" aria-hidden="true" />
          <div className="design-container pv-hero__inner">
            <div className="pv-hero__copy">
              <p className="eyebrow pv-reveal">
                <span className="brand-node" aria-hidden="true" />
                Inspired by 99.999% reliability
              </p>
              <h1 id="pv-hero-title" className="pv-reveal">
                Critical freight.
                <br />
                <span className="pv-hero__accent">Every handoff accounted for</span>
                <span className="headline-stop">.</span>
              </h1>
              <p className="pv-hero__sub pv-reveal">
                Built for operations that measure downtime in dollars per minute. From data center
                switchgear and refinery turnarounds to white-label 3PL execution, we plan every move
                around hard install windows, the right equipment and clear accountability.
              </p>
              <div className="pv-hero__actions pv-reveal">
                <RequestCapacityTrigger className="design-button pv-cta">
                  Request Capacity
                  <ArrowUpRight size={19} aria-hidden="true" />
                </RequestCapacityTrigger>
                <Link href="/carriers" className="pv-button-ghost">
                  Haul With Us
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
              <a href={site.phoneHref} className="pv-hero__call pv-reveal">
                <Phone size={16} aria-hidden="true" />
                Dispatch <strong>{site.phone}</strong>
              </a>
            </div>
          </div>
        </section>

        <section className="pv-proof" aria-label="Authority and credentials">
          <dl className="design-container pv-proof__grid">
            {credentials.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
          <p className="design-container pv-proof__note">
            Five Nines Logistics operates as an agent of Primary Freight LLC. Customer freight is arranged
            under Primary Freight&apos;s broker authority, and the operating carrier is identified on the
            shipment documents.
          </p>
        </section>

        <section className="design-section design-container" aria-labelledby="pv-industries-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Industries served</p>
              <h2 id="pv-industries-title">
                Freight planned around
                <br />
                your project schedule.
              </h2>
            </div>
            <Link href="/who-we-serve" className="text-link">
              All industries
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="pv-sectors">
            {sectors.map((sector) => (
              <Link href={sector.href} key={sector.title} className="pv-sector">
                <Image
                  src={sector.image}
                  alt=""
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 25vw"
                  className="pv-sector__photo"
                />
                <div className="pv-sector__body">
                  <h3>{sector.title}</h3>
                  <p>{sector.description}</p>
                  <span className="pv-sector__link">
                    Learn more
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="pv-services" aria-labelledby="pv-services-title">
          <div className="design-container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Capabilities</p>
                <h2 id="pv-services-title">
                  Equipment and services
                  <br />
                  matched to the freight.
                </h2>
              </div>
              <Link href="/capabilities" className="text-link">
                Full capabilities
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <ul className="pv-services__list">
              {services.map((service) => (
                <li key={service.name}>
                  <h3>{service.name}</h3>
                  <p>{service.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="pv-steps" aria-labelledby="pv-steps-title">
          <div className="design-container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">How it works</p>
                <h2 id="pv-steps-title">
                  From request
                  <br />
                  to delivery.
                </h2>
              </div>
            </div>
            <ol className="pv-steps__list">
              {steps.map((step) => (
                <li key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="pv-people design-container" aria-labelledby="pv-people-title">
          <div>
            <p className="eyebrow">Our team</p>
            <h2 id="pv-people-title">
              Plant-floor experience.
              <br />
              Freight handled with accountability.
            </h2>
          </div>
          <div className="pv-people__body">
            <p>
              Our team knows both sides of the delivery: the work inside the facility and the freight that
              supports it. Get to know the people behind Five Nines.
            </p>
            <Link href="/company/crew" className="text-link">
              Meet our crew
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="pv-closing" aria-labelledby="pv-closing-title">
          <Image
            src="/images/home/sector-construction.png"
            alt=""
            fill
            sizes="100vw"
            className="pv-closing__photo"
          />
          <div className="pv-closing__shade" aria-hidden="true" />
          <div className="design-container pv-closing__inner">
            <div>
              <p className="eyebrow">Request capacity</p>
              <h2 id="pv-closing-title">
                Plan your next
                <br />
                critical shipment.
              </h2>
              <p>Share the freight details, lane and delivery window, and our team will follow up with a plan and a quote.</p>
            </div>
            <div className="pv-closing__actions">
              <RequestCapacityTrigger className="design-button pv-cta">
                Request capacity
                <ArrowUpRight size={20} aria-hidden="true" />
              </RequestCapacityTrigger>
              <a href={site.phoneHref}>{site.phone}</a>
            </div>
          </div>
        </section>

        <div className="carrier-strip design-container">
          <span>
            <strong>Carrier partnerships.</strong> Qualified carriers are invited to haul with Five Nines.
          </span>
          <Link href="/carriers" className="text-link">
            Join our carrier network
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
