"use client";
import { useState } from "react";
import { HIGHWAY_ONBOARDING_EMAIL, highwayOnboardingMailto } from "@/lib/portal-highway-onboarding";
import {
  centralToday,
  setupMissing,
  type Workspace,
} from "@/lib/portal-contract";
import {
  Badge,
  button,
  secondary,
  input,
  Empty,
  lane,
  LoadFacts,
  Panel,
  usd,
  type Act,
} from "./workspace-ui";

export function CarrierBoard({
  data,
  act,
  busy,
}: {
  data: Workspace;
  act: Act;
  busy: boolean;
}) {
  const [search, setSearch] = useState("");
  const [booking, setBooking] = useState<string | null>(null);
  const p = data.profile!;
  const ready =
    p.status === "approved" &&
    p.highway_status === "verified" &&
    !setupMissing(p, data.documents, centralToday()).length;
  const loads = data.loads.filter((l) =>
    `${lane(l)} ${l.equipment || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const allLoads = [...data.loads, ...(data.historyLoads || [])];
  return (
    <div className="space-y-6">
      <Panel eyebrow="Carrier opportunities" title="Available loads">
        <p className="mb-6 text-sm leading-6 text-slate-600">
          Find a lane and send your bid to dispatch. Your bids and counteroffers
          stay here for review. Dispatch confirms final assignment and sends the
          rate confirmation before a truck is dispatched.
        </p>
        {!ready ? (
          <Empty>
            Load-board access opens after your documents, insurance and Highway
            setup are approved. Visit Setup & profile to finish your packet.
            {p.highway_status !== "verified" ? (
              <span className="mt-3 block">
                To complete Highway setup, email{" "}
                <a className="underline" href={highwayOnboardingMailto(p.company)}>
                  {HIGHWAY_ONBOARDING_EMAIL}
                </a>.
              </span>
            ) : null}
          </Empty>
        ) : (
          <>
            <label className="mb-6 block max-w-md text-sm font-medium">
              Find a lane or equipment
              <input
                className={input}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city, state, flatbed…"
              />
            </label>
            <div className="space-y-4">
              {loads.map((load) => (
                <article
                  className="rounded-xl border border-slate-200 p-5"
                  key={load.id}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-[#14365b]">
                      {lane(load)}
                    </h3>
                    {load.auto_book ? (
                      <Badge value="auto_book_available" />
                    ) : null}
                  </div>
                  <LoadFacts load={load} />
                  <div className="flex flex-wrap items-end justify-between gap-4 border-t border-slate-100 pt-4">
                    <form
                      className="flex flex-wrap items-end gap-3"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const f = new FormData(e.currentTarget);
                        await act({
                          action: "submit",
                          loadId: load.id,
                          amount: f.get("amount"),
                          note: f.get("note"),
                        });
                      }}
                    >
                      <label className="block text-xs text-slate-600">
                        Your bid (USD)
                        <input
                          aria-label={`Bid for ${lane(load)}`}
                          className={`${input} max-w-36`}
                          name="amount"
                          type="number"
                          min="0.01"
                          max="1000000"
                          step="0.01"
                          required
                          disabled={busy}
                        />
                      </label>
                      <label className="block text-xs text-slate-600">
                        Optional note
                        <input
                          className={`${input} max-w-52`}
                          name="note"
                          maxLength={1000}
                          disabled={busy}
                        />
                      </label>
                      <button className={button} disabled={busy}>
                        Submit bid
                      </button>
                    </form>
                    {load.auto_book && load.carrier_offer_usd != null ? (
                      <div className="text-right">
                        <p className="mb-2 text-sm text-slate-600">
                          Carrier offer{" "}
                          <strong className="text-lg text-[#14365b]">
                            {usd(load.carrier_offer_usd)}
                          </strong>
                        </p>
                        <button
                          className={secondary}
                          disabled={busy}
                          onClick={() => setBooking(load.id)}
                        >
                          Auto-book at this offer
                        </button>
                      </div>
                    ) : null}
                  </div>
                  {booking === load.id ? (
                    <div
                      className="mt-5 rounded-lg bg-blue-50 p-5"
                      role="group"
                      aria-label="Confirm reservation"
                    >
                      <p className="mb-4 text-sm leading-6">
                        Reserve this load at{" "}
                        <strong>{usd(load.carrier_offer_usd!)}</strong>? This
                        removes it from the open board and sends it to dispatch.
                        Do not dispatch a truck until assignment is confirmed.
                      </p>
                      <div className="flex gap-3">
                        <button
                          className={button}
                          disabled={busy}
                          onClick={async () => {
                            if (
                              await act({
                                action: "auto_book",
                                loadId: load.id,
                                amount: load.carrier_offer_usd,
                              })
                            )
                              setBooking(null);
                          }}
                        >
                          Confirm reservation
                        </button>
                        <button
                          className={secondary}
                          onClick={() => setBooking(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
            {!loads.length ? (
              <Empty>
                No matching open loads right now. Refresh for the latest
                available freight.
              </Empty>
            ) : null}
          </>
        )}
      </Panel>
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Panel title="Your bids & counteroffers">
          {data.bids.length ? (
            <div className="space-y-4">
              {data.bids.map((bid) => (
                <article key={bid.id} className="rounded-lg border p-4">
                  <h3 className="mb-2 font-medium">
                    {lane(allLoads.find((l) => l.id === bid.load_id))}
                  </h3>
                  <Badge value={bid.status} />
                  <p className="my-3 text-sm">
                    Your bid: {usd(Number(bid.amount))}
                  </p>
                  {bid.status === "countered" && bid.counter_amount ? (
                    <>
                      <p className="mb-3 text-sm">
                        Dispatch offers:{" "}
                        <strong>{usd(Number(bid.counter_amount))}</strong>
                      </p>
                      <button
                        className={button}
                        disabled={busy || !ready}
                        onClick={() => {
                          if (
                            window.confirm(
                              `Accept the carrier counteroffer of ${usd(Number(bid.counter_amount))}? Dispatch must still confirm assignment.`,
                            )
                          )
                            void act({
                              action: "accept_counter",
                              loadId: bid.load_id,
                              bidId: bid.id,
                              version: bid.version,
                            });
                        }}
                      >
                        Accept counteroffer
                      </button>
                    </>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <Empty>Your submitted bids will appear here.</Empty>
          )}
        </Panel>
        <Panel title="Your reservations">
          {data.bookings.length ? (
            <div className="space-y-4">
              {data.bookings.map((b) => (
                <article key={b.id} className="rounded-lg border p-4">
                  <h3 className="mb-3 font-medium">
                    {lane(allLoads.find((l) => l.id === b.load_id))}
                  </h3>
                  <Badge value={b.status} />
                  <p className="mt-3 text-sm">
                    Carrier rate: {usd(Number(b.amount))}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {b.status === "awaiting_dispatch"
                      ? "Received by dispatch. Await assignment and rate confirmation before dispatching."
                      : "Contact dispatch for load instructions."}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <Empty>No reservations yet.</Empty>
          )}
        </Panel>
      </div>
    </div>
  );
}
