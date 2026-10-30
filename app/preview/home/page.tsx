import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Phone, Server, Factory, HardHat, Globe2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MissionCriticalExecutions } from "@/components/mission-critical-executions";
import { RequestCapacityTrigger } from "@/components/request-capacity-trigger";
import { WorkWithUsTrigger } from "@/components/work-with-us-trigger";
import { site } from "@/lib/site";
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
  "50 States + MX/CA",
];

const proof = [
  { value: "24/7", label: "Live human dispatch, nights and weekends included" },
  { value: "< 1 hr", label: "Spot quote turnaround, every request" },
  { value: "50 + 2", label: "All 50 states plus Mexico and Canada" },
  { value: "20+ yrs", label: "Plant-floor and North American logistics experience" },
];

const sectors = [
  {
    icon: Server,
    title: "Data centers",
    description: "Switchgear, generators and critical equipment, delivered around your go-live.",
    href: "/who-we-serve",
  },
  {
    icon: Factory,
    title: "Plant maintenance",
    description: "Refractory, valves and line-down parts, planned for the shutdown and the restart.",
    href: "/who-we-serve",
  },
  {
    icon: HardHat,
    title: "Critical construction",
    description: "Steel, machinery and oversize loads, sequenced to site access and crane time.",
    href: "/who-we-serve",
  },
  {
    icon: Globe2,
    title: "3PLs & forwarders",
    description: "White-label domestic execution: OOG transload, heavy haul and jobsite flatbed under blind BOLs.",
    href: "/who-we-serve#3pl-partners",
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
            src="/images/critical-freight.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="pv-hero__photo"
          />
          <div className="pv-hero__shade" aria-hidden="true" />
          <div className="design-container pv-hero__inner">
            <p className="eyebrow">
              <span className="brand-node" aria-hidden="true" />
              Houston-based · 24/7 dispatch · Quotes in under an hour
            </p>
            <h1 id="pv-hero-title">
              Critical freight. Every handoff accounted for
              <span className="headline-stop">.</span>
            </h1>
            <p className="pv-hero__sub">
              Data center switchgear, refinery turnarounds and white-label 3PL moves, planned around
              your install window, not ours.
            </p>
            <div className="pv-hero__actions">
              <RequestCapacityTrigger className="design-button">
                Request Capacity
                <ArrowUpRight size={19} aria-hidden="true" />
              </RequestCapacityTrigger>
              <Link href="/carriers" className="pv-button-ghost">
                Haul With Us
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a href={site.phoneHref} className="pv-hero__call">
                <Phone size={16} aria-hidden="true" />
                Talk to dispatch <strong>{site.phone}</strong>
              </a>
            </div>
            <ul className="pv-badges" aria-label="Operating credentials">
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

        <section className="design-container pv-standard" aria-label="The Five Nines standard">
          <p>
            Five nines means <span>the load shows up.</span> Every time.
          </p>
          <Link href="/company" className="text-link">
            What the name stands for
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
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
                <sector.icon strokeWidth={1.5} size={28} aria-hidden="true" />
                <h3>{sector.title}</h3>
                <p>{sector.description}</p>
                <span className="pv-sector__link">
                  See how we move it
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <MissionCriticalExecutions />

        <section className="design-section design-container" aria-labelledby="pv-quotes-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">What customers say</p>
              <h2 id="pv-quotes-title">Trusted when the window is tight.</h2>
            </div>
          </div>
          <div className="pv-quotes">
            {["Customer quote 1", "Customer quote 2", "Customer quote 3"].map((slot) => (
              <div key={slot} className="pv-quote-slot">
                <strong>{slot}</strong>
                Your real customer quote goes here, with a name and title such as &quot;Plant Manager,
                Gulf Coast refinery&quot;.
              </div>
            ))}
          </div>
        </section>

        <section className="closing-section">
          <div className="design-container closing-inner">
            <div>
              <p className="eyebrow">Let’s get to work</p>
              <h2>
                What needs to be
                <br />
                there, and when?
              </h2>
              <p>Give us the load, the lane and the delivery window. We’ll work through the rest with you.</p>
            </div>
            <div className="closing-actions">
              <RequestCapacityTrigger className="design-button">
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
