export const MAP_VIEWBOX = "0 0 100 94"

type LabelPlacement = "above" | "below" | "left" | "right"

export type MapNode = { x: number; y: number; label: LabelPlacement }

// Stylized (not geographic) positions. Label placements are hand-tuned so the
// tight clusters (MAR/BYH/MEM, HOU/PORT/SAT, BTR/NOLA/MOB) stay legible at phone width.
export const mapNodes: Record<string, MapNode> = {
  SEA: { x: 10, y: 12, label: "above" },
  OAK: { x: 8, y: 33, label: "right" },
  LAX: { x: 11, y: 52, label: "above" },
  PHX: { x: 22, y: 60, label: "above" },
  STR: { x: 32, y: 73, label: "below" },
  MID: { x: 39, y: 66, label: "above" },
  HSL: { x: 44, y: 54, label: "above" },
  DFW: { x: 51, y: 62, label: "right" },
  SAT: { x: 49, y: 83, label: "below" },
  HOU: { x: 57, y: 76, label: "left" },
  PORT: { x: 62, y: 84, label: "below" },
  BTR: { x: 68, y: 72, label: "above" },
  NOLA: { x: 73, y: 81, label: "below" },
  MOB: { x: 79, y: 72, label: "right" },
  MAR: { x: 57, y: 45, label: "left" },
  BYH: { x: 63, y: 39, label: "above" },
  MEM: { x: 65, y: 50, label: "right" },
  CHI: { x: 70, y: 26, label: "above" },
  SDF: { x: 77, y: 39, label: "above" },
  SAV: { x: 83, y: 64, label: "left" },
  CHS: { x: 88, y: 57, label: "right" },
  ORF: { x: 89, y: 46, label: "below" },
  EWR: { x: 88, y: 30, label: "left" },
  KRN: { x: 92, y: 23, label: "above" },
  STI: { x: 95, y: 33, label: "below" },
}

export type CorridorId = "port" | "petrochem" | "cross-border"

export type HubDetail = { corridors: CorridorId[]; capabilities: string[] }

export const hubDetails: Record<string, HubDetail> = {
  SEA: { corridors: ["port"], capabilities: ["TWIC Port Drayage", "Heavy Container Stripping", "PNW Flatbed Hub"] },
  LAX: { corridors: ["port"], capabilities: ["TWIC Port Drayage", "60k-lb Heavy Transload", "West Coast Expedited"] },
  PHX: { corridors: ["cross-border"], capabilities: ["Southwest Data Center Staging", "Step-Deck & RGN Hub", "Secured Laydown"] },
  STR: { corridors: ["cross-border"], capabilities: ["MX/US Heavy-Haul Customs Yard", "Thru-Trailer Cross-Border", "Bonded Transload"] },
  MID: { corridors: ["petrochem"], capabilities: ["Permian Basin 24/7 Hotshot", "Pipe-Staked Flatbeds", "Oilfield Rigging"] },
  HSL: { corridors: ["petrochem", "cross-border"], capabilities: ["North TX Intermodal & Rail Ramp", "Laydown Yard Staging", "Heavy Open-Deck"] },
  DFW: { corridors: ["petrochem", "cross-border"], capabilities: ["Hyperscale Data Center Corridor", "24/7 Team Expedited", "Cross-Dock & Storage"] },
  SAT: { corridors: ["petrochem", "cross-border"], capabilities: ["South TX Industrial Staging", "Laredo Cross-Border Relay", "Flatbed & Hotshot"] },
  HOU: { corridors: ["port", "petrochem"], capabilities: ["Five Nines HQ Control Tower", "Refinery Turnaround & PFV", "24/7 Line-Down Hotshot"] },
  PORT: { corridors: ["port", "petrochem"], capabilities: ["100% TWIC Port Extraction", "OOG Flatrack & Bridge Crane", "Heavy-Lift Transload"] },
  BTR: { corridors: ["petrochem"], capabilities: ["Chemical Corridor Turnarounds", "Refractory & Valve Hotshot", "TWIC Plant Delivery"] },
  NOLA: { corridors: ["port", "petrochem"], capabilities: ["Lower Mississippi Port Drayage", "Breakbulk & Barge Transload", "Heavy Flatbed"] },
  MOB: { corridors: ["port"], capabilities: ["Gulf Port Heavy Transload", "Steel & Pipe Mill Outbound", "Step-Deck & RGN"] },
  MAR: { corridors: ["cross-border"], capabilities: ["Mid-South Rail & Barge Hub", "Structural Steel & Pipe", "Open-Deck Staging"] },
  BYH: { corridors: ["cross-border"], capabilities: ["Arkansas Steel Mill Corridor", "Heavy Coil & Plate Flatbed", "Dedicated Open-Deck"] },
  MEM: { corridors: ["cross-border"], capabilities: ["Central U.S. Priority Hub", "24/7 Expedited Relay", "Cross-Dock & Laydown"] },
  CHI: { corridors: ["cross-border"], capabilities: ["Midwest Industrial & Rail Hub", "Canada Cross-Border Relay", "Heavy Machinery"] },
  SDF: { corridors: ["cross-border"], capabilities: ["Ohio Valley Data Center Alley", "Switchgear & Transformer Staging", "Time-Critical FTL"] },
  ORF: { corridors: ["port", "cross-border"], capabilities: ["Mid-Atlantic Port Drayage", "Northern VA Data Center Corridor", "OOG Transload"] },
  EWR: { corridors: ["port"], capabilities: ["NY/NJ Port & Heavy Drayage", "Northeast Industrial Final Mile", "Bonded Warehousing"] },
  OAK: { corridors: ["port"], capabilities: ["Port of Oakland TWIC Drayage", "NorCal Heavy Transload", "Container Stripping"] },
  SAV: { corridors: ["port"], capabilities: ["Port of Savannah TWIC Drayage", "60k-lb Heavy Transload", "Southeast Distribution Relay"] },
  CHS: { corridors: ["port"], capabilities: ["Port of Charleston TWIC Drayage", "OOG Flatrack Transload", "Southeast Industrial Final Mile"] },
  KRN: { corridors: ["port"], capabilities: ["Kearny Rail & Port Drayage", "NY/NJ Container Transload", "Chassis & Yard Staging"] },
  STI: { corridors: ["port"], capabilities: ["Howland Hook Terminal Drayage", "TWIC Container Pulls", "NY Metro Final Mile"] },
}

export const mapLinks: [string, string][] = [
  ["SEA", "OAK"],
  ["OAK", "LAX"],
  ["SEA", "DFW"],
  ["LAX", "PHX"],
  ["PHX", "STR"],
  ["STR", "DFW"],
  ["MID", "DFW"],
  ["HSL", "DFW"],
  ["DFW", "HOU"],
  ["DFW", "MEM"],
  ["HOU", "SAT"],
  ["HOU", "PORT"],
  ["HOU", "BTR"],
  ["BTR", "NOLA"],
  ["NOLA", "MOB"],
  ["MOB", "MEM"],
  ["MEM", "MAR"],
  ["MEM", "BYH"],
  ["MEM", "SDF"],
  ["SDF", "CHI"],
  ["DFW", "CHI"],
  ["CHI", "EWR"],
  ["SDF", "ORF"],
  ["MEM", "ORF"],
  ["ORF", "EWR"],
  ["MOB", "SAV"],
  ["SAV", "CHS"],
  ["CHS", "ORF"],
  ["EWR", "KRN"],
  ["EWR", "STI"],
]

export function labelPosition(node: MapNode) {
  switch (node.label) {
    case "below":
      return { x: node.x, y: node.y + 6.6, anchor: "middle" as const }
    case "left":
      return { x: node.x - 3.8, y: node.y + 1.2, anchor: "end" as const }
    case "right":
      return { x: node.x + 3.8, y: node.y + 1.2, anchor: "start" as const }
    default:
      return { x: node.x, y: node.y - 4.2, anchor: "middle" as const }
  }
}
