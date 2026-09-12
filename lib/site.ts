export const site = {
  name: "Five Nines Logistics",
  short: "5N",
  tagline: "Freight held to the standard your facility runs on.",
  domain: "fivenineslogistics.com",
  agentOf: "An agent of Primary Freight LLC",
  authority: "Primary Freight LLC",
  mc: "MC# 841023",
  // PLACEHOLDER — swap for the real USDOT number when available.
  usdot: "USDOT# pending",
  phone: "(205) 842-3755",
  phoneHref: "tel:+12058423755",
  // Verified from Primary Freight LLC ACORD 25 certificate (Cottingham & Butler), policy period 4/12/2026–4/12/2027.
  insurance: "$1M auto liability · $1M/$2M general liability · $4M umbrella · $150K contingent cargo",
  location: "Houston, TX",
  quotesEmail: "quotes@fivenineslogistics.com",
  dispatchEmail: "dispatch@fivenineslogistics.com",
  carriersEmail: "carriers@fivenineslogistics.com",
}

export type Mode = {
  name: string
  slug: string
  tier: "In-house" | "Partner network"
  description: string
  detail: string
  equipment: string[]
  typicalLoads: string[]
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
    slug: "flatbed",
    tier: "In-house",
    description: "Step deck, RGN, conestoga. Tarped, chained, and permitted when it needs to be.",
    detail:
      "Open-deck freight is where we started. We spec the right trailer for the dimensions and weight, secure it to standard, and permit the load when it runs over legal. Tarping, chaining, and dunnage are planned before the truck shows up, not figured out at the dock.",
    equipment: ["48' & 53' flatbed", "Step deck", "Double drop / RGN", "Conestoga", "Stretch & multi-axle"],
    typicalLoads: ["Structural steel & pipe", "Machinery & equipment", "Building materials", "Coils & plate"],
  },
  {
    name: "Expedited",
    slug: "expedited",
    tier: "In-house",
    description: "Team drivers, dedicated trucks, and an answer within the hour, day or night.",
    detail:
      "When the clock is the constraint, we run team drivers and dedicated equipment straight through. You get a committed pickup, a hard ETA, and a coordinator who calls you before you have to call us.",
    equipment: ["Sprinter & cargo van", "Straight truck", "Team-driver dry van", "Dedicated power"],
    typicalLoads: ["Line-down parts", "AOG & critical spares", "Turnaround freight", "Time-definite deliveries"],
  },
  {
    name: "Drayage",
    slug: "drayage",
    tier: "In-house",
    description: "Port of Houston and Gulf terminals. Chassis, LFD tracking, and demurrage avoidance.",
    detail:
      "We run containers in and out of the Port of Houston and Gulf terminals with our own dispatch discipline: chassis lined up, last-free-day tracked, and appointments booked so boxes move before demurrage and per-diem start stacking up.",
    equipment: ["20' & 40' chassis", "Tri-axle chassis", "Transload capacity", "Bonded moves"],
    typicalLoads: ["Import / export containers", "Transload to over-the-road", "Port-to-warehouse", "FCL drayage"],
  },
  {
    name: "Hotshot",
    slug: "hotshot",
    tier: "In-house",
    description: "Gooseneck and one-ton capacity across Texas and the Gulf for the part that can't wait.",
    detail:
      "One-ton and gooseneck capacity staged across Texas and the Gulf for the load that can't wait for a full truck. Fast to dispatch, cheaper than a full flatbed, and ideal for the single skid or piece of equipment holding up a job.",
    equipment: ["One-ton dually", "Gooseneck trailer", "40' hotshot deck", "Tilt-deck"],
    typicalLoads: ["Oilfield parts", "Single skids & pallets", "Small equipment", "Field-service freight"],
  },
  {
    name: "Box truck",
    slug: "box-truck",
    tier: "In-house",
    description: "Liftgate, inside delivery, and final-mile into live facilities.",
    detail:
      "Final-mile and inside delivery into live facilities where a 53' can't dock. Liftgate, pallet jack, and drivers who know a delivery into an occupied building is different from a warehouse drop.",
    equipment: ["26' box w/ liftgate", "Straight truck", "Pallet jack", "White-glove option"],
    typicalLoads: ["Inside deliveries", "Final-mile freight", "Live-site drops", "Retail & office"],
  },
  {
    name: "Oversize & heavy haul",
    slug: "oversize-heavy-haul",
    tier: "Partner network",
    description: "Permits, escorts, and route surveys for transformers, vessels, and modules.",
    detail:
      "Over-dimensional and superload freight, planned from the route backward. We handle state permits, pilot cars and police escorts, pole trucks, and route surveys for the moves where a bridge clearance or a turn radius decides the schedule.",
    equipment: ["Multi-axle RGN", "Perimeter / stretch", "Dual-lane & Goldhofer", "Beam & jeep"],
    typicalLoads: ["Transformers & switchgear", "Pressure vessels", "Modules & skids", "Turbines & generators"],
  },
  {
    name: "Ocean",
    slug: "ocean",
    tier: "Partner network",
    description: "FCL and LCL through the largest global carriers, with drayage on both ends.",
    detail:
      "FCL and LCL through the largest and most efficient global carriers, with drayage handled on both ends of the water. The same network that moves containers for global motorsport series and top e-commerce brands handles your freight.",
    equipment: ["FCL 20' / 40' / 40'HC", "LCL consolidation", "Breakbulk & RoRo", "Door-to-door drayage"],
    typicalLoads: ["Import / export ocean", "Project cargo", "Global container moves", "Port-to-door"],
  },
  {
    name: "LTL",
    slug: "ltl",
    tier: "Partner network",
    description:
      "Volume and standard LTL, plus flatbed LTL, with the carriers that still hit appointment times.",
    detail:
      "Standard, volume, and flatbed LTL routed through the carriers that still honor appointment windows. We class it right, book it right, and watch it through the terminal network so a partial doesn't get lost in transit.",
    equipment: ["Standard LTL", "Volume / partial", "Flatbed LTL", "Guaranteed & expedited LTL"],
    typicalLoads: ["Palletized freight", "Partial truckloads", "Volume LTL", "Open-deck partials"],
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
  { href: "/who-we-serve", label: "Who We Serve" },
  { href: "/modes", label: "Modes" },
  { href: "/carriers", label: "Carriers" },
  { href: "/company", label: "Company" },
]

export const footerLinks = [
  { href: "/who-we-serve", label: "Who We Serve" },
  { href: "/modes", label: "Modes" },
  { href: "/carriers", label: "Carriers" },
  { href: "/company", label: "Company" },
  { href: "/#method", label: "How We Run" },
  { href: "/#reliability", label: "Reliability" },
  { href: "/#network", label: "Network" },
  { href: "/request-capacity", label: "Request Capacity" },
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

/* ---------- Who We Serve page ---------- */

export const whoWeServePage = {
  eyebrow: "Who we serve",
  heading: "Freight for operations that measure downtime in dollars per minute.",
  intro:
    "Every shipper says their freight is important. The teams we work for can name the exact cost of a missed window, because it's already written into a commissioning schedule, a turnaround plan, or a launch date. That is the freight we're built for.",
  closing: {
    heading: "One tolerance for failure, whatever you move.",
    body: "We don't run a different playbook by industry. Whether it's a transformer for a data hall or a valve for a refinery turnaround, the same method of procedure, the same asset-first sourcing, and the same reporting apply to every load.",
  },
}

/* ---------- Company / About page ---------- */

export const companyPage = {
  eyebrow: "Company",
  heading: "We ran critical freight for years before we put a name on it.",
  intro:
    "Five Nines Logistics is the freight brand for operators who treat a delivery date the way an engineer treats uptime. We operate as an agent of Primary Freight LLC, with asset-based sister carriers on speed dial and a global partner network behind them.",
}

export type CompanyValue = {
  title: string
  body: string
}

export const companyStory: CompanyValue[] = [
  {
    title: "Where we come from",
    body: "Our team spent years dispatching flatbed, expedited, drayage, hotshot, and box-truck freight across Texas and the Gulf before this company had a name. Five Nines is that experience, organized around a single promise: the load arrives when we said it would.",
  },
  {
    title: "How we're structured",
    body: "We operate as an agent of Primary Freight LLC. That gives us two asset-based sister carriers, Just Drive Transportation and Primary Transportation, at the front of every dispatch decision, backed by a vetted partner network for the modes and lanes we don't run ourselves.",
  },
  {
    title: "Why 'five nines'",
    body: "99.999% uptime is the standard mission-critical facilities hold their own systems to. It's the standard your freight partner should meet too. We borrowed the language on purpose, and we report against it every month.",
  },
]

export type Credential = {
  label: string
  value: string
}

export const credentials: Credential[] = [
  { label: "Operating authority", value: "Primary Freight LLC" },
  { label: "MC number", value: "MC# 841023" },
  { label: "USDOT", value: "USDOT# pending" },
  { label: "Insurance", value: "$1M auto · $1M/$2M general · $4M umbrella · $150K contingent cargo" },
  { label: "Base of operations", value: "Houston, Texas" },
  { label: "Dispatch coverage", value: "24 hours, every day" },
]

/* ---------- Carriers / Haul for us page ---------- */

export const carriersPage = {
  eyebrow: "Carriers",
  heading: "Haul for Five Nines.",
  intro:
    "We move critical freight for shippers who don't tolerate surprises, which means we need carriers who run the same way. If you keep your equipment tight, your communication tighter, and you show up when you said you would, we want you on the bench.",
}

export type CarrierBenefit = {
  title: string
  body: string
}

export const carrierBenefits: CarrierBenefit[] = [
  {
    title: "Freight worth the deadhead",
    body: "We book asset carriers first and keep them loaded. Steady, planned freight on the lanes you already run, not a load board race to the bottom.",
  },
  {
    title: "Dispatch that answers",
    body: "One point of contact who picks up, day or night. No sitting on hold, no chasing a rate con, no guessing where your next load is coming from.",
  },
  {
    title: "Rates that respect the work",
    body: "Fair, up-front pricing for the service we ask for. When a load runs hot or takes extra handling, that's in the rate, not a fight after delivery.",
  },
  {
    title: "Quick pay & factoring-friendly",
    body: "We work with your factoring company and offer quick-pay options so you're not financing our freight while you wait on a check.",
  },
]

export const carrierRequirements: string[] = [
  "Active operating authority (MC/DOT) in good standing",
  "$1M auto liability & $100K cargo insurance minimum",
  "Satisfactory or unrated FMCSA safety rating",
  "ELD-compliant and able to send tracking / check calls",
  "W-9 and signed carrier packet on file before first load",
]

export const carrierPartners = {
  heading: "Partnerships are the point.",
  body: "Our best lanes run on carriers we've hauled with for years. Get on the bench once, prove you run clean, and you become a first call, not a last resort. That's how we've built every relationship that matters to this company.",
}
