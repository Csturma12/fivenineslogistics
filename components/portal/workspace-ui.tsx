"use client";
import type { ReactNode } from "react";
import type { PortalDoc, PortalLoad } from "@/lib/portal-contract";

export const button =
  "inline-flex items-center justify-center rounded-md bg-[#14365b] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#24568a] disabled:cursor-wait disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";
export const secondary =
  "inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-[#14365b] hover:bg-slate-50 disabled:opacity-50";
export const input =
  "mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-2 focus:outline-blue-500";
export type Act = (body: Record<string, unknown>) => Promise<boolean>;
export type Upload = (data: FormData) => Promise<boolean>;
export const documentKindLabel = (kind: string) =>
  kind === "packet"
    ? "Carrier packet"
    : kind === "coi"
      ? "Certificate of insurance (COI)"
      : kind === "w9"
        ? "W-9"
        : kind === "noa"
          ? "Notice of assignment (NOA)"
          : kind.toUpperCase();
export function Panel({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      {eyebrow ? (
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-blue-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mb-5 text-xl font-semibold tracking-tight text-[#14365b]">
        {title}
      </h2>
      {children}
    </section>
  );
}
export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-600">
      {children}
    </p>
  );
}
export function Badge({ value }: { value: string }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${value === "approved" || value === "confirmed" ? "bg-emerald-50 text-emerald-800" : "bg-blue-50 text-blue-800"}`}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}
export function Field({
  label,
  name,
  value = "",
  type = "text",
  required = false,
  maxLength = 1000,
}: {
  label: string;
  name: string;
  value?: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        className={input}
        name={name}
        defaultValue={value}
        type={type}
        required={required}
        maxLength={maxLength}
      />
    </label>
  );
}
export function DocumentList({
  docs,
  company = false,
  readOnlySamples = false,
}: {
  docs: PortalDoc[];
  company?: boolean;
  readOnlySamples?: boolean;
}) {
  return docs.length ? (
    <ul className="divide-y divide-slate-100">
      {docs.map((doc) => (
        <li key={doc.id} className="py-3">
          {readOnlySamples ? (
            <span className="text-sm font-medium text-slate-600">
              {doc.title || `${doc.kind === "combined" ? "MASTER PACKET" : doc.kind?.toUpperCase()} · ${doc.name}`} · Sample only
            </span>
          ) : <a
            className="text-sm font-medium text-blue-700 underline underline-offset-4"
            href={`/api/portal/documents?id=${doc.id}${company ? "&company=1" : ""}`}
            target="_blank"
            rel="noreferrer"
          >
            {doc.title ||
              `${doc.kind === "combined" ? "MASTER PACKET" : doc.kind?.toUpperCase()} · ${doc.name}`}
          </a>}
          {!company && doc.kind === "combined" ? (
            <p className="mt-2 text-xs leading-5 text-slate-600">
              {doc.reviewed_at
                ? `Staff reviewed ${new Date(doc.reviewed_at).toLocaleDateString("en-US")} · Confirmed contents: ${doc.included_kinds?.length ? doc.included_kinds.map(documentKindLabel).join(", ") : "none confirmed"}.`
                : "Received — awaiting staff review of the documents inside."}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  ) : (
    <Empty>No documents have been added yet.</Empty>
  );
}
export const usd = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
export const lane = (load?: PortalLoad) =>
  load
    ? `${load.origin_city}, ${load.origin_state} → ${load.dest_city}, ${load.dest_state}`
    : "Load no longer on the open board";
export function LoadFacts({ load }: { load: PortalLoad }) {
  return (
    <dl className="my-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
      {[
        ["Pickup", load.pickup_date || "Confirm with dispatch"],
        ["Delivery", load.delivery_date || "Confirm with dispatch"],
        ["Equipment", load.equipment || "Contact dispatch"],
        [
          "Weight",
          load.weight_lbs
            ? `${Number(load.weight_lbs).toLocaleString()} lb`
            : "Not provided",
        ],
        ...(load.dimensions ? [["Dimensions", load.dimensions]] : []),
      ].map(([label, value]) => (
        <div key={label}>
          <dt className="mb-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">
            {label}
          </dt>
          <dd className="font-medium text-slate-800">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
