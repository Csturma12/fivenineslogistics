import { PortalProblem } from "./portal-contract";

// PostgREST may cap a response below the requested page size. An exact count
// on each cursor keeps the board complete even when that happens.
export const PORTAL_PAGE_SIZE = 500;
export async function allPortalRows<T extends { id: string | number }>(
  page: (afterId: string | number | null) => PromiseLike<{
    data: T[] | null;
    count: number | null;
    error: { message: string } | null;
  }>,
): Promise<T[]> {
  const rows: T[] = [];
  let afterId: string | number | null = null;
  for (;;) {
    const response = await page(afterId);
    if (response.error || response.count === null)
      throw new PortalProblem("The load board could not be refreshed. Please try again.", 503);
    const batch = response.data || [];
    if (!batch.length && response.count > 0)
      throw new PortalProblem("The load board could not be refreshed. Please try again.", 503);
    rows.push(...batch);
    if (batch.length >= response.count) return rows;
    const lastId = batch[batch.length - 1]?.id;
    if (lastId == null || lastId === afterId)
      throw new PortalProblem("The load board could not be refreshed. Please try again.", 503);
    afterId = lastId;
  }
}
