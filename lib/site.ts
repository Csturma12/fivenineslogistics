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
  { href: "/carrier-vetting", label: "Vetting" },
  { href: "/consulting", label: "Consulting" },
  { href: "/growth", label: "Watch Us Grow" },
  { href: "/company", label: "Company" },
]

export const footerLinks = [
  { href: "/who-we-serve", label: "Who We Serve" },
  { href: "/modes", label: "Modes" },
  { href: "/loads", label: "Load Board" },
  { href: "/carrier-vetting", label: "Vetting & Fraud Prevention" },
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
  heading: "Plant-floor roots. Logistics experience. A team built on trust.",
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
    body: "Our roots are on the plant floor. Our founder spent ten years in plant maintenance, specializing in refractory work, followed by ten years coordinating logistics across the lower 48, Alaska, Hawaii, Canada and Mexico.\n\nFive Nines brings that broad experience to a business with strong roots in Texas and the Gulf. We understand both sides of the delivery: doing the work inside the facility and coordinating the freight that supports it.\n\nNow we’re building that team further, with plans to bring aboard experienced drivers our founder has worked with and counts among the most reliable he’s known. Their firsthand knowledge of equipment, routes and delivery-site realities will help shape how we plan and execute each move.",
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

/* ---------- Carrier vetting & fraud prevention ---------- */

export const vettingPage = {
  eyebrow: "Vetting & fraud prevention",
  heading: "We know who's picking up your freight.",
  intro:
    "Freight fraud, double-brokering, and cargo theft are at record highs, and a stolen or re-brokered critical load isn't a claim — it's a missed turnaround window with a crew standing idle. We vet every carrier with Highway and multiple layers on top of it, but the layer that actually protects your freight is the oldest one: we know the people driving it.",
}

export const vettingSignature = {
  stat: "~75%",
  label: "of the drivers at your gate on a critical load are already known to us",
  heading: "We talk to the driver, the dispatcher, and the owner — before the load is assigned.",
  body: "On a critical load we don't hand your freight to a name on a rate confirmation. We speak to the person behind the wheel, the dispatcher moving them, and the owner who stands behind the truck. Roughly three out of four drivers who show up at your gate on a critical load are operators we've run with before — not a stranger pulled off a load board an hour ago.",
}

export type VettingLayer = {
  n: string
  title: string
  body: string
}

export const vettingLayers: VettingLayer[] = [
  {
    n: "01",
    title: "Highway carrier identity",
    body: "Every carrier is verified through Highway for real-time identity, authority, and fraud signals. It catches spoofed MC numbers, identity theft, and double-brokering fingerprints before a load is ever tendered — not after the freight is gone.",
  },
  {
    n: "02",
    title: "Authority & insurance, monitored continuously",
    body: "MC/DOT authority, operating status, safety rating, and active insurance with a current COI are checked at setup and monitored continuously. A lapse flags before we tender, not at the fence line.",
  },
  {
    n: "03",
    title: "Human verification on critical loads",
    body: "For freight headed into a shutdown window, a data hall, or a border crossing, we call the driver, the dispatcher, and the owner. We confirm the truck, the trailer, the ETA, and that the operator on the rate con is the operator picking up.",
  },
  {
    n: "04",
    title: "A known bench, not a spot-market gamble",
    body: "Roughly 40 affiliated trucks and a decade of repeat operators mean most critical loads move on capacity we already trust. New carriers earn critical freight — they don't start with it.",
  },
  {
    n: "05",
    title: "Fraud controls at dispatch",
    body: "No unverified reassignments, no last-minute swaps to an unknown carrier, no re-brokering. Documents and tender information are handled through controlled channels so your load can't be intercepted between booking and pickup.",
  },
]

export const vettingThreats = {
  heading: "What we're stopping before it reaches your dock.",
  items: [
    {
      title: "Double-brokering",
      body: "A broker or bad actor re-posts your load to an unvetted carrier and pockets the difference. You lose visibility and, often, the freight. Highway plus our known-bench model closes the door on it.",
    },
    {
      title: "Identity theft & MC spoofing",
      body: "Fraud rings hijack a legitimate carrier's authority to book and steal loads. Continuous identity verification flags the mismatch before we tender.",
    },
    {
      title: "Strategic cargo theft",
      body: "Thieves target high-value, time-critical freight — exactly what we haul. Knowing the driver and monitoring the move in real time removes the anonymity theft depends on.",
    },
  ],
}

/* ---------- Job site coordination (services) ---------- */

export const jobSiteCoordination = {
  eyebrow: "Hands-on job site coordination",
  heading: "We don't stop at the gate. We manage the delivery on the ground.",
  intro:
    "Half of our staff and every driver we assign to critical work carries the credentials to get inside the fence — TWIC, HAZMAT, OSHA, and site-council orientations. That means we coordinate the delivery where it actually happens: at the laydown yard, the crane window, and the gate, not from a desk three states away.",
  capabilities: [
    {
      title: "Gate, escort & credential coordination",
      body: "We confirm gate hours, security and escort requirements, and driver credentials before dispatch, so the truck clears the fence instead of sitting at it. TWIC-carded drivers and staff move freely through MTSA ports and refinery gates.",
    },
    {
      title: "Crane-window & laydown staging",
      body: "Deliveries are timed to the crane pick and the laydown sequence the job actually needs — staged in order, not dumped at the gate. We coordinate the equipment waiting at the destination against the trailer we send.",
    },
    {
      title: "On-site supervision & sign-off",
      body: "For oversized, permitted, and critical moves, we put eyes on the delivery — check-in, spotting, unloading supervision, proof of delivery, and documented sign-off on every movement.",
    },
  ],
}

/* ---------- Certifications & compliance (services) ---------- */

export const certificationsIntro = {
  eyebrow: "Certifications & compliance",
  heading: "Credentialed to get inside the fence — on both sides of the border.",
  intro:
    "Getting freight to the gate is the easy part. Getting it through the gate is where credentials matter. Half of our staff and every driver we assign to critical work is carded for restricted sites, and our cross-border program is built on the trusted-trader certifications that actually move trucks across the line.",
}

export type CertGroup = {
  title: string
  note: string
  items: { name: string; abbr?: string; note: string }[]
}

export const certificationGroups: CertGroup[] = [
  {
    title: "Driver & site access",
    note: "What gets our people through restricted gates.",
    items: [
      {
        name: "TWIC card",
        abbr: "TWIC",
        note: "Half our staff and every driver we assign to critical work carries one — required for MTSA ports and refinery gates.",
      },
      {
        name: "HAZMAT endorsement",
        abbr: "H",
        note: "TSA-vetted for placarded and hazardous materials loads.",
      },
      {
        name: "OSHA 10 & OSHA 30",
        note: "Construction-site and GC-orientation baseline; OSHA 30 for supervisory access on hyperscale builds.",
      },
      {
        name: "PEC Basic Orientation Plus",
        abbr: "PEC BOP",
        note: "The de facto Gulf refinery gate card, reciprocal with most safety councils.",
      },
      {
        name: "Safety-council orientations",
        note: "Gulf Coast Safety Council, EHCMA, and ARSC site orientations for plant and petrochem access.",
      },
      {
        name: "MSHA Part 46 / 48",
        note: "New-miner training for surface aggregate and underground/metal mine sites.",
      },
    ],
  },
  {
    title: "Cross-border — Mexico & Canada",
    note: "Our specialty. The trusted-trader stack that moves trucks across the line.",
    items: [
      {
        name: "Customs-Trade Partnership Against Terrorism",
        abbr: "C-TPAT",
        note: "U.S. supply-chain security certification — the northbound anchor for expedited, lower-inspection crossings.",
      },
      {
        name: "Operador Económico Autorizado",
        abbr: "OEA",
        note: "Mexico's Authorized Economic Operator program, mutually recognized with C-TPAT. The long pole most brokers never clear — we did.",
      },
      {
        name: "Free and Secure Trade",
        abbr: "FAST",
        note: "Expedited commercial-vehicle crossing for C-TPAT/OEA-approved freight at the U.S.–Mexico and U.S.–Canada borders.",
      },
      {
        name: "Trusted-traveler enrollment",
        abbr: "Global Entry",
        note: "Vetted crossing credentials for our cross-border personnel to keep freight moving at the gate.",
      },
      {
        name: "ACE / ACI e-Manifest",
        note: "Electronic manifests filed on both borders so the driver clears with a trip number instead of a delay.",
      },
      {
        name: "Licensed customs brokerage & in-bond",
        note: "Partnered clearance on both borders with CBP-bonded in-bond moves, so drayage, warehousing, and paperwork run under one coordinator.",
      },
    ],
  },
  {
    title: "Carrier network & platform compliance",
    note: "How the whole network stays vetted and interchange-ready.",
    items: [
      {
        name: "Highway carrier vetting",
        note: "Real-time identity, authority, and fraud monitoring on every carrier in the network.",
      },
      {
        name: "Uniform Intermodal Interchange Agreement",
        abbr: "UIIA",
        note: "Registered for intermodal equipment interchange, so drayage moves through rail and ocean terminals without friction.",
      },
      {
        name: "ISNetworld / Avetta / Veriforce",
        note: "Contractor-compliance platforms maintained at the carrier level for plant and industrial site access.",
      },
      {
        name: "Broker authority & insurance",
        note: "Freight arranged under Primary Freight LLC (MC# 841023) with $1M auto liability and full coverage; COI on request.",
      },
    ],
  },
]

export const crossBorder = {
  eyebrow: "Cross-border — Mexico & Canada",
  heading: "We master cross-border trucking, and Mexico is one of our key markets.",
  intro:
    "Cross-border is a carrier problem, not a driver problem — the driver's FAST card is cheap and fast; the carrier's C-TPAT and Mexico OEA certification is the real bottleneck most brokers never get through. We're on the far side of it. That means C-TPAT and OEA mutual recognition, FAST-lane crossings, e-manifest on both borders, and drayage and transload staged on both sides of the line, coordinated through one point of contact.",
  points: [
    "C-TPAT + OEA mutual recognition for expedited, lower-inspection crossings",
    "Southbound and northbound truckload, LTL, and project freight",
    "Bonded in-bond moves and licensed customs clearance on both borders",
    "Border-gateway drayage and transload — Laredo, El Paso, Santa Teresa",
  ],
}
