"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Truck, Ship, Zap, Warehouse } from "lucide-react";
const capabilities = [
  {
    id: "flatbed",
    name: "Open deck & heavy haul",
    short: "Built for the big stuff.",
    icon: Truck,
    text: "From a single machine to an oversized project load. Trailer selection, securement, permits and site access planned together.",
    tags: [
      "Flatbed & step deck",
      "Oversize & heavy haul",
      "Crane & rigging coordination",
    ],
    href: "/modes#flatbed",
    index: "01",
  },
  {
    id: "expedited",
    name: "Expedited & critical",
    short: "When the clock sets the route.",
    icon: Zap,
    text: "Critical spares, line-down components and time-definite deliveries. Dedicated options matched to the shipment and the deadline.",
    tags: [
      "Hotshot & sprinter vans",
      "Dedicated trucks",
      "Team-driver options",
    ],
    href: "/modes#expedited",
    index: "02",
  },
  {
    id: "ocean",
    name: "Ocean & drayage",
    short: "Connect the water to the work.",
    icon: Ship,
    text: "Ocean and forwarding partners connected with port, rail, transload and domestic transport. One coordinated path to the final destination.",
    tags: [
      "FCL, LCL & project cargo",
      "Port & rail drayage",
      "Cross-border coordination",
    ],
    href: "/modes#ocean",
    index: "03",
  },
  {
    id: "warehousing",
    name: "Storage & distribution",
    short: "Make room for the next move.",
    icon: Warehouse,
    text: "Receiving, staging and distribution through leased and partner facilities. Keep inventory and delivery schedules working together.",
    tags: [
      "Warehousing & project staging",
      "Transload & distribution",
      "Final-mile coordination",
    ],
    href: "/modes#warehousing",
    index: "04",
  },
];
export function CapabilityExplorer() {
  const [selected, setSelected] = useState(0);
  const current = capabilities[selected];
  return (
    <div className="capability-explorer">
      <div
        className="capability-options"
        role="group"
        aria-label="Explore freight capabilities"
      >
        {capabilities.map((item, index) => (
          <button
            key={item.id}
            aria-pressed={index === selected}
            aria-controls="capability-detail"
            onClick={() => setSelected(index)}
          >
            <span>{item.index}</span>
            {item.name}
            <ArrowUpRight size={18} aria-hidden="true" />
          </button>
        ))}
      </div>
      <div
        id="capability-detail"
        className="capability-detail"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="capability-detail-top">
          <current.icon size={40} strokeWidth={1.3} aria-hidden="true" />
          <span>{current.index} / 04</span>
        </div>
        <h3>{current.short}</h3>
        <p>{current.text}</p>
        <ul>
          {current.tags.map((tag) => (
            <li key={tag}>
              <Check size={16} aria-hidden="true" />
              {tag}
            </li>
          ))}
        </ul>
        <Link href={current.href} className="text-link">
          Explore this service
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
