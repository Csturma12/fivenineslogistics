export type PortalRole = "carrier" | "customer";
export type Profile = {
  user_id: string;
  email: string;
  role: PortalRole;
  company: string;
  details: Record<string, string>;
  status: string;
  highway_status: string;
  customer_account_id: string | null;
  review_note: string;
  version: number;
};
export type PortalLoad = {
  id: string;
  origin_city: string;
  origin_state: string;
  dest_city: string;
  dest_state: string;
  pickup_date: string | null;
  delivery_date: string | null;
  equipment: string | null;
  weight_lbs: number | null;
  dimensions: string | null;
  status: string;
  auto_book: boolean;
  carrier_offer_usd: number | null;
  tracking_location?: string | null;
  tracking_at?: string | null;
  external_id?: string;
};
export type PortalBid = {
  id: string;
  load_id: string;
  user_id: string;
  amount: number;
  note: string;
  status: string;
  counter_amount: number | null;
  version: number;
};
export type PortalDoc = {
  id: string;
  kind?: string;
  name?: string;
  title?: string;
  user_id?: string;
  created_at?: string;
};
export type PortalRequest = {
  id: string;
  kind: string;
  status: string;
  details: Record<string, string>;
  user_id?: string;
  load_id?: string;
};
export type PortalBooking = {
  id: string;
  load_id: string;
  user_id: string;
  amount: number;
  status: string;
  source: string;
};
export type Workspace = {
  email: string;
  staff: boolean;
  profile: Profile | null;
  hint: string;
  company: string;
  documents: PortalDoc[];
  companyDocuments: PortalDoc[];
  loads: PortalLoad[];
  bids: PortalBid[];
  requests: PortalRequest[];
  bookings: PortalBooking[];
  historyLoads?: PortalLoad[];
  highwayUrl: string | null;
  profiles?: Profile[];
  notifications?: { id: string; subject: string; last_error: string | null }[];
};
export class PortalProblem extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export function text(value: unknown, max = 200): string {
  if (typeof value !== "string" || value.length > max)
    throw new PortalProblem("Check the form fields and try again.");
  return value.trim();
}
export function uuid(value: unknown): string {
  const id = text(value, 36);
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  )
    throw new PortalProblem("Invalid record.");
  return id;
}
export function money(value: unknown): number {
  const amount =
    typeof value === "number"
      ? value
      : typeof value === "string" && /^\d+(\.\d{1,2})?$/.test(value)
        ? Number(value)
        : NaN;
  if (
    !Number.isFinite(amount) ||
    amount <= 0 ||
    amount > 1_000_000 ||
    Math.abs(amount * 100 - Math.round(amount * 100)) > 0.00001
  )
    throw new PortalProblem(
      "Enter a positive USD amount with at most two decimals.",
    );
  return amount;
}
export function calendarDate(value: unknown, required = false): string {
  const date = text(value ?? "", 10);
  if (!date && !required) return "";
  const parsed = new Date(date + "T12:00:00Z");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  )
    throw new PortalProblem("Enter a valid date.");
  return date;
}
export const PROFILE_FIELDS = [
  "contact",
  "phone",
  "address",
  "mc",
  "dot",
  "equipment",
  "fleet_size",
  "lanes",
  "certifications",
  "insurance_company",
  "insurance_expiry",
  "factoring",
  "factor_name",
  "payment_contact",
  "questionnaire",
  "integrations",
  "contract_ack",
] as const;
export function profileDetails(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    throw new PortalProblem("Profile details are required.");
  const data = raw as Record<string, unknown>;
  const result = Object.fromEntries(
    PROFILE_FIELDS.map((key) => [key, text(data[key] ?? "", 1000)]),
  );
  result.insurance_expiry = calendarDate(result.insurance_expiry);
  if (!["", "yes", "no"].includes(result.factoring))
    throw new PortalProblem("Select whether you use factoring.");
  return result;
}
export function setupMissing(
  profile: Pick<Profile, "role" | "company" | "details">,
  docs: PortalDoc[],
  today: string,
): string[] {
  const missing: string[] = [];
  if (!profile.company) missing.push("Company name");
  for (const key of ["contact", "phone"])
    if (!profile.details[key]) missing.push(key);
  if (profile.role === "carrier") {
    for (const key of ["dot", "equipment", "lanes"])
      if (!profile.details[key]) missing.push(key);
    for (const kind of [
      "packet",
      "coi",
      "w9",
      ...(profile.details.factoring === "yes" ? ["noa"] : []),
    ])
      if (!docs.some((d) => d.kind === kind)) missing.push(kind.toUpperCase());
    if (!["yes", "no"].includes(profile.details.factoring))
      missing.push("Factoring selection");
    if (
      !profile.details.insurance_expiry ||
      profile.details.insurance_expiry < today
    )
      missing.push("Current insurance expiry");
    if (profile.details.contract_ack !== "yes")
      missing.push("Accuracy acknowledgment");
  }
  return missing;
}
export function centralToday(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
// Keep this projection explicit even when a future query adds private columns.
export function carrierLoad(row: Record<string, unknown>, allowAutoBook = true): PortalLoad {
  return {
    id: String(row.id),
    origin_city: String(row.origin_city),
    origin_state: String(row.origin_state),
    dest_city: String(row.dest_city),
    dest_state: String(row.dest_state),
    pickup_date: row.pickup_date as string | null,
    delivery_date: row.delivery_date as string | null,
    equipment: row.equipment as string | null,
    weight_lbs: row.weight_lbs == null ? null : Number(row.weight_lbs),
    dimensions: row.dimensions as string | null,
    status: String(row.status),
    auto_book: allowAutoBook && row.auto_book === true,
    carrier_offer_usd:
      allowAutoBook && row.auto_book === true && row.carrier_offer_usd != null
        ? Number(row.carrier_offer_usd)
        : null,
  };
}
export function safeHighwayUrl(value?: string): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      (url.hostname === "highway.com" || url.hostname.endsWith(".highway.com"))
      ? url.href
      : null;
  } catch {
    return null;
  }
}
