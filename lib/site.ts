export const site = {
  name: "Five Nines Logistics",
  short: "5N",
  tagline: "Reliability measured to five nines.",
  domain: "fivenineslogistics.com",
}

export type Service = {
  code: string
  title: string
  description: string
  metricLabel: string
  metricValue: string
}

export const services: Service[] = [
  {
    code: "FTL",
    title: "Full Truckload",
    description:
      "Dry van and reefer capacity dispatched from a vetted carrier network and monitored dock to dock, not just tendered and forgotten.",
    metricLabel: "TRANSIT VARIANCE",
    metricValue: "±4 MIN",
  },
  {
    code: "INT",
    title: "Drayage & Intermodal",
    description:
      "Port and rail drayage timed to vessel and rail windows, with appointment tracking that catches slippage before it becomes a miss.",
    metricLabel: "APPOINTMENT HIT RATE",
    metricValue: "98.9%",
  },
  {
    code: "EXP",
    title: "Expedited",
    description:
      "Hot-shot and team-driver dispatch for zero-slack freight, held to the same five-nines SLA as every other lane on the network.",
    metricLabel: "DISPATCH RESPONSE",
    metricValue: "<30 MIN",
  },
  {
    code: "WHC",
    title: "Warehousing & Cross-Dock",
    description:
      "Monitored dock-to-dock transfer and short-term storage with the same instrumentation that governs our line-haul network.",
    metricLabel: "INVENTORY ACCURACY",
    metricValue: "99.98%",
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
  { value: "<5 min", label: "Average dispatch response" },
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
  { id: "LN-2291", route: "CHI → DAL", status: "ON SCHEDULE", eta: "ETA 14:20" },
  { id: "LN-1187", route: "ATL → MIA", status: "ON SCHEDULE", eta: "ETA 09:05" },
  { id: "LN-3402", route: "LAX → PHX", status: "ARRIVING", eta: "ETA 6 MIN" },
  { id: "LN-0876", route: "SEA → DEN", status: "ON SCHEDULE", eta: "ETA 21:40" },
  { id: "LN-4519", route: "EWR → BOS", status: "MONITORING", eta: "ETA 11:52" },
]

export const hubs = [
  { code: "ORD", city: "Chicago" },
  { code: "DFW", city: "Dallas" },
  { code: "ATL", city: "Atlanta" },
  { code: "LAX", city: "Los Angeles" },
  { code: "EWR", city: "Newark" },
  { code: "SEA", city: "Seattle" },
  { code: "MIA", city: "Miami" },
  { code: "DEN", city: "Denver" },
]

export const navLinks = [
  { href: "#who-we-serve", label: "Who We Serve" },
  { href: "#network", label: "Network" },
  { href: "#services", label: "Services" },
  { href: "#reliability", label: "Reliability" },
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
