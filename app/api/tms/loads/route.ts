import { timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { PortalProblem } from "@/lib/portal-contract";
import { ingestRows } from "@/lib/portal-ingest";
import { failure, result } from "@/lib/portal-service";

export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    const token = process.env.TMS_INGEST_TOKEN;
    if (!token) throw new PortalProblem("Load feed is not configured.", 503);
    const provided =
      request.headers.get("authorization")?.replace(/^Bearer /, "") || "";
    const expected = Buffer.from(token),
      actual = Buffer.from(provided);
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
      throw new PortalProblem("Unauthorized.", 401);
    const raw = await request.text();
    if (raw.length > 500_000)
      throw new PortalProblem("Request too large.", 413);
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      throw new PortalProblem("Invalid JSON.");
    }
    const rows = ingestRows(body);
    const count = result(
      await createAdminClient().rpc("fn_ingest_loads", { p_rows: rows }),
    );
    return Response.json({ ingested: count, received: rows.length });
  } catch (error) {
    return failure(error);
  }
}
