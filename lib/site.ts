export const site = {
  name: "Five Nines Logistics",
  short: "5N",
  tagline: "Freight held to the standard your facility runs on.",
  domain: "fivenineslogistics.com",
  agentOf: "An agent of Primary Freight LLC",
  authority: "Primary Freight LLC",
  mc: "MC# 841023",
  location: "Houston, TX",
  quotesEmail: "quotes@fivenineslogistics.com",
  dispatchEmail: "dispatch@fivenineslogistics.com",
}

export type Mode = {
  name: string
  tier: "Core" | "Full service"
  description: string
}

export const modesIntro = {
  eyebrow: "Modes",
  heading: "Deep in five. Capable across all of it.",
  intro:
    "Our team spent years running flatbed, expedited, drayage, hotshot, and box truck freight before this company had a name. Everything else we handle through partners we've moved thousands of loads with.",
}

export const modes: Mode[] = [
  {
    name: "Flatbed",
    tier: "Core",
    description: "Step deck, RGN, conestoga. Tarped, chained, and permitted when it needs to be.",
  },
  {
    name: "Expedited",
    tier: "Core",
    description: "Team drivers, dedicated trucks, and an answer within the hour, day or night.",
  },
  {
    name: "Drayage",
    tier: "Core",
    description: "Port of Houston and Gulf terminals. Chassis, LFD tracking, and demurrage avoidance.",
  },
  {
    name: "Hotshot",
    tier: "Core",
    description: "Gooseneck and one-ton capacity across Texas and the Gulf for the part that can't wait.",
  },
  {
    name: "Box truck",
    tier: "Core",
    description: "Liftgate, inside delivery, and final-mile into live facilities.",
  },
  {
    name: "Oversize & heavy haul",
    tier: "Core",
    description: "Permits, escorts, and route surveys for transformers, vessels, and modules.",
  },
  {
    name: "Ocean",
    tier: "Core",
    description: "FCL and LCL through the largest global carriers, with drayage on both ends.",
  },
  {
    name: "LTL",
    tier: "Core",
    description:
      "Volume and standard LTL, plus flatbed LTL, with the carriers that still hit appointment times.",
  },
]

export type MethodStep = {
  n: string
  title: string
  description: string
}

export const methodIntro = {
  eyebrow: "How we run a critical load",
  heading: "The same four steps, every time.",
  intro:
    "Reliability isn't a promise. It's a procedure. This is what happens between your call and your dock.",
}

export const methodSteps: MethodStep[] = [
  {
    n: "STEP 1",
    title: "Plan",
    description:
      "We write a method of procedure for the move: dimensions, equipment, site access, crane windows, permits, and a fallback if the primary truck has a problem.",
  },
  {
    n: "STEP 2",
    title: "Source",
    description:
      "First call goes to our sister asset carriers, Just Drive Transportation and Primary Transportation. Then to a vetted bench we've run for years. No load boards for critical freight.",
  },
  {
    n: "STEP 3",
    title: "Track",
    description:
      "Live location on every load, check calls at every milestone, and a person who calls you before you have to call us.",
  },
  {
    n: "STEP 4",
    title: "Report",
    description:
      "On-time percentage, claims, and tender acceptance, monthly, unasked. You measure your facility in nines. Measure us the same way.",
  },
]

export type CapacityBlock = {
  title: string
  description: string
  partners: string[]
}

export const capacityIntro = {
  eyebrow: "Capacity",
  heading: "Assets we control. Partners we've proven.",
}

export const capacityBlocks: CapacityBlock[] = [
  {
    title: "Sister asset carriers",
    description:
      "Five Nines operates as an agent of Primary Freight LLC. That puts two asset-based carriers at the front of our dispatch list: Just Drive Transportation and Primary Transportation. When a load can't go to the open market, it doesn't.",
    partners: ["Just Drive Transportation", "Primary Transportation", "Primary Freight LLC"],
  },
  {
    title: "Global ocean & drayage",
    description:
      "Through partnerships with the largest and most efficient global shipping companies, our network moves containers for global motorsport series, athletic and retail brands, and the biggest names in e-commerce. The same lanes, terminals, and people handle your freight.",
    partners: ["Port of Houston", "Gulf Coast terminals", "Global ocean carriers"],
  },
]

export type NinesRow = {
  level: string
  downtimePerYear: string
  tier: string
  highlight?: boolean
}

export const ninesLadder: NinesRow[] = [
  { level: "99%", downtimePerYear: "3 days, 15 hours", tier: "Uncommitted freight" },
  { level: "99.9%", downtimePerYear: "8 hours, 45 minutes", tier: "Premium carriers" },
  { level: "99.99%", downtimePerYear: "52 minutes, 34 seconds", tier: "Managed logistics" },
  { level: "99.999%", downtimePerYear: "5 minutes, 15 seconds", tier: "Five Nines SLA", highlight: true },
]

export const reliabilityStats = [
  { value: "99.999%", label: "On-time arrival, trailing 90 days" },
  { value: "<1 hr", label: "Answer from dispatch, any hour" },
  { value: "24/7/365", label: "Control tower coverage" },
  { value: "0", label: "Missed SLA windows, this quarter" },
]

export type Lane = {
  id: string
  route: string
  status: "ON SCHEDULE" | "ARRIVING" | "MONITORING"
  eta: string
}

export const lanes: Lane[] = [
  { id: "LN-2291", route: "HOU → DFW", status: "ON SCHEDULE", eta: "ETA 14:20" },
  { id: "LN-1187", route: "HOU → BTR", status: "ON SCHEDULE", eta: "ETA 09:05" },
  { id: "LN-3402", route: "PORT → HOU", status: "ARRIVING", eta: "ETA 6 MIN" },
  { id: "LN-0876", route: "HOU → MID", status: "ON SCHEDULE", eta: "ETA 21:40" },
  { id: "LN-4519", route: "HOU → NOLA", status: "MONITORING", eta: "ETA 11:52" },
]

export const hubs = [
  { code: "HOU", city: "Houston" },
  { code: "DFW", city: "Dallas" },
  { code: "SAT", city: "San Antonio" },
  { code: "PORT", city: "Port of Houston" },
  { code: "BTR", city: "Baton Rouge" },
  { code: "NOLA", city: "New Orleans" },
  { code: "MID", city: "Midland" },
  { code: "MOB", city: "Mobile" },
]

export const heroSpec: { label: string; value: string }[] = [
  { label: "Base", value: "Houston, Texas" },
  { label: "Coverage", value: "48 states, Gulf ports, global ocean" },
  {
    label: "Core modes",
    value: "Flatbed · Expedited · Drayage · Hotshot · Box truck · Oversize · Ocean · LTL",
  },
  { label: "Authority", value: "Primary Freight LLC, MC# 841023" },
  { label: "Dispatch", value: "24 hours, every day" },
]

export const navLinks = [
  { href: "#who-we-serve", label: "Who We Serve" },
  { href: "#modes", label: "Modes" },
  { href: "#method", label: "How We Run" },
  { href: "#reliability", label: "Reliability" },
  { href: "#network", label: "Network" },
]

export const whoWeServe = {
  eyebrow: "Who we serve",
  heading: "The operations we serve. One tolerance for failure.",
  intro:
    "We don't chase every load. We work for the teams whose delivery date is written into a commissioning schedule, a shutdown window, or a go-live. These are a few of them — the standard is the same for every one.",
}

export type Sector = {
  code: string
  title: string
  description: string
  points: string[]
}

export const sectors: Sector[] = [
  {
    code: "Data centers",
    title: "Long-lead gear, delivered to the day",
    description:
      "Switchgear, generators, and transformers are ordered months out and installed in a window measured in hours. We stage, sequence, and deliver against your look-ahead, with a written method of procedure for every live-site drop.",
    points: [
      "Switchgear and PDUs",
      "Generators and UPS systems",
      "Transformers and busway",
      "Rack-and-stack inbound",
    ],
  },
  {
    code: "Oil and gas",
    title: "Turnaround and hotshot freight that shows up",
    description:
      "Ship Channel refineries, chemical plants, and field operations run on schedules with no slack. We move the part that keeps a unit down, and the flatbed loads that get a project restarted.",
    points: [
      "Turnaround and shutdown parts",
      "Valves, pumps, and rotating equipment",
      "Pipe, spools, and structural",
      "Same-day hotshot, any hour",
    ],
  },
  {
    code: "Mission-critical contractors",
    title: "Job-site freight for the builds that can't slip",
    description:
      "General and electrical contractors on hospital, utility, telecom, and industrial work get one point of contact, a plan for every delivery, and a straight answer when something moves.",
    points: [
      "Owner-furnished equipment (OFCI)",
      "Laydown-yard staging",
      "Oversize and permitted moves",
      "Crane-coordinated deliveries",
    ],
  },
]
