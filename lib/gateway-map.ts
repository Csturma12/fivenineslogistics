export const MAP_VIEWBOX = "0 0 100 94"

type LabelPlacement = "above" | "below" | "left" | "right"

export type MapNode = { x: number; y: number; label: LabelPlacement }

// Stylized (not geographic) positions. Label placements are hand-tuned so the
// tight clusters (MAR/BYH/MEM, HOU/PORT/SAT, BTR/NOLA/MOB) stay legible at phone width.
export const mapNodes: Record<string, MapNode> = {
  SEA: { x: 10, y: 12, label: "above" },
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
  ORF: { x: 89, y: 46, label: "below" },
  EWR: { x: 91, y: 28, label: "above" },
}

export const mapLinks: [string, string][] = [
  ["SEA", "LAX"],
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
