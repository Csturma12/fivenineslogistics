export const site = {
  name: "Five Nines Logistics",
  short: "5N",
  tagline: "Freight held to the standard your facility runs on.",
  domain: "fivenineslogistics.com",
  agentOf: "An agent of Primary Freight LLC",
  authority: "Primary Freight LLC",
  mc: "MC# 841023",
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
  description: string
  detail: string
  equipment: string[]
  typicalLoads: string[]
}

export const modesIntro = {
  eyebrow: "Modes",
  heading: "One 3PL relationship. Nationwide and global reach.",
  intro:
    "Owned capacity, affiliated carriers, and a vetted nationwide and global network give us the reach to solve the whole shipment. Our relationships run both ways: partners extend enterprise capabilities to Five Nines, and we support them with freight and services outside their own coverage.",
}

export const modes: Mode[] = [
  {
    name: "Flatbed",
    slug: "flatbed",
    description: "Flatbed, step-deck, and expedited over-the-road container transport. Secured, permitted, and planned before pickup.",
    detail:
      "Open-deck freight is where we started. We match every load with the right flatbed, step-deck, Conestoga, or specialized trailer, then plan dimensions, securement, permits, dunnage, and site access before dispatch.",
    equipment: ["48' & 53' flatbed", "Step deck", "Double drop / RGN", "Conestoga", "Container securement"],
    typicalLoads: ["Structural steel & pipe", "Machinery & equipment", "Expedited loaded containers", "Coils & plate"],
  },
  {
    name: "Dry van",
    slug: "dry-van",
    description: "53' and 48' vans for general freight, palletized goods, furniture, and home goods.",
    detail:
      "Enclosed, weather-protected capacity for general commodities, palletized freight, furniture, and home goods. Our nationwide carrier relationships cover regular and one-way lanes, while Five Nines handles the fit: trailer requirements, securement, appointments, tracking, and exception management through one coordinator.",
    equipment: ["53' dry van", "48' dry van", "Air-ride suspension", "Logistics posts & load bars", "Blanket-wrap option"],
    typicalLoads: ["General & retail freight", "Palletized goods", "Furniture & home goods", "Packaged equipment"],
  },
  {
    name: "Expedited",
    slug: "expedited",
    description: "Team drivers, dedicated trucks, and an answer within the hour, day or night.",
    detail:
      "When the clock is the constraint, we secure the fastest qualified option: sprinter, straight truck, hotshot, team service, or dedicated truck. Five Nines owns the communication, milestone tracking, and recovery plan from pickup through delivery.",
    equipment: ["Sprinter & cargo van", "Straight truck", "Team-driver dry van", "Dedicated power"],
    typicalLoads: ["Line-down parts", "AOG & critical spares", "Turnaround freight", "Time-definite deliveries"],
  },
  {
    name: "Sprinter van",
    slug: "sprinter-van",
    description: "Dedicated, door-to-door capacity for urgent freight that needs to move now.",
    detail:
      "Sprinter vans give time-critical shipments a direct, right-sized option without waiting for scheduled LTL or paying for unused truck space. We coordinate exclusive-use service, rapid dispatch, proactive tracking, and delivery appointments from pickup through final handoff.",
    equipment: ["High-roof sprinter van", "Cargo van", "Dock-high straight truck access", "Exclusive-use capacity"],
    typicalLoads: ["AOG & line-down parts", "Critical components", "One to three pallets", "Trade show & event freight"],
  },
  {
    name: "Refrigerated trucking",
    slug: "refrigerated-trucking",
    description: "Temperature-controlled capacity for food, ingredients, pharmaceuticals, and sensitive freight.",
    detail:
      "Cold-chain freight demands more than a reefer set point. We coordinate pre-cooled equipment, temperature requirements, washouts, appointment timing, tracking, and contingency planning to protect sensitive products from pickup through delivery.",
    equipment: ["53' refrigerated trailer", "Multi-temperature reefer", "Refrigerated straight truck", "Temperature monitoring"],
    typicalLoads: ["Food & beverage", "Fresh & frozen goods", "Pharmaceutical products", "Temperature-sensitive materials"],
  },
  {
    name: "Drayage",
    slug: "drayage",
    description: "Port and rail coverage with chassis coordination, transload, and final-mile support.",
    detail:
      "We coordinate port, rail, chassis, transload, bonded, and final-mile service across our listed hubs and beyond. Appointments, last-free-day tracking, demurrage, and per-diem exposure stay under one Five Nines coordinator.",
    equipment: ["20' & 40' chassis", "Tri-axle chassis", "Transload capacity", "Bonded moves"],
    typicalLoads: ["Import / export containers", "Transload to over-the-road", "Port-to-warehouse", "FCL drayage"],
  },
  {
    name: "Hotshot",
    slug: "hotshot",
    description: "Gooseneck and one-ton capacity across Texas and the Gulf for the part that can't wait.",
    detail:
      "Fast hotshot capacity supports Texas, Gulf Coast, and nationwide lanes. It is a practical option for the single skid, urgent part, or smaller piece of equipment that does not need a full-size truck.",
    equipment: ["One-ton dually", "Gooseneck trailer", "40' hotshot deck", "Tilt-deck"],
    typicalLoads: ["Oilfield parts", "Single skids & pallets", "Small equipment", "Field-service freight"],
  },
  {
    name: "Box truck",
    slug: "box-truck",
    description: "Liftgate, inside delivery, and final-mile into live facilities.",
    detail:
      "We cover the work a 53-foot trailer cannot, including liftgate, pallet jack, inside delivery, appointments, and white-glove requirements for live facilities and customer-facing deliveries.",
    equipment: ["26' box w/ liftgate", "Straight truck", "Pallet jack", "White-glove option"],
    typicalLoads: ["Inside deliveries", "Final-mile freight", "Live-site drops", "Retail & office"],
  },
  {
    name: "Oversize & heavy haul",
    slug: "oversize-heavy-haul",
    description: "Permits, escorts, and route surveys for transformers, vessels, and modules.",
    detail:
      "Over-dimensional and superload freight moves through top-tier specialized carriers with the equipment, authority, and field experience for the job. Five Nines coordinates the carrier, state permits, escorts, route surveys, site requirements, and customer updates so the move is managed as one project rather than a stack of vendors.",
    equipment: ["Multi-axle RGN", "Perimeter / stretch", "Dual-lane & Goldhofer", "Beam & jeep"],
    typicalLoads: ["Transformers & switchgear", "Pressure vessels", "Modules & skids", "Turbines & generators"],
  },
  {
    name: "Crane & rigging",
    slug: "crane-rigging",
    description: "Lift planning, crane service, rigging crews, and machinery placement coordinated with transportation.",
    detail:
      "For freight that cannot simply be loaded or unloaded at a dock, we coordinate the crane, rigging crew, lift plan, site requirements, and transportation as one project. Every provider is matched to the load, location, schedule, and required certifications before mobilization.",
    equipment: ["Mobile & all-terrain cranes", "Boom trucks", "Forklifts & telehandlers", "Rigging, gantries & skates"],
    typicalLoads: ["Machinery installation", "Transformers & generators", "Industrial equipment", "Plant relocation projects"],
  },
  {
    name: "Ocean",
    slug: "ocean",
    description: "FCL and LCL through the largest global carriers, with drayage on both ends.",
    detail:
      "Global forwarding and carrier relationships extend FCL, LCL, breakbulk, RoRo, customs, and drayage capabilities beyond our domestic footprint. These are reciprocal operating relationships: partners bring enterprise reach and overseas execution to our customers, and Five Nines brings them domestic freight, specialized transportation, and support where their own service ends.",
    equipment: ["FCL 20' / 40' / 40'HC", "LCL consolidation", "Breakbulk & RoRo", "Door-to-door drayage"],
    typicalLoads: ["Import / export ocean", "Project cargo", "Global container moves", "Port-to-door"],
  },
  {
    name: "LTL",
    slug: "ltl",
    description:
      "Volume and standard LTL, plus flatbed LTL, with the carriers that still hit appointment times.",
    detail:
      "Nationwide LTL relationships cover standard, volume, expedited, and open-deck partials. We select the carrier for lane strength and service requirements, then manage classification, booking, appointments, tracking, and claims through one Five Nines contact.",
    equipment: ["Standard LTL", "Volume / partial", "Flatbed LTL", "Guaranteed & expedited LTL"],
    typicalLoads: ["Palletized freight", "Partial truckloads", "Volume LTL", "Open-deck partials"],
  },
]

export const warehousing = {
  eyebrow: "Warehousing & customs",
  heading: "Enterprise warehousing, managed as one 3PL service.",
  intro:
    "Our leased and partner facilities provide flexible space in key markets and across the country. Their enterprise systems, labor, and facility capabilities pair with our customer service, transportation coordination, and single point of accountability.",
  locations: [
    { city: "Charleston, SC", note: "East Coast port distribution" },
    { city: "Houston, TX", note: "Gulf gateway & project staging" },
    { city: "Savannah, GA", note: "Southeast import consolidation" },
    { city: "Los Angeles, CA", note: "West Coast port drayage & transload" },
    { city: "Indianapolis, IN", note: "Midwest inventory & distribution" },
    { city: "Harrisburg, PA", note: "Northeast corridor distribution" },
    { city: "Chicago, IL", note: "Midwest warehousing & transload" },
    { city: "Memphis, TN", note: "Mid-South warehousing & distribution" },
    { city: "Norfolk, VA", note: "Port warehousing & final-mile staging" },
    { city: "Brillion, WI", note: "Northeast Wisconsin warehousing" },
  ],
  capabilities: [
    {
      title: "Contract warehousing & inventory management",
      body: "Leased and third-party space for receiving, put-away, inventory management, transload, fulfillment, and outbound staging. Top-tier providers extend enterprise facility and systems capabilities to us; we bring coordinated transportation, responsive customer service, and business outside their core lanes or service mix.",
    },
    {
      title: "In-bond trucking",
      body: "We move freight in-bond under CBP bond, so imported cargo can travel from port to an inland destination or bonded facility before it clears — keeping boxes off demurrage without rushing clearance.",
    },
    {
      title: "Customs clearance",
      body: "Partnered with a licensed customs broker to handle entry, duties, and clearance on both borders, so drayage, warehousing, and the paperwork all run under one coordinator instead of three.",
    },
  ],
}

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
      "We match the load with the right capacity based on lane, equipment, service history, availability, and customer requirements.",
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
  partners?: string[]
}

export const capacityIntro = {
  eyebrow: "Capacity",
  heading: "Established capacity. Nationwide and global reach.",
}

export const capacityBlocks: CapacityBlock[] = [
  {
    title: "Owned & affiliated capacity",
    description:
      "Owned equipment and roughly 40 trucks and trailers available through long-standing affiliated relationships give us dependable core capacity across repeat lanes.",
    partners: ["Long-standing carriers", "Repeat lanes", "Known operators"],
  },
  {
    title: "Specialty & network capacity",
    description:
      "Vetted nationwide and global partners extend coverage into drayage, heavy haul, LTL, ocean, warehousing, and one-way lanes, all managed through one Five Nines coordinator.",
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
  { value: "99.999%", label: "On-time arrival — the standard we run every load to" },
  { value: "<1 hr", label: "Answer from dispatch, any hour" },
  { value: "24/7/365", label: "Control tower coverage" },
  { value: "0", label: "Tolerance for a quietly missed window" },
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
  { code: "SEA", city: "Seattle" },
  { code: "LAX", city: "Los Angeles" },
  { code: "PHX", city: "Phoenix" },
  { code: "STR", city: "Santa Teresa" },
  { code: "MID", city: "Midland" },
  { code: "HSL", city: "Haslet" },
  { code: "DFW", city: "Dallas" },
  { code: "SAT", city: "San Antonio" },
  { code: "HOU", city: "Houston" },
  { code: "PORT", city: "Port of Houston" },
  { code: "BTR", city: "Baton Rouge" },
  { code: "NOLA", city: "New Orleans" },
  { code: "MOB", city: "Mobile" },
  { code: "MAR", city: "Marion" },
  { code: "BYH", city: "Blytheville" },
  { code: "MEM", city: "Memphis" },
  { code: "CHI", city: "Chicago" },
  { code: "SDF", city: "Louisville" },
  { code: "ORF", city: "Norfolk" },
  { code: "EWR", city: "Newark" },
]

export const heroSpec: { label: string; value: string }[] = [
  { label: "Base", value: "Houston, Texas" },
  { label: "Coverage", value: "50 states, cross-border Mexico & Canada, Gulf ports" },
  {
    label: "Core modes",
    value: "Flatbed · Dry van · Expedited · Drayage · Hotshot · Box truck · Oversize · Ocean · LTL",
  },
  { label: "Authority", value: "Primary Freight LLC, MC# 841023" },
  { label: "Insured", value: "Fully insured — COI on request" },
  { label: "Dispatch", value: "24 hours, every day" },
]

export const navLinks = [
  { href: "/who-we-serve", label: "Industries" },
  { href: "/modes", label: "Modes" },
  { href: "/loads", label: "Load Board" },
  { href: "/consulting", label: "Consulting" },
  { href: "/growth", label: "Watch Us Grow" },
  { href: "/company", label: "Company" },
]

export const footerLinks = [
  { href: "/who-we-serve", label: "Who We Serve" },
  { href: "/modes", label: "Modes" },
  { href: "/loads", label: "Load Board" },
  { href: "/carriers", label: "Carriers" },
  { href: "/company", label: "Who We Are" },
  { href: "/company#method", label: "How We Run" },
  { href: "/company#reliability", label: "Reliability" },
  { href: "/portal", label: "Portal" },
  { href: "/request-capacity", label: "Request Capacity" },
]

export const whoWeServe = {
  eyebrow: "Who we serve",
  heading: "The plants that build America. One tolerance for failure.",
  intro:
    "More than half of what we move is refractory, plant maintenance, and PFV — freight headed for a furnace, a unit, or a shutdown window that will not move. Data halls and job sites run on the same clock, so they get the same standard. These are a few of them.",
}

export type Sector = {
  code: string
  title: string
  description: string
  points: string[]
}

export const sectors: Sector[] = [
  {
    code: "Refractory & plant maintenance",
    title: "The turnaround trade we came up in",
    description:
      "This is the freight we've run for over a decade, from a decade before that spent doing the work inside the plants. Brick, castable, and precast shapes land inside a shutdown window that will not move — for the installers, manufacturers, distributors, and the demolition, fireproofing, rubber-lining, and corrosion crews who keep furnaces, boilers, and vessels lined and running.",
    points: [
      "Firebrick, castable & ramming mix",
      "Precast shapes & ceramic fiber",
      "Demolition tear-out & haul-off",
      "Fireproofing, rubber-lining & corrosion materials",
    ],
  },
  {
    code: "Pipe, fittings & valves (PFV)",
    title: "The flow-control supply chain that feeds the plant",
    description:
      "PFV is a major part of our book, and it runs on the same clock as the turnaround it feeds. Distributors, fabricators, and mills move carbon and alloy pipe, forged and flanged fittings, and manual and actuated valves into the yard before the crew needs them — spooled, coated, and staged in the sequence the job calls for, not dumped at the gate.",
    points: [
      "Carbon & alloy pipe, spools & structural",
      "Flanges, weld & forged fittings",
      "Gate, ball, check & actuated valves",
      "Coated, lined & mill-direct loads",
    ],
  },
  {
    code: "Data centers",
    title: "Expedited 24/7 across Texas and the Midwest",
    description:
      "Switchgear, generators, and transformers are ordered months out and installed in a window measured in hours. We run expedited hotshot and full-truckload freight to data center builds across Texas and the Midwest, day or night. When something has to be done right and delivered on time, we're the call you make.",
    points: [
      "24/7 hotshot, any hour",
      "Expedited FTL, Texas and the Midwest",
      "Switchgear, PDUs, and transformers",
      "Generators, UPS, and rack-and-stack",
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
  {
    code: "General freight",
    title: "Straightforward freight, handled the right way",
    description:
      "Not every load is tied to a shutdown. We move regular truckload and expedited freight with the same clear communication, equipment checks, and follow-through we bring to critical work.",
    points: [
      "Dry-van and palletized freight",
      "Flatbed and step-deck loads",
      "Hotshot, sprinter, and box truck",
      "Scheduled and expedited delivery",
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
    body: "Most of what we move ends up at the same place: a plant with a window that will not move. Refractory brick, a run of alloy pipe, a skid of valves, a transformer for a data hall — it's the same job to us. The same method of procedure, the same asset-first sourcing, and the same reporting apply to every load.",
  },
}

export type WhoWeServeInput = {
  label: string
  body: string
}

export const whoWeServeInputs = {
  eyebrow: "What makes a load hit",
  heading: "Give us these, and we plan backward from your window.",
  intro:
    "The gap between on-time and 'the truck is here but the crane already left' is information. On critical freight we ask for these up front, so the plan is built before the wheels turn.",
  items: [
    {
      label: "The real delivery window",
      body: "The appointment, commissioning slot, or turnaround window the load is written into — not just a calendar date. We schedule to the constraint that actually matters.",
    },
    {
      label: "Site access & contacts",
      body: "Gate hours, dock or laydown-yard location, security or escort requirements, and who signs on arrival. We confirm it before dispatch, not at the fence line.",
    },
    {
      label: "Handling at destination",
      body: "Crane, forklift, liftgate, or inside delivery — what's waiting when the truck backs in. The right equipment gets staged to the trailer we send.",
    },
    {
      label: "Dimensions & weight",
      body: "Real numbers up front, so we spec the trailer, routing, and permits before the load moves instead of discovering a problem on the shoulder.",
    },
  ] as WhoWeServeInput[],
}

/* ---------- Company / About page ---------- */

export const companyPage = {
  eyebrow: "Company",
  heading: "Over a decade moving critical freight. Now it has a name.",
  intro:
    "Five Nines Logistics is a 3PL and freight brokerage brand for operators who need straight answers and accountable execution. We operate as an agent of Primary Freight LLC, combining owned capacity, affiliated carriers, and vetted nationwide and global partners for specialty modes, facilities, and additional lanes.",
}

export const companyModel = {
  heading: "What 'agent of Primary Freight' means for your freight",
  body: "Your freight is arranged under Primary Freight's broker authority and insurance, with Five Nines handling the commercial relationship and daily coordination. Capacity may be owned, affiliated, or provided through our vetted carrier network, with the operating carrier identified on the shipment documents.",
}

export type CompanyValue = {
  title: string
  body: string
}

export const companyStory: CompanyValue[] = [
  {
    title: "Where we come from",
    body: "For over a decade, we've coordinated flatbed, expedited, drayage, hotshot, and box-truck freight across Texas and the Gulf. Five Nines brings that experience together under one name and one promise: the load arrives when we said it would. Our customers trust us because they know the service and transparency we provide.",
  },
  {
    title: "How we're structured",
    body: "We operate as an agent of Primary Freight LLC, which holds the broker authority used to arrange customer freight. Our Strategic Alliance gives us roughly 40 flatbeds and step decks from operators who have trusted us enough to dedicate capacity around our business for nearly 10 years, supported by a broader vetted network.",
  },
  {
    title: "Why 'five nines'",
    body: "99.999% uptime is the standard mission-critical facilities hold their own systems to. It's the standard your freight partner should meet too. We borrowed the language on purpose — it's the bar we hold every load to, and we'll report against it in the open.",
  },
]

export type Credential = {
  label: string
  value: string
}

export const credentials: Credential[] = [
  { label: "Model", value: "Freight brokerage & agency" },
  { label: "Broker authority", value: "Primary Freight LLC" },
  { label: "MC number", value: "MC# 841023" },
  { label: "Insurance", value: "Certificate of insurance available on request" },
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
