import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MissionCriticalExecutions } from "@/components/mission-critical-executions";
import { RequestCapacityTrigger } from "@/components/request-capacity-trigger";
import { WorkWithUsTrigger } from "@/components/work-with-us-trigger";
import { site } from "@/lib/site";
import { DispatchBoard } from "./dispatch-board";
import "./preview-home.css";

export const metadata: Metadata = {
  title: "Homepage Preview | Five Nines Logistics",
  robots: { index: false, follow: false },
};

const badges = [
  "MC# 841023 / DOT# 2436508",
  "1-Hour Spot Quote SLA",
  "TWIC & Plant-PPE Verified",
  "Zero Double-Brokering",
  "24/7 Live Dispatch",
  "50 States + MX/CA",
  "BMC-84 Bonded",
  "Backed by Primary Freight",
];

const proof = [
  { value: "24/7", label: "Live human dispatch, nights and weekends included" },
  { value: "< 1 hr", label: "Spot quote turnaround, every request" },
  { value: "50 + 2", label: "All 50 states plus Mexico and Canada" },
  { value: "20+ yrs", label: "Plant-floor and North American logistics experience" },
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
    description: "White-label OOG transload, heavy haul and jobsite flatbed under blind BOLs.",
    href: "/who-we-serve#3pl-partners",
  },
];

const steps = [
  {
    title: "Define the requirement",
    description: "Share the lane, freight details and required delivery window. Our dispatch team is available 24/7.",
  },
  {
    title: "Receive a formal quote",
    description: "Within one hour, a priced plan covering equipment, permits and a verified carrier assignment.",
  },
  {
    title: "Managed through delivery",
    description: "Status updates at every milestone, with signed proof of delivery available in your portal.",
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
                Houston-based · 24/7 dispatch · Quotes in under an hour
              </p>
              <h1 id="pv-hero-title" className="pv-reveal">
                Critical freight,
                <br />
                <span className="pv-hero__accent">managed with precision</span>
                <span className="headline-stop">.</span>
              </h1>
              <p className="pv-hero__sub pv-reveal">
                Logistics support for data center, industrial and construction projects, and white-label
                services for 3PL partners, planned around your project schedule.
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
                24/7 dispatch <strong>{site.phone}</strong>
              </a>
            </div>
            <div className="pv-hero__board pv-reveal">
              <DispatchBoard />
            </div>
          </div>
          <div className="pv-marquee" aria-label="Operating credentials">
            <ul className="design-container pv-marquee__track">
              {badges.map((badge) => (
                <li key={badge}>{badge}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="pv-proof" aria-label="Five Nines at a glance">
          <div className="design-container pv-proof__grid">
            {proof.map((item) => (
              <div key={item.value}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
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

        <section className="pv-steps" aria-labelledby="pv-steps-title">
          <div className="design-container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Our process</p>
                <h2 id="pv-steps-title">
                  From initial request
                  <br />
                  to proof of delivery.
                </h2>
              </div>
              <p className="pv-standard-line">
                Five nines means <span>99.999%.</span> The standard we plan every shipment to.
              </p>
            </div>
            <ol className="pv-steps__list">
              {steps.map((step, index) => (
                <li key={step.title}>
                  <span className="pv-steps__index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <MissionCriticalExecutions />

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
              <p>Provide the freight details, lane and delivery window, and our team will prepare a complete transportation plan.</p>
            </div>
            <div className="pv-closing__actions">
              <RequestCapacityTrigger className="design-button pv-cta">
                Request capacity
                <ArrowUpRight size={20} aria-hidden="true" />
              </RequestCapacityTrigger>
              <a href={site.phoneHref}>{site.phone}</a>
              <span>Dispatch available 24 hours a day.</span>
            </div>
          </div>
        </section>

        <div className="carrier-strip design-container">
          <span>
            <strong>Carrier partnerships.</strong> Qualified carriers are invited to work with Five Nines.
          </span>
          <WorkWithUsTrigger className="text-link">
            Career opportunities
            <ArrowRight size={18} aria-hidden="true" />
          </WorkWithUsTrigger>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
