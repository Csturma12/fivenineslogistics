"use client";
import type { Workspace } from "@/lib/portal-contract";
import { DOCUMENT_KINDS } from "@/lib/portal-contract";
import {
  Badge,
  button,
  secondary,
  input,
  Empty,
  Field,
  DocumentList,
  documentKindLabel,
  lane,
  Panel,
  usd,
  type Act,
  type Upload,
} from "./workspace-ui";
import { UploadForm } from "./workspace-forms";

export function WorkspaceDesk({
  data,
  tab,
  act,
  upload,
  busy,
}: {
  data: Workspace;
  tab: string;
  act: Act;
  upload: Upload;
  busy: boolean;
}) {
  const company = (id?: string) =>
    data.profiles?.find((p) => p.user_id === id)?.company || "Account";
  const loadName = (id: string) => {
    const l = data.loads.find((x) => x.id === id);
    return `${l?.external_id || id} · ${lane(l)}`;
  };
  if (tab === "Setup reviews")
    return (
      <Panel eyebrow="Carrier & customer access" title="Setup reviews">
        <p className="mb-5 text-sm text-slate-600">
          Verify documents and identity before approving. Customer TAI IDs must
          come from your trusted customer record, never from signup details.
        </p>
        <div className="space-y-4">
          {data.profiles?.map((p) => {
            const documents = data.documents.filter((d) => d.user_id === p.user_id);
            const packets = p.role === "carrier"
              ? documents.filter((d) => ["packet", "combined"].includes(d.kind || ""))
              : [];
            return (
            <details
              key={`${p.user_id}/${p.version}`}
              className="rounded-lg border p-4"
            >
              <summary className="cursor-pointer font-medium">
                {p.company || p.email} · {p.role} <Badge value={p.status} />
              </summary>
              <div className="mt-5">
                <p className="mb-4 text-sm text-slate-500">{p.email}</p>
                <dl className="mb-5 grid gap-3 text-sm sm:grid-cols-2">
                  {Object.entries(p.details)
                    .filter(([, v]) => v)
                    .map(([key, value]) => (
                      <div key={key}>
                        <dt className="text-xs uppercase text-slate-500">
                          {key.replaceAll("_", " ")}
                        </dt>
                        <dd className="mt-1 break-words">{value}</dd>
                      </div>
                    ))}
                </dl>
                <DocumentList docs={documents} />
                <form
                  className="mt-5"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const f = new FormData(e.currentTarget);
                    await act({
                      action: "review_profile",
                      userId: p.user_id,
                      version: p.version,
                      highway: f.get("highway"),
                      accountId: f.get("accountId"),
                      status: f.get("status"),
                      note: f.get("note"),
                      documentReviews: packets
                        .filter((doc) => f.get(`confirm:${doc.id}`) === "yes")
                        .map((doc) => ({
                          id: doc.id,
                          included_kinds: f.getAll(`packet:${doc.id}`),
                        })),
                    });
                  }}
                >
                  <fieldset
                    disabled={busy}
                    className="grid gap-4 sm:grid-cols-2"
                  >
                    {packets.map((doc) => (
                      <fieldset
                        key={`${doc.id}/${doc.reviewed_at || "pending"}/${doc.included_kinds?.join(",") || ""}`}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:col-span-2"
                      >
                        <legend className="px-1 text-sm font-semibold text-[#14365b]">
                          Confirm packet contents: {doc.name}
                        </legend>
                        <p className="mb-3 text-xs leading-5 text-slate-600">
                          Open the file above and check only the documents you
                          verified inside. One PDF can satisfy multiple document
                          requirements; its contents are not detected automatically.
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {DOCUMENT_KINDS.map((kind) => (
                            <label key={kind} className="flex items-start gap-2 text-sm">
                              <input
                                className="mt-0.5 size-4"
                                type="checkbox"
                                name={`packet:${doc.id}`}
                                value={kind}
                                defaultChecked={doc.reviewed_at
                                  ? doc.included_kinds?.includes(kind)
                                  : doc.kind === "packet" && kind === "packet"}
                              />
                              {documentKindLabel(kind)}
                            </label>
                          ))}
                        </div>
                        <label className="mt-4 flex items-start gap-2 border-t border-slate-200 pt-3 text-sm font-medium">
                          <input
                            className="mt-0.5 size-4"
                            type="checkbox"
                            name={`confirm:${doc.id}`}
                            value="yes"
                            defaultChecked={Boolean(doc.reviewed_at)}
                          />
                          I opened this file and confirmed these documents.
                        </label>
                      </fieldset>
                    ))}
                    {p.role === "carrier" ? (
                      <label className="text-sm">
                        Highway status
                        <select
                          className={input}
                          name="highway"
                          defaultValue={p.highway_status}
                        >
                          <option value="awaiting_invitation">
                            Awaiting invitation
                          </option>
                          <option value="invited">Invitation sent</option>
                          <option value="verified">Verified in Highway</option>
                        </select>
                      </label>
                    ) : (
                      <Field
                        label="Verified TAI customer account ID"
                        name="accountId"
                        value={p.customer_account_id || ""}
                        maxLength={120}
                      />
                    )}
                    <label className="text-sm">
                      Review outcome
                      <select
                        className={input}
                        name="status"
                        defaultValue="changes_requested"
                      >
                        <option value="changes_requested">
                          Needs changes / pending verification
                        </option>
                        <option value="approved">Approve access</option>
                        <option value="suspended">Suspend access</option>
                      </select>
                    </label>
                    <Field
                      label="Note for account owner"
                      name="note"
                      value={p.review_note}
                    />
                    <div className="self-end">
                      <button className={button}>Save review</button>
                    </div>
                  </fieldset>
                </form>
              </div>
            </details>
            );
          })}
        </div>
        {!data.profiles?.length ? (
          <Empty>No profiles submitted yet.</Empty>
        ) : null}
      </Panel>
    );
  if (tab === "Bids & bookings")
    return (
      <div className="space-y-6">
        <Panel title="Carrier reservations">
          <p className="mb-5 text-sm leading-6 text-slate-600">
            These are portal reservations, not verified TAI assignments.
            Complete assignment in the existing operations system and send the
            rate confirmation. This portal does not write directly to TAI.
          </p>
          {data.bookings.length ? (
            <div className="space-y-3">
              {data.bookings.map((b) => (
                <article key={b.id} className="rounded-lg border p-4">
                  <h3 className="font-semibold">{loadName(b.load_id)}</h3>
                  <p className="my-3 text-sm">
                    {company(b.user_id)} · {usd(Number(b.amount))} ·{" "}
                    {b.source.replaceAll("_", " ")}
                  </p>
                  <Badge value={b.status} />
                </article>
              ))}
            </div>
          ) : (
            <Empty>No reservations awaiting dispatch.</Empty>
          )}
        </Panel>
        <Panel title="Bid inbox">
          <div className="space-y-4">
            {data.bids.map((b) => (
              <article key={b.id} className="rounded-lg border p-4">
                <h3 className="font-semibold">{loadName(b.load_id)}</h3>
                <p className="my-2 text-sm">
                  {company(b.user_id)} · bid {usd(Number(b.amount))}
                </p>
                <Badge value={b.status} />
                {b.note ? (
                  <p className="my-3 text-sm text-slate-600">{b.note}</p>
                ) : null}
                {b.counter_amount ? (
                  <p className="my-3 text-sm">
                    Counter: {usd(Number(b.counter_amount))}
                  </p>
                ) : null}
                {["submitted", "countered"].includes(b.status) ? (
                  <div className="mt-4 flex flex-wrap items-end gap-3">
                    {b.status === "submitted" ? (
                      <button
                        disabled={busy}
                        className={button}
                        onClick={() => {
                          if (
                            window.confirm(
                              `Accept ${company(b.user_id)} at ${usd(Number(b.amount))}?`,
                            )
                          )
                            void act({
                              action: "accept",
                              loadId: b.load_id,
                              bidId: b.id,
                              version: b.version,
                            });
                        }}
                      >
                        Accept bid
                      </button>
                    ) : null}
                    <button
                      disabled={busy}
                      className={secondary}
                      onClick={() =>
                        void act({
                          action: "deny",
                          loadId: b.load_id,
                          bidId: b.id,
                          version: b.version,
                        })
                      }
                    >
                      Deny
                    </button>
                    <form
                      className="flex items-end gap-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        void act({
                          action: "counter",
                          loadId: b.load_id,
                          bidId: b.id,
                          version: b.version,
                          amount: new FormData(e.currentTarget).get("amount"),
                        });
                      }}
                    >
                      <label className="text-xs">
                        Counteroffer (USD)
                        <input
                          className={`${input} max-w-36`}
                          type="number"
                          min="0.01"
                          max="1000000"
                          step="0.01"
                          required
                          name="amount"
                          disabled={busy}
                        />
                      </label>
                      <button disabled={busy} className={secondary}>
                        Send counter
                      </button>
                    </form>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
          {!data.bids.length ? <Empty>No carrier bids yet.</Empty> : null}
        </Panel>
      </div>
    );
  if (tab === "Customer requests")
    return (
      <Panel title="Customer request inbox">
        <div className="space-y-4">
          {data.requests.map((r) => (
            <article key={r.id} className="rounded-lg border p-5">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-semibold">
                  {company(r.user_id)} · {r.kind.toUpperCase()}
                </h3>
                <Badge value={r.status} />
              </div>
              {r.load_id ? (
                <p className="mt-3 text-sm">{loadName(r.load_id)}</p>
              ) : null}
              <dl className="my-4 grid gap-3 text-sm sm:grid-cols-2">
                {Object.entries(r.details)
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs uppercase text-slate-500">
                        {k.replaceAll("_", " ")}
                      </dt>
                      <dd className="mt-1">{v}</dd>
                    </div>
                  ))}
              </dl>
              {r.status !== "completed" ? (
                <button
                  className={secondary}
                  disabled={busy}
                  onClick={() =>
                    void act({ action: "complete_request", id: r.id })
                  }
                >
                  Mark handled
                </button>
              ) : null}
            </article>
          ))}
        </div>
        {!data.requests.length ? (
          <Empty>No customer requests yet.</Empty>
        ) : null}
      </Panel>
    );
  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <Panel title="Company documents">
        <p className="mb-5 text-sm text-slate-600">
          Publish your approved company packet, W9, insurance and other
          documents for signed-in accounts. These files are not public.
        </p>
        <UploadForm company upload={upload} busy={busy} />
        <DocumentList docs={data.companyDocuments} company />
      </Panel>
      <Panel title="Email delivery queue">
        <p className="mb-4 text-sm text-slate-600">
          Dispatch inbox: sturma@blbxcritical.com. A saved request is retained
          even if email delivery fails. Items older than 23 hours require manual
          follow-up.
        </p>
        <button
          className={secondary}
          disabled={busy}
          onClick={() => void act({ action: "retry_notifications" })}
        >
          Retry pending email
        </button>
        <div className="mt-4 space-y-3">
          {data.notifications?.map((n) => (
            <div key={n.id} className="rounded-lg bg-slate-50 p-4 text-sm">
              <p className="font-medium">{n.subject}</p>
              <p className="mt-1 text-slate-500">
                {n.last_error || "Queued for delivery"}
              </p>
            </div>
          ))}
        </div>
        {!data.notifications?.length ? (
          <p className="mt-5 text-sm text-emerald-700">
            No pending email notifications.
          </p>
        ) : null}
      </Panel>
    </div>
  );
}
