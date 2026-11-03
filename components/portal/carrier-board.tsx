"use client";
import { Fragment, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Gavel, Search, X } from "lucide-react";
import { filterCarrierLoads } from "@/lib/portal-board";
import { HIGHWAY_ONBOARDING_EMAIL, highwayOnboardingMailto } from "@/lib/portal-highway-onboarding";
import {
  centralToday,
  setupMissing,
  type PortalLoad,
  type Workspace,
} from "@/lib/portal-contract";
import { pickupWindow } from "@/lib/portal-load-window";
import { groupOf, TAI_EQUIPMENT_GROUPS } from "@/lib/tai-equipment";
import { Badge, button, secondary, input, Empty, lane, Panel, usd, type Act } from "./workspace-ui";

const field =
  "h-9 rounded-md border border-slate-300 bg-white px-2.5 text-sm text-slate-900 focus:outline-2 focus:outline-blue-500";
const label = "mb-1 block font-mono text-[10px] uppercase tracking-[.16em] text-slate-500";

type SortKey = "ref" | "pickup" | "origin" | "destination" | "delivery" | "equipment" | "weight";

const shortDate = (iso: string | null) =>
  iso
    ? new Date(`${iso.slice(0, 10)}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "—";

const sortValue = (l: PortalLoad, key: SortKey): string | number | null => {
  switch (key) {
    case "ref": return l.external_id || null;
    case "pickup": return l.pickup_date;
    case "delivery": return l.delivery_date;
    case "origin": return `${l.origin_city}, ${l.origin_state}`;
    case "destination": return `${l.dest_city}, ${l.dest_state}`;
    case "equipment": return l.equipment;
    case "weight": return l.weight_lbs;
  }
};

export function CarrierBoard({
  data,
  act,
  busy,
  pickupFrom: windowFrom = centralToday(),
}: {
  data: Workspace;
  act: Act;
  busy: boolean;
  pickupFrom?: string;
  onPickupFromChange?: (date: string) => void;
}) {
  const [draft, setDraft] = useState({ search: "", pickupFrom: "", pickupThrough: "", origin: "", destination: "", equipment: "" });
  const [applied, setApplied] = useState(draft);
  const [bidding, setBidding] = useState<string | null>(null);
  const [booking, setBooking] = useState<string | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "pickup", dir: "asc" });
  const p = data.profile!;
  const ready = data.staff || (
    p.status === "approved" &&
    p.highway_status === "verified" &&
    !setupMissing(p, data.documents, centralToday()).length);
  const pickupRange = pickupWindow(windowFrom);
  const windowReady = !data.loadWindow || data.loadWindow.from === pickupRange.from;
  const equipmentTypes = [...new Set(data.loads.map((l) => l.equipment).filter(
    (type): type is string => !!type,
  ))].sort();
  const bidLoads = new Set(data.bids.filter((b) => b.status !== "denied").map((b) => b.load_id));

  const rows = useMemo(() => {
    const filtered = filterCarrierLoads(windowReady ? data.loads : [], applied)
      .filter((l) => !applied.equipment || l.equipment === applied.equipment);
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = sortValue(a, sort.key);
      const bv = sortValue(b, sort.key);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv), undefined, { numeric: true }) * dir;
    });
  }, [data.loads, windowReady, applied, sort]);

  const set = (key: keyof typeof draft) => (e: { target: { value: string } }) =>
    setDraft((d) => ({ ...d, [key]: e.target.value }));
  const clear = () => {
    const empty = { search: "", pickupFrom: "", pickupThrough: "", origin: "", destination: "", equipment: "" };
    setDraft(empty);
    setApplied(empty);
  };
  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  const columns: { key: SortKey; label: string; align?: "right" }[] = [
    { key: "ref", label: "Load #" },
    { key: "pickup", label: "Pickup" },
    { key: "origin", label: "Origin" },
    { key: "destination", label: "Destination" },
    { key: "delivery", label: "Delivery" },
    { key: "equipment", label: "Equipment" },
    { key: "weight", label: "Weight", align: "right" },
  ];
  const allLoads = [...data.loads, ...(data.historyLoads || [])];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-[#14365b] p-7 text-white">
        <h2 className="text-2xl font-semibold">Find your next lane.</h2>
        <p className="my-4 max-w-xl text-sm leading-6 text-blue-100">
          Pick a load below and send your bid. It goes straight to our dispatch team,
          who confirm assignment and send the rate confirmation before a truck rolls.
        </p>
        <a
          href="#carrier-loads"
          className="inline-block rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-[#14365b]"
        >
          View open loads →
        </a>
      </div>

      <Panel eyebrow="Carrier opportunities" title="Available loads">
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
          <div id="carrier-loads" className="flex scroll-mt-24 flex-col gap-5">
            <div role="group" aria-label="Filter by equipment" className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                aria-pressed={!applied.equipment}
                onClick={() => { setDraft((d) => ({ ...d, equipment: "" })); setApplied((a) => ({ ...a, equipment: "" })); }}
                className={`rounded-md px-3 py-1.5 text-xs font-medium ring-1 ring-inset transition ${!applied.equipment ? "bg-[#14365b] text-white ring-[#14365b]" : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"}`}
              >
                <span className="font-mono tabular-nums">{windowReady ? data.loads.length : 0}</span> Open loads
              </button>
              {TAI_EQUIPMENT_GROUPS.map((g) => {
                const count = data.loads.filter((l) => l.equipment && groupOf(l.equipment) === g.label).length;
                return count ? (
                  <span key={g.label} className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200">
                    <span className="font-mono tabular-nums">{count}</span> {g.label}
                  </span>
                ) : null;
              })}
            </div>

            <form
              className="flex flex-wrap items-end gap-x-4 gap-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4"
              onSubmit={(e) => { e.preventDefault(); setApplied(draft); }}
            >
              <div>
                <label className={label} htmlFor="cb-from">Pickup dates</label>
                <div className="flex flex-wrap items-center gap-2">
                  <input id="cb-from" aria-label="Pickup from" type="date" className={field} min={pickupRange.from} max={pickupRange.through} value={draft.pickupFrom} onChange={set("pickupFrom")} />
                  <span className="text-xs text-slate-500">to</span>
                  <input aria-label="Pickup through" type="date" className={field} min={pickupRange.from} max={pickupRange.through} value={draft.pickupThrough} onChange={set("pickupThrough")} />
                </div>
              </div>
              <div>
                <label className={label} htmlFor="cb-origin">Origin</label>
                <input id="cb-origin" className={`${field} w-36`} value={draft.origin} onChange={set("origin")} placeholder="City or state" />
              </div>
              <div>
                <label className={label} htmlFor="cb-dest">Destination</label>
                <input id="cb-dest" className={`${field} w-36`} value={draft.destination} onChange={set("destination")} placeholder="City or state" />
              </div>
              <div>
                <label className={label} htmlFor="cb-equip">Equipment</label>
                <select id="cb-equip" className={`${field} max-w-52`} value={draft.equipment} onChange={set("equipment")}>
                  <option value="">All equipment</option>
                  {TAI_EQUIPMENT_GROUPS.map((g) => (
                    <optgroup key={g.label} label={g.label}>
                      {equipmentTypes.filter((type) => groupOf(type) === g.label).map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className={label} htmlFor="cb-search">Reference</label>
                <input id="cb-search" type="search" className={`${field} w-40`} value={draft.search} onChange={set("search")} placeholder="Lane or load #" />
              </div>
              <div className="flex items-center gap-2">
                <button type="submit" className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#14365b] px-3.5 text-sm font-medium text-white hover:bg-[#24568a]">
                  <Search className="size-3.5" aria-hidden="true" />
                  Search
                </button>
                <button type="button" onClick={clear} className="inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm text-slate-600 hover:text-slate-900">
                  <X className="size-3.5" aria-hidden="true" />
                  Clear
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => act({ action: "refresh_loads", pickupFrom: windowFrom })}
                  className="inline-flex h-9 items-center rounded-md px-2.5 text-sm text-blue-700 hover:text-blue-900 disabled:opacity-50"
                >
                  {busy ? "Refreshing…" : "Refresh"}
                </button>
              </div>
            </form>

            <div className="overflow-hidden rounded-lg border border-slate-200">
              <div className="max-h-[70vh] overflow-auto">
                <table className="w-full min-w-[900px] border-collapse text-left text-[13px]">
                  <thead className="sticky top-0 z-10 bg-slate-100 text-slate-600">
                    <tr>
                      {columns.map((c) => {
                        const active = sort.key === c.key;
                        const Icon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
                        return (
                          <th
                            key={c.key}
                            scope="col"
                            aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                            className={`whitespace-nowrap px-3 py-2.5 font-medium ${c.align === "right" ? "text-right" : ""}`}
                          >
                            <button type="button" onClick={() => toggleSort(c.key)} className={`inline-flex items-center gap-1 hover:text-slate-900 ${active ? "text-[#14365b]" : ""}`}>
                              {c.label}
                              <Icon className={`size-3 ${active ? "" : "opacity-40"}`} aria-hidden="true" />
                            </button>
                          </th>
                        );
                      })}
                      <th scope="col" className="whitespace-nowrap px-3 py-2.5 text-right font-medium">Bid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {rows.map((load) => {
                      const open = bidding === load.id;
                      const bid = bidLoads.has(load.id);
                      return (
                        <Fragment key={load.id}>
                          <tr className={open ? "bg-blue-50/60" : "hover:bg-blue-50/40"}>
                            <td className="whitespace-nowrap px-3 py-2 font-mono text-blue-700">{load.external_id || "—"}</td>
                            <td className="whitespace-nowrap px-3 py-2 tabular-nums">{shortDate(load.pickup_date)}</td>
                            <td className="whitespace-nowrap px-3 py-2">{`${load.origin_city}, ${load.origin_state}`.toUpperCase()}</td>
                            <td className="whitespace-nowrap px-3 py-2">{`${load.dest_city}, ${load.dest_state}`.toUpperCase()}</td>
                            <td className="whitespace-nowrap px-3 py-2 tabular-nums">{shortDate(load.delivery_date)}</td>
                            <td className="whitespace-nowrap px-3 py-2">{load.equipment || "—"}</td>
                            <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                              {load.weight_lbs ? `${load.weight_lbs.toLocaleString()} lb` : "—"}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2 text-right">
                              <button
                                type="button"
                                aria-expanded={open}
                                onClick={() => { setBidding(open ? null : load.id); setBooking(null); }}
                                className={`inline-flex items-center gap-1 rounded px-2.5 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-wide ring-1 ring-inset transition ${
                                  bid
                                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-100"
                                    : "bg-[#14365b] text-white ring-[#14365b] hover:bg-[#24568a]"
                                }`}
                              >
                                <Gavel className="size-3" aria-hidden="true" />
                                {bid ? "Bid sent" : "Bid"}
                              </button>
                            </td>
                          </tr>
                          {open ? (
                            <tr className="bg-blue-50/60">
                              <td colSpan={columns.length + 1} className="px-3 pb-4 pt-1">
                                <form
                                  className="flex flex-wrap items-end gap-3"
                                  onSubmit={async (e) => {
                                    e.preventDefault();
                                    const f = new FormData(e.currentTarget);
                                    if (await act({ action: "submit", loadId: load.id, amount: f.get("amount"), note: f.get("note") }))
                                      setBidding(null);
                                  }}
                                >
                                  <label className="block text-xs text-slate-600">
                                    Your bid (USD)
                                    <input aria-label={`Bid for ${lane(load)}`} className={`${input} max-w-36`} name="amount" type="number" min="0.01" max="1000000" step="0.01" required autoFocus disabled={busy} />
                                  </label>
                                  <label className="block text-xs text-slate-600">
                                    Optional note
                                    <input className={`${input} w-64`} name="note" maxLength={1000} disabled={busy} placeholder="Truck ready time, equipment notes" />
                                  </label>
                                  <button className={button} disabled={busy}>{busy ? "Sending…" : "Send bid"}</button>
                                  <button type="button" className={secondary} onClick={() => setBidding(null)}>Cancel</button>
                                  {load.auto_book && load.carrier_offer_usd != null ? (
                                    <button type="button" className={secondary} disabled={busy} onClick={() => setBooking(load.id)}>
                                      Auto-book at {usd(load.carrier_offer_usd)}
                                    </button>
                                  ) : null}
                                  <p className="basis-full text-xs leading-5 text-slate-600">
                                    Dispatch receives your bid with {p.details.contact}, {p.details.phone} and {p.email}. This is not a rate confirmation.
                                  </p>
                                </form>
                                {booking === load.id ? (
                                  <div className="mt-4 rounded-lg border border-blue-200 bg-white p-4" role="group" aria-label="Confirm reservation">
                                    <p className="mb-3 text-sm leading-6">
                                      Reserve this load at <strong>{usd(load.carrier_offer_usd!)}</strong>? It leaves the open board and goes to dispatch.
                                      Do not dispatch a truck until assignment is confirmed.
                                    </p>
                                    <div className="flex gap-3">
                                      <button
                                        type="button"
                                        className={button}
                                        disabled={busy}
                                        onClick={async () => {
                                          if (await act({ action: "auto_book", loadId: load.id, amount: load.carrier_offer_usd }))
                                            { setBooking(null); setBidding(null); }
                                        }}
                                      >
                                        Confirm reservation
                                      </button>
                                      <button type="button" className={secondary} onClick={() => setBooking(null)}>Cancel</button>
                                    </div>
                                  </div>
                                ) : null}
                              </td>
                            </tr>
                          ) : null}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
                {!rows.length ? (
                  <p className="p-8 text-center text-sm text-slate-500">
                    {windowReady ? "No open loads match these filters." : "Loading open loads…"}
                  </p>
                ) : null}
              </div>
              <p className="border-t border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500" aria-live="polite">
                Showing {rows.length} of {windowReady ? data.loads.length : 0} open loads · pickup {pickupRange.from} through {pickupRange.through}
              </p>
            </div>
          </div>
        )}
      </Panel>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Panel title="Your bids & counteroffers">
          {data.bids.length ? (
            <div className="space-y-4">
              {data.bids.map((b) => (
                <article key={b.id} className="rounded-lg border p-4">
                  <h3 className="mb-2 font-medium">{lane(allLoads.find((l) => l.id === b.load_id))}</h3>
                  <Badge value={b.status} />
                  <p className="my-3 text-sm">Your bid: {usd(Number(b.amount))}</p>
                  {b.status === "countered" && b.counter_amount ? (
                    <>
                      <p className="mb-3 text-sm">
                        Dispatch offers: <strong>{usd(Number(b.counter_amount))}</strong>
                      </p>
                      <button
                        className={button}
                        disabled={busy || !ready}
                        onClick={() => {
                          if (window.confirm(`Accept the carrier counteroffer of ${usd(Number(b.counter_amount))}? Dispatch must still confirm assignment.`))
                            void act({ action: "accept_counter", loadId: b.load_id, bidId: b.id, version: b.version });
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
                  <h3 className="mb-3 font-medium">{lane(allLoads.find((l) => l.id === b.load_id))}</h3>
                  <Badge value={b.status} />
                  <p className="mt-3 text-sm">Carrier rate: {usd(Number(b.amount))}</p>
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
