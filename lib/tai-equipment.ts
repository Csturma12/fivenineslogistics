import { TAI_TRAILER_TYPES, type TaiTrailerType } from "./tai-trailer-types";

const TAI_SET: ReadonlySet<string> = new Set(TAI_TRAILER_TYPES);

export function isTaiTrailerType(value: string): value is TaiTrailerType {
  return TAI_SET.has(value);
}

const GROUP_ORDER = [
  "Van",
  "Reefer",
  "Flatbed & open deck",
  "Straight trucks & sprinters",
  "Container",
  "Tanker",
  "Specialty",
] as const;

export function groupOf(type: string): (typeof GROUP_ORDER)[number] {
  if (type.startsWith("Container")) return "Container";
  if (type.startsWith("Tanker")) return "Tanker";
  if (/Straight Truck|City Truck|Sprinter/.test(type))
    return "Straight trucks & sprinters";
  if (/Reefer|Refrigerated/.test(type)) return "Reefer";
  if (
    /Flatbed|Step Deck|Conestoga|Double Drop|Low Boy|Super B|Landoll|Maxi|HotShot/.test(
      type,
    )
  )
    return "Flatbed & open deck";
  if (/Van/.test(type)) return "Van";
  return "Specialty";
}

/** TAI trailer types grouped for pickers; values are the exact TAI strings. */
export const TAI_EQUIPMENT_GROUPS = GROUP_ORDER.map((label) => ({
  label,
  options: TAI_TRAILER_TYPES.filter((type) => groupOf(type) === label),
})).filter((group) => group.options.length);
