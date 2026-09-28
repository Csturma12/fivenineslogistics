"use client";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { ArrowDown, ArrowUp, ArrowUpDown, Search, X } from "lucide-react";
import type { PortalShipment, ReferenceType, ShipmentStage } from "@/lib/portal-shipments";
import { Empty, Panel } from "./workspace-ui";

type Response = {
  shipments: PortalShipment[];
  customers?: string[];
  notice?: string;
  showCustomer: boolean;
};

type Preset = "next7" | "last7" | "last30" | "last90" | "year" | "all" | "custom";
type SortKey = "stage" | "loadNumber" | "customer" | "carrier" | "pickup" | "origin" | "destination" | "delivery" | "weight" | "po";

const PRESETS: { value: Preset; label: string }[] = [
  { value: "next7", label: "Next 7 days" },
  { value: "last7", label: "Last 7 days" },
  { value: "last30", label: "Last 30 days" },
  { value: "last90", label: "Last 90 days" },
  { value: "year", label: "Last year" },
  { value: "all", label: "All time" },
  { value: "custom", label: "Custom range" },
];

const STAGES: { value: ShipmentStage; label: string; pill: string }[] = [
  { value: "uncovered", label: "Uncovered", pill: "bg-red-50 text-red-700 ring-red-200" },
  { value: "covered", label: "Covered", pill: "bg-blue-50 text-blue-700 ring-blue-200" },
  { value: "in_transit", label: "In transit", pill: "bg-amber-50 text-amber-800 ring-amber-200" },
  { value: "delivered", label: "Delivered", pill: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  { value: "cancelled", label: "Cancelled", pill: "bg-slate-100 text-slate-600 ring-slate-200" },
];
const STAGE_ORDER = Object.fromEntries(STAGES.map((s, i) => [s.value, i])) as Record<ShipmentStage, number>;

const field =
  "h-9 rounded-md border border-slate-300 bg-white px-2.5 text-sm text-slate-900 focus:outline-2 focus:outline-blue-500";
const label = "mb-1 block font-mono text-[10px] uppercase tracking-[.16em] text-slate-500";

function isoOffset(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function presetRange(preset: Preset): { from: string; to: string } {
  switch (preset) {
    case "next7":
      return { from: isoOffset(0), to: isoOffset(7) };
    case "last7":
      return { from: isoOffset(-7), to: isoOffset(0) };
    case "last30":
      return { from: isoOffset(-30), to: isoOffset(0) };
    case "last90":
      return { from: isoOffset(-90), to: isoOffset(0) };
    case "year":
      return { from: isoOffset(-365), to: isoOffset(0) };
    default:
      return { from: "", to: "" };
  }
}

const shortDate = (iso: string | null) =>
  iso
    ? new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "—";

async function fetcher(url: string): Promise<Response> {
  const res = await fetch(url, { cache: "no-store" });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || "Unable to load shipments.");
  return body;
}

export function ShipmentBoard({
  role,
  staff,
  preview,
}: {
  role: "customer" | "carrier";
  staff: boolean;
  preview?: boolean;
}) {
  const [preset, setPreset] = useState<Preset>("last90");
  const [from, setFrom] = useState(() => presetRange("last90").from);
  const [to, setTo] = useState(() => presetRange("last90").to);
  const [customer, setCustomer] = useState("");
  const [refType, setRefType] = useState<ReferenceType>("po");
  const [ref, setRef] = useState("");
  const [applied, setApplied] = useState({ from, to, customer, refType, ref });
  const [stage, setStage] = useState<ShipmentStage | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "pickup", dir: "desc" });

  const params = new URLSearchParams({ role, refType: applied.refType });
  if (applied.from) params.set("from", applied.from);
  if (applied.to) params.set("to", applied.to);
  if (applied.ref) params.set("ref", applied.ref);
  if (applied.customer) params.set("customer", applied.customer);
  const { data, error, isLoading } = useSWR(
    preview ? null : `/api/portal/shipments?${params}`,
    fetcher,
    { revalidateOnFocus: false, keepPreviousData: true },
  );

  const shipments = data?.shipments ?? [];
  const showCustomer = data?.showCustomer ?? role === "customer";
  const counts = useMemo(() => {
    const c = {} as Record<ShipmentStage, number>;
    for (const s of shipments) c[s.stage] = (c[s.stage] || 0) + 1;
    return c;
  }, [shipments]);

  const rows = useMemo(() => {
    const filtered = stage ? shipments.filter((s) => s.stage === stage) : shipments;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = sort.key === "stage" ? STAGE_ORDER[a.stage] : a[sort.key];
      const bv = sort.key === "stage" ? STAGE_ORDER[b.stage] : b[sort.key];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv), undefined, { numeric: true }) * dir;
    });
  }, [shipments, stage, sort]);

  const apply = (next: Partial<typeof applied> = {}) =>
    setApplied({ from, to, customer, refType, ref, ...next });

  const choosePreset = (value: Preset) => {
    setPreset(value);
    if (value === "custom") return;
    const range = presetRange(value);
    setFrom(range.from);
    setTo(range.to);
    apply(range);
  };

  const clear = () => {
    const range = presetRange("last90");
    setPreset("last90");
    setFrom(range.from);
    setTo(range.to);
    setCustomer("");
    setRefType("po");
    setRef("");
    setStage(null);
    setApplied({ ...range, customer: "", refType: "po", ref: "" });
  };

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  const columns: { key: SortKey; label: string; align?: "right" }[] = [
    { key: "stage", label: "Status" },
    { key: "loadNumber", label: "Load #" },
    ...(showCustomer ? [{ key: "customer" as const, label: "Customer" }] : []),
    { key: "carrier", label: "Carrier" },
    { key: "pickup", label: "Pickup" },
    { key: "origin", label: "Origin" },
    { key: "destination", label: "Destination" },
    { key: "delivery", label: "Delivery" },
    { key: "weight", label: "Weight", align: "right" },
    { key: "po", label: "PO #" },
  ];

  return (
    <Panel
      eyebrow={role === "carrier" ? "Your hauled freight" : "Your freight"}
      title={role === "carrier" ? "My loads" : "Shipments"}
    >
      <div className="flex flex-col gap-5">
        <div role="group" aria-label="Filter by stage" className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-pressed={stage === null}
            onClick={() => setStage(null)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium ring-1 ring-inset transition ${stage === null ? "bg-[#14365b] text-white ring-[#14365b]" : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"}`}
          >
            <span className="font-mono tabular-nums">{shipments.length}</span> All
          </button>
          {STAGES.map((s) => (
            <button
              key={s.value}
              type="button"
              aria-pressed={stage === s.value}
              onClick={() => setStage(stage === s.value ? null : s.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium ring-1 ring-inset transition ${stage === s.value ? "bg-[#14365b] text-white ring-[#14365b]" : `${s.pill} hover:brightness-95`}`}
            >
              <span className="font-mono tabular-nums">{counts[s.value] || 0}</span> {s.label}
            </button>
          ))}
        </div>

        <form
          className="flex flex-wrap items-end gap-x-4 gap-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            apply();
          }}
        >
          <div>
            <label htmlFor="sb-preset" className={label}>
              Pickup dates
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <select
                id="sb-preset"
                className={field}
                value={preset}
                onChange={(e) => choosePreset(e.target.value as Preset)}
              >
                {PRESETS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              <span className="text-xs text-slate-500">from</span>
              <input
                aria-label="Pickup from"
                type="date"
                className={field}
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setPreset("custom");
                }}
              />
              <span className="text-xs text-slate-500">to</span>
              <input
                aria-label="Pickup to"
                type="date"
                className={field}
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setPreset("custom");
                }}
              />
            </div>
          </div>

          {staff && data?.customers ? (
            <div>
              <label htmlFor="sb-customer" className={label}>
                Customer
              </label>
              <select
                id="sb-customer"
                className={`${field} max-w-60`}
                value={customer}
                onChange={(e) => {
                  setCustomer(e.target.value);
                  apply({ customer: e.target.value });
                }}
              >
                <option value="">All customers</option>
                {data.customers.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div>
            <label htmlFor="sb-ref" className={label}>
              Reference
            </label>
            <div className="flex items-center gap-2">
              <select
                aria-label="Reference type"
                className={field}
                value={refType}
                onChange={(e) => setRefType(e.target.value as ReferenceType)}
              >
                <option value="po">PO #</option>
                <option value="load">Load #</option>
                <option value="any">Any reference</option>
              </select>
              <input
                id="sb-ref"
                className={`${field} w-40`}
                value={ref}
                maxLength={40}
                onChange={(e) => setRef(e.target.value)}
                placeholder="Enter number"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#14365b] px-3.5 text-sm font-medium text-white hover:bg-[#24568a]"
            >
              <Search className="size-3.5" aria-hidden="true" />
              Search
            </button>
            <button
              type="button"
              onClick={clear}
              className="inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm text-slate-600 hover:text-slate-900"
            >
              <X className="size-3.5" aria-hidden="true" />
              Clear
            </button>
          </div>
        </form>

        {preview ? (
          <Empty>Test mode: live shipments load here for signed-in accounts.</Empty>
        ) : error ? (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error.message}
          </p>
        ) : data?.notice ? (
          <Empty>{data.notice}</Empty>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="max-h-[70vh] overflow-auto">
              <table className="w-full min-w-[960px] border-collapse text-left text-[13px]">
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
                          <button
                            type="button"
                            onClick={() => toggleSort(c.key)}
                            className={`inline-flex items-center gap-1 hover:text-slate-900 ${active ? "text-[#14365b]" : ""}`}
                          >
                            {c.label}
                            <Icon className={`size-3 ${active ? "" : "opacity-40"}`} aria-hidden="true" />
                          </button>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {rows.map((s) => {
                    const st = STAGES[STAGE_ORDER[s.stage]];
                    return (
                      <tr key={s.id} className="hover:bg-blue-50/40">
                        <td className="whitespace-nowrap px-3 py-2">
                          <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${st.pill}`}>
                            {st.label}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 font-mono text-blue-700">{s.loadNumber}</td>
                        {showCustomer ? (
                          <td className="max-w-52 truncate px-3 py-2 font-medium text-slate-900" title={s.customer || ""}>
                            {s.customer || "—"}
                          </td>
                        ) : null}
                        <td className="max-w-56 truncate px-3 py-2" title={s.carrier || ""}>
                          {s.carrier || <span className="italic text-slate-400">Not assigned</span>}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 tabular-nums">{shortDate(s.pickup)}</td>
                        <td className="whitespace-nowrap px-3 py-2">{s.origin}</td>
                        <td className="whitespace-nowrap px-3 py-2">{s.destination}</td>
                        <td className="whitespace-nowrap px-3 py-2 tabular-nums">{shortDate(s.delivery)}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                          {s.weight ? `${s.weight.toLocaleString()} lb` : "—"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 font-mono">{s.po || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {!rows.length ? (
                <p className="p-8 text-center text-sm text-slate-500">
                  {isLoading ? "Loading shipments…" : "No shipments match these filters."}
                </p>
              ) : null}
            </div>
            <p className="border-t border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500" aria-live="polite">
              {isLoading && rows.length ? "Updating… " : ""}Showing {rows.length} of {shipments.length}
              {shipments.length >= 1000 ? " (first 1,000 — narrow the date range)" : ""}
            </p>
          </div>
        )}
      </div>
    </Panel>
  );
}
