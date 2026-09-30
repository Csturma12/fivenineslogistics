import Link from "next/link";
import type { Workspace } from "@/lib/portal-contract";
import { Badge, DocumentList, Empty, lane, LoadFacts, Panel } from "./workspace-ui";

/** Staff can inspect another portal without acting as that account role. */
export function ReadOnlyPortalView({ data, readOnlySamples = false }: {
  data: Workspace;
  readOnlySamples?: boolean;
}) {
  return (
    <div className="space-y-6">
      <p role="status" className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm">
        Read-only staff view. Switching portals does not change your account role
        or grant permission to bid, book, upload, or submit customer requests.{" "}
        <Link className="underline" href={data.profile?.role === "customer" ? "/portal/customer" : "/portal"}>
          Return to your account portal
        </Link> to use its approved actions.
      </p>
      <Panel title="Load board">
        {data.loads.length ? data.loads.map(load => (
          <article key={load.id} className="mb-4 rounded-lg border p-5">
            <h3 className="font-semibold">{lane(load)}</h3>
            <Badge value={load.status} />
            <LoadFacts load={load} />
          </article>
        )) : <Empty>No loads are available in this view.</Empty>}
      </Panel>
      <Panel title="Company documents">
        <DocumentList docs={data.companyDocuments} company readOnlySamples={readOnlySamples} />
      </Panel>
    </div>
  );
}
