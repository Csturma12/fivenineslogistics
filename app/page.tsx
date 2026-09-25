import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { RequestCapacityTrigger } from "@/components/request-capacity-trigger";
import {
  ArrowRight,
  ArrowUpRight,
  Server,
  Factory,
  HardHat,
  Globe2,
  Ship,
  PackageCheck,
  Clock3,
  ShieldCheck,
  MoveUpRight,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CapabilityExplorer } from "@/components/capability-explorer";
import { FiveNinesStandard } from "@/components/five-nines-standard";
import { site } from "@/lib/site";
export const metadata: Metadata = {
  title:
    "Five Nines Logistics | Critical Freight. Every Handoff Accounted For.",
  description:
    "Freight coordination for data centers, plant maintenance, construction and international shippers. Houston-based expertise. Nationwide and global partner capacity. 24/7 dispatch.",
};
const sectors = [
  {
    number: "01",
    icon: Server,
    title: "Data centers",
    description:
      "Switchgear, generators and critical equipment. Delivery coordinated around your go-live.",
    label: "Built around the install window",
  },
  {
    number: "02",
    icon: Factory,
    title: "Plant maintenance",
    description:
      "Refractory, valves and line-down parts. Freight planned for the shutdown and the restart.",
    label: "The trade we came up in",
  },
  {
    number: "03",
    icon: HardHat,
    title: "Critical construction",
    description:
      "Steel, machinery and oversize loads. Site access, equipment and delivery sequence aligned.",
    label: "From fabrication to foundation",
  },
  {
    number: "04",
    icon: Globe2,
    title: "Global freight partners",
    description:
      "A domestic execution partner for international cargo. Port, transload and final mile connected.",
    label: "The local leg of a global move",
  },
];
export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="redesign-home">
        <section
          className="design-hero design-container"
          aria-labelledby="hero-title"
        >
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="brand-node" aria-hidden="true" />
              Inspired by 99.999% reliability
            </p>
            <h1 id="hero-title">
              Critical freight.
              <br />
              <span>Every handoff</span>
              <br />
              accounted for<span className="headline-stop">.</span>
            </h1>
            <p className="hero-description">
              When a delivery holds up an entire operation, you need more than a
              truck. You need a partner who understands what’s on the line.
              Inspired by the discipline behind always-on systems, we build
              every move around preparation, visibility and a team that stays
              accountable.
            </p>
            <div className="hero-actions">
              <RequestCapacityTrigger className="design-button">
                Plan your shipment
                <ArrowUpRight size={19} aria-hidden="true" />
              </RequestCapacityTrigger>
              <a href={site.phoneHref} className="text-link">
                Talk to dispatch
                <ArrowRight size={17} aria-hidden="true" />
              </a>
            </div>
            <p className="hero-support">
              Built for the freight that keeps critical work moving.
            </p>
            <div className="hero-note">
              <ShieldCheck size={18} aria-hidden="true" />
              <span>Plant-floor experience. One accountable team. Five Nines.</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="photo-frame">
              <Image
                src="/images/critical-freight.webp"
                alt="Illustration of a navy flatbed truck carrying industrial electrical equipment at a facility"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 48vw"
                className="hero-photo"
              />
              <div className="photo-shade" />
              <div className="photo-caption">
                <span className="eyebrow">Built for the work ahead</span>
                <strong>
                  From the port.
                  <br />
                  To the plant.
                  <br />
                  To the point of install.
                </strong>
              </div>
              <span className="photo-index">5N / FIELD OPERATIONS</span>
            </div>
            <div className="handoff-card">
              <div className="handoff-title">
                <span className="brand-node" aria-hidden="true" />
                <span>ONE COORDINATED MOVE</span>
                <MoveUpRight size={17} aria-hidden="true" />
              </div>
              <div className="handoff-track">
                <span>
                  <Ship size={19} aria-hidden="true" />
                  Port
                </span>
                <i />
                <span className="handoff-core">Five Nines</span>
                <i />
                <span>
                  <PackageCheck size={19} aria-hidden="true" />
                  Your site
                </span>
              </div>
              <p>The details stay connected. So does your team.</p>
            </div>
          </div>
        </section>
        <section className="operating-strip" aria-label="Operating reach">
          <div className="design-container operating-grid">
            <div>
              <strong>24/7</strong>
              <span>Dispatch access</span>
            </div>
            <div>
              <strong>50 states</strong>
              <span>Domestic coverage</span>
            </div>
            <div>
              <strong>MX + CA</strong>
              <span>Cross-border coordination</span>
            </div>
            <div>
              <strong>Global</strong>
              <span>Ocean & forwarding partners</span>
            </div>
          </div>
        </section>
        <FiveNinesStandard />
        <section
          className="design-section design-container"
          aria-labelledby="industries-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / Who we move for</p>
              <h2 id="industries-title">
                Your deadline is part
                <br />
                of a much bigger job.
              </h2>
            </div>
            <p>
              We move the equipment that keeps facilities running, projects
              advancing and commitments intact.
            </p>
          </div>
          <div className="sector-grid">
            {sectors.map((sector) => (
              <Link
                href="/who-we-serve"
                key={sector.number}
                className="sector-card"
              >
                <div className="sector-top">
                  <sector.icon strokeWidth={1.5} size={30} aria-hidden="true" />
                  <span>{sector.number}</span>
                </div>
                <h3>{sector.title}</h3>
                <p>{sector.description}</p>
                <div className="sector-bottom">
                  <span>{sector.label}</span>
                  <ArrowUpRight size={19} aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="experience-section">
          <div className="design-container experience-grid">
            <div>
              <p className="eyebrow">Plant-floor perspective</p>
              <h2>
                We knew the cost
                <br />
                of downtime before
                <br />
                we moved the freight.
              </h2>
            </div>
            <div className="experience-copy">
              <p>Our founder spent ten years in plant maintenance, specializing in refractory work, followed by ten years coordinating logistics across the lower 48, Alaska, Hawaii, Canada and Mexico.</p>
              <p>Today, we’re building on that experience with plans to bring aboard seasoned drivers our founder has worked with and trusts. Their knowledge from behind the wheel will strengthen how we plan each move, from equipment selection to the final delivery.</p>
              <Link href="/company" className="text-link">
                The story behind Five Nines
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
        <section
          className="design-section design-container"
          aria-labelledby="capabilities-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 / The right capacity</p>
              <h2 id="capabilities-title">
                Whatever the load.
                <br />
                Work the whole move.
              </h2>
            </div>
            <Link href="/modes" className="text-link">
              All modes & services
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <CapabilityExplorer />
        </section>
        <section className="process-section">
          <div className="design-container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">03 / How we work</p>
                <h2>Precision is in the preparation.</h2>
              </div>
              <p>
                A clear plan, the right capacity and communication that keeps
                you ahead of the next handoff.
              </p>
            </div>
            <div className="process-grid">
              <article>
                <span className="step-number">01</span>
                <h3>Start with the window.</h3>
                <p>
                  Delivery deadline, dimensions, value, site restrictions. We
                  get the constraints on the table before the truck is booked.
                </p>
              </article>
              <article>
                <span className="step-number">02</span>
                <h3>Connect the details.</h3>
                <p>
                  Equipment, carrier, permits and receiving team. Each handoff
                  is planned around the requirements of the load.
                </p>
              </article>
              <article>
                <span className="step-number">03</span>
                <h3>Stay with the move.</h3>
                <p>
                  One coordinator for updates, changing conditions and delivery
                  confirmation. A person to call when it matters.
                </p>
              </article>
            </div>
          </div>
        </section>
        <section
          id="network"
          className="design-section design-container network-section"
        >
          <div>
            <p className="eyebrow">04 / Reach without the runaround</p>
            <h2>
              Houston roots.
              <br />
              <span>Global connections.</span>
            </h2>
            <p className="section-description">
              Domestic trucking, cross-border moves and ocean freight through
              established partners. We connect the international shipment to the
              work happening on the ground.
            </p>
            <Link href="/modes#ocean" className="text-link">
              Explore our capabilities
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="reach-panel">
            <div className="reach-row">
              <span className="reach-code">US</span>
              <div>
                <h3>Nationwide</h3>
                <p>All 50 states · Specialized and general freight</p>
              </div>
              <ArrowUpRight aria-hidden="true" size={19} />
            </div>
            <div className="reach-row">
              <span className="reach-code">NA</span>
              <div>
                <h3>Across both borders</h3>
                <p>Mexico & Canada · Coordinated handoffs</p>
              </div>
              <ArrowUpRight aria-hidden="true" size={19} />
            </div>
            <div className="reach-row">
              <span className="reach-code">
                <Globe2 aria-hidden="true" />
              </span>
              <div>
                <h3>International</h3>
                <p>Ocean partners · Port-to-door execution</p>
              </div>
              <ArrowUpRight aria-hidden="true" size={19} />
            </div>
            <div className="reach-footer">
              <Clock3 size={16} aria-hidden="true" />
              One point of contact across every leg.
            </div>
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
              <p>
                Give us the load, the lane and the delivery window.
                <br />
                We’ll work through the rest with you.
              </p>
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
            <strong>Good carriers. Strong relationships.</strong> Run with Five
            Nines.
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
