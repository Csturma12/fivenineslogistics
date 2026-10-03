import { PortalProblem } from "./portal-contract";

// Traverse stable IDs so a reservation/removal in an earlier page cannot
// shift a later offset and silently skip another available load.
export const PORTAL_PAGE_SIZE = 500;
export async function allPortalRows<T extends { id: string }>(
  page: (afterId: string | null) => PromiseLike<{ data: T[] | null; count: number | null; error: { message: string } | null }>,
): Promise<T[]> {
  const rows: T[] = [];
  let afterId: string | null = null;
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
