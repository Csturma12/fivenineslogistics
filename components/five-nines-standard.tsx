import {
  ClipboardCheck,
  Headset,
  Radio,
  Route,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import styles from "./five-nines-standard.module.css";

const safeguards = [
  {
    icon: Headset,
    title: "People on call. Around the clock.",
    description:
      "24/7 dispatch, experienced coordination and clear escalation. A team that understands the load, the deadline and who needs to know when something changes.",
  },
  {
    icon: Radio,
    title: "Visibility that leads to action.",
    description:
      "Modern tracking and dispatch technology, milestone checks and proactive communication. Technology helps surface exceptions; people take ownership of the response.",
  },
  {
    icon: ShieldCheck,
    title: "Trust starts before the booking.",
    description:
      "Carrier and partner vetting built around identity, authority, insurance, safety and fit for the job. Experience and accountability matter at every handoff.",
  },
  {
    icon: Wrench,
    title: "Readiness before the road.",
    description:
      "The right equipment, not just an available truck. Our carrier standards emphasize routine preventive maintenance, pre-trip inspections and load-specific equipment readiness.",
  },
  {
    icon: ClipboardCheck,
    title: "Procedures that protect the plan.",
    description:
      "Pickup requirements, securement, site access, delivery windows and proof of delivery. Clear instructions and documented handoffs keep the details connected from start to finish.",
  },
  {
    icon: Route,
    title: "Every region. Always on call.",
    description:
      "Our asset trucks, vetted carriers and strategic partners form a nationwide network with someone on call in every region—24 hours a day, 7 days a week, 365 days a year. When plans change, our team coordinates the response to keep your freight moving.",
  },
] as const;

export function FiveNinesStandard() {
  return (
    <section
      id="why-five-nines"
      className={styles.section}
      aria-labelledby="five-nines-title"
    >
      <div className="design-container">
        <div className={styles.intro}>
          <div className={styles.story}>
            <p className="eyebrow">
              <span className="brand-node" aria-hidden="true" />
              Why Five Nines?
            </p>
            <h2 id="five-nines-title">
              Reliability is designed in.
              <br />
              Not left to chance.
            </h2>
            <p>
              In cloud computing, “five nines” means 99.999% availability. That
              level of reliability is built through monitoring, maintenance,
              disciplined procedures and redundancy.
            </p>
            <p>
              Freight moves through a different world, but the principle holds:
              prepare thoroughly, stay connected and have a plan when conditions
              change. We bring that mindset to the people, equipment and decisions
              behind your shipment.
            </p>
          </div>
          <aside className={styles.math} aria-label="The math behind the name">
            <span className={styles.mathLabel}>The cloud-computing benchmark</span>
            <strong className={styles.number}>99.999<span>%</span></strong>
            <span className={styles.availability}>availability</span>
            <div className={styles.equation}>
              <span>0.001% downtime over a 365-day year</span>
              <strong>≈ 5 minutes, 15 seconds</strong>
            </div>
            <p>
              The number inspires our operating discipline. It is not a measured
              shipment-performance rate or a delivery guarantee.
            </p>
            <a href="https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/availability.html">
              About availability in cloud computing ↗
            </a>
          </aside>
        </div>
        <div className={styles.grid}>
          {safeguards.map(({ icon: Icon, title, description }) => (
            <article className={styles.safeguard} key={title}>
              <Icon size={25} strokeWidth={1.5} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
        <p className={styles.closing}>
          The goal is simple: protect your delivery window—and the work depending
          on it.
        </p>
      </div>
    </section>
  );
}
