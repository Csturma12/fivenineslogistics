/**
 * "Where we need a truck": booked pickups in the next few days that have no
 * carrier yet, summed by lane and day for the public Carriers page.
 *
 * Pure data in, pure data out. The result is published to anyone, so it holds
 * only what a carrier needs to decide to call: lane, equipment, day and a
 * count. It never carries a customer, a rate, a load number, a weight or a note.
 */

export const TRUCK_NEEDS_DAYS = 7;
export const TRUCK_NEEDS_MAX_LANES = 12;

/** Customers kept off every screen; mirrors the operations dashboard's list. */
const HIDDEN_CUSTOMERS = ["QUALITY SAUSAGE"];

/** A shipment row as read on the server. `customer_name` is used to filter and then dropped. */
export type TruckNeedRow = {
  status: string | null;
  carrier_name: string | null;
  customer_name?: string | null;
  from_city: string | null;
  from_state: string | null;
  to_city: string | null;
  to_state: string | null;
  ship_date: string | null;
  equipment_type: string | null;
};

export type TruckNeedLane = {
  key: string;
  origin: string;
  destination: string;
  equipment: string;
  /** Pickups per day, index 0 = the first day of the window. */
  perDay: number[];
  total: number;
};

export type TruckNeeds = {
  days: string[];
  lanes: TruckNeedLane[];
  /** Lanes left off the list because it is capped. */
  moreLanes: number;
  totalPickups: number;
};

const text = (value: unknown) => String(value ?? "").replace(/\s+/g, " ").trim();
const normalize = (value: unknown) => text(value).toUpperCase().replace(/[^A-Z0-9]+/g, " ").trim();

function isHiddenCustomer(name: unknown): boolean {
  const padded = ` ${normalize(name)} `;
  return HIDDEN_CUSTOMERS.some((hidden) => padded.includes(` ${hidden} `));
}

function titleCase(value: string): string {
  return value.toLowerCase().replace(/(^|[\s\-.'])([a-z])/g, (_, lead: string, letter: string) => lead + letter.toUpperCase());
}

function place(city: string, state: string): string {
  return `${titleCase(city)}, ${state}`;
}

export function addDays(isoDay: string, count: number): string {
  const [year, month, day] = isoDay.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + count)).toISOString().slice(0, 10);
}

export function buildTruckNeeds(
  rows: readonly TruckNeedRow[],
  today: string,
  length = TRUCK_NEEDS_DAYS,
  maxLanes = TRUCK_NEEDS_MAX_LANES,
): TruckNeeds {
  const days = Array.from({ length }, (_, i) => addDays(today, i));
  const lanes = new Map<string, TruckNeedLane>();

  for (const row of rows) {
    // Booked by the customer, no truck yet. Quotes are not real freight.
    if (!/committed/i.test(text(row.status)) || text(row.carrier_name)) continue;
    if (isHiddenCustomer(row.customer_name)) continue;
    const fromCity = text(row.from_city);
    const fromState = text(row.from_state).toUpperCase();
    const toCity = text(row.to_city);
    const toState = text(row.to_state).toUpperCase();
    if (!fromCity || !toCity || !/^[A-Z]{2}$/.test(fromState) || !/^[A-Z]{2}$/.test(toState)) continue;
    const dayIndex = days.indexOf(text(row.ship_date).slice(0, 10));
    if (dayIndex < 0) continue;

    const equipment = text(row.equipment_type).slice(0, 40);
    const origin = place(fromCity, fromState);
    const destination = place(toCity, toState);
    const key = `${origin}|${destination}|${equipment}`.toLowerCase();
    let lane = lanes.get(key);
    if (!lane) {
      lane = { key, origin, destination, equipment, perDay: days.map(() => 0), total: 0 };
      lanes.set(key, lane);
    }
    lane.perDay[dayIndex] += 1;
    lane.total += 1;
  }

  const firstDay = (lane: TruckNeedLane) => lane.perDay.findIndex((count) => count > 0);
  const sorted = Array.from(lanes.values()).sort(
    (a, b) => firstDay(a) - firstDay(b) || b.total - a.total || a.key.localeCompare(b.key),
  );
  return {
    days,
    lanes: sorted.slice(0, maxLanes),
    moreLanes: Math.max(0, sorted.length - maxLanes),
    totalPickups: sorted.reduce((sum, lane) => sum + lane.total, 0),
  };
}
