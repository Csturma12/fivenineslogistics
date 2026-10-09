import { PortalProblem } from "./portal-contract";

// Traverse stable IDs so a reservation/removal in an earlier page cannot
// shift a later offset and silently skip another available load.
export const PORTAL_PAGE_SIZE = 500;
export function carrierEligibilityKey(now: number, chicagoDate: string): string {
  return `${Math.floor(now / 60_000)}:${chicagoDate}`;
}
export async function allPortalRows<T extends { id: string | number }>(
  page: (afterId: T["id"] | null) => PromiseLike<{ data: T[] | null; count: number | null; error: { message: string } | null }>,
): Promise<T[]> {
  const rows: T[] = [];
  let afterId: T["id"] | null = null;
  for (;;) {
    const response = await page(afterId);
    if (response.error || response.count === null) throw new PortalProblem("The load board could not be refreshed. Please try again.", 503);
    const batch = response.data || [];
    if (batch.length === 0 && response.count > 0) throw new PortalProblem("The load board could not be refreshed. Please try again.", 503);
    rows.push(...batch);
    // PostgREST can cap a response below our requested limit. Exact count is
    // scoped to the current cursor; a short batch is not necessarily the end.
    if (batch.length >= response.count) return rows;
    const lastId = batch[batch.length - 1].id;
    if (!lastId || lastId === afterId) throw new PortalProblem("The load board could not be refreshed. Please try again.", 503);
    afterId = lastId;
  }
}

export async function allPortalRowsAtVersion<T extends { id: string | number }>(
  page: (afterId: T["id"] | null) => PromiseLike<{ data: T[] | null; count: number | null; error: { message: string } | null }>,
  initialVersion: string,
  readVersion: () => Promise<string>,
): Promise<{ rows: T[]; version: string }> {
  let version = initialVersion;
  for (let attempt = 0; attempt < 3; attempt++) {
    const rows = await allPortalRows(page);
    const currentVersion = await readVersion();
    if (currentVersion === version) return { rows, version };
    version = currentVersion;
  }
  throw new PortalProblem("The load board changed while it was being refreshed. Please try again.", 503);
}

export function comparePickupDate(
  a: { id: string; pickup_date: string | null },
  b: { id: string; pickup_date: string | null },
  direction: "asc" | "desc",
): number {
  if (a.pickup_date === null) return b.pickup_date === null ? a.id.localeCompare(b.id) : 1;
  if (b.pickup_date === null) return -1;
  const dateOrder = direction === "asc"
    ? a.pickup_date.localeCompare(b.pickup_date)
    : b.pickup_date.localeCompare(a.pickup_date);
  return dateOrder || a.id.localeCompare(b.id);
}
