import { requireBridgeToken } from "@/lib/portal-bridge-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { PortalProblem } from "@/lib/portal-contract";
import { ingestRows } from "@/lib/portal-ingest";
import { failure, result } from "@/lib/portal-service";

export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    requireBridgeToken(request, process.env.TMS_INGEST_TOKEN);
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
