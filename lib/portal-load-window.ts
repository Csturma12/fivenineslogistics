import { calendarDate, centralToday } from "./portal-contract";

/** A pickup search covers fourteen calendar days, including its start date. */
export function pickupWindow(value: unknown, today = centralToday()) {
  const selected = calendarDate(value || today, true);
  const from = selected < today ? today : selected;
  const [year, month, day] = from.split("-").map(Number);
  const through = new Date(Date.UTC(year, month - 1, day + 13))
    .toISOString()
    .slice(0, 10);
  const until = new Date(Date.UTC(year, month - 1, day + 14))
    .toISOString()
    .slice(0, 10);
  return { from, through, until };
}
