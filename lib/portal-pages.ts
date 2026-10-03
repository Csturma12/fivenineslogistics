import { PortalProblem } from "./portal-contract";

// PostgREST may cap one response even when a larger range is requested.
// Keep requesting ordered pages until a partial page is returned.
const PAGE_SIZE = 500;
export async function allPortalRows<T>(
  page: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>,
): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const response = await page(from, from + PAGE_SIZE - 1);
    if (response.error) throw new PortalProblem("The load board could not be refreshed. Please try again.", 503);
    const batch = response.data || [];
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) return rows;
  }
}
