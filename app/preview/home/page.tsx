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
    title: "Tell us the window",
    description: "Lane, freight and the hour it has to land. A real person answers, day or night.",
  },
  {
    title: "Quote in under an hour",
    description: "A priced plan with equipment, permits and a vetted carrier. No double-brokering, ever.",
  },
  {
    title: "Tracked to the dock",
    description: "Check calls at every handoff, and a POD in your portal the moment it delivers.",
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
                Critical freight.
                <br />
                <span className="pv-hero__accent">Every handoff</span> accounted for
                <span className="headline-stop">.</span>
              </h1>
              <p className="pv-hero__sub pv-reveal">
                Data center switchgear, refinery turnarounds and white-label 3PL moves, planned around
                your install window, not ours.
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
                Talk to dispatch now <strong>{site.phone}</strong>
              </a>
            </div>
            <div className="pv-hero__board pv-reveal">
              <DispatchBoard />
            </div>
          </div>
          <div className="pv-marquee" aria-label="Operating credentials">
            <ul className="pv-marquee__track">
              {[...badges, ...badges].map((badge, index) => (
                <li key={`${badge}-${index}`} aria-hidden={index >= badges.length || undefined}>
                  {badge}
                </li>
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
              <p className="eyebrow">Who we move for</p>
              <h2 id="pv-industries-title">
                Your deadline is part
                <br />
                of a much bigger job.
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
                    See how we move it
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
                <p className="eyebrow">How a move runs</p>
                <h2 id="pv-steps-title">
                  From first call
                  <br />
                  to signed POD.
                </h2>
              </div>
              <p className="pv-standard-line">
                Five nines means <span>the load shows up.</span> Every time.
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
              <p className="eyebrow">Let’s get to work</p>
              <h2 id="pv-closing-title">
                What needs to be there,
                <br />
                and when?
              </h2>
              <p>Give us the load, the lane and the delivery window. We’ll work through the rest with you.</p>
            </div>
            <div className="pv-closing__actions">
              <RequestCapacityTrigger className="design-button pv-cta">
                Request capacity
                <ArrowUpRight size={20} aria-hidden="true" />
              </RequestCapacityTrigger>
              <a href={site.phoneHref}>{site.phone}</a>
              <span>Dispatch, around the clock.</span>
            </div>
          </div>
        </section>

        <div className="carrier-strip design-container">
          <span>
            <strong>Good carriers. Strong relationships.</strong> Run with Five Nines.
          </span>
          <WorkWithUsTrigger className="text-link">
            Or join the team
            <ArrowRight size={18} aria-hidden="true" />
          </WorkWithUsTrigger>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
