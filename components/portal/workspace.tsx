"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { centralToday, type Workspace } from "@/lib/portal-contract";
import { readPortalBody, uploadDocument } from "@/lib/portal-upload-client";
import { portalView } from "@/lib/portal-view";
import { SignOutButton } from "./sign-out-button";
import { ProfileForm, LoadRequestForm, UploadForm } from "./workspace-forms";
import { CarrierBoard } from "./carrier-board";
import { WorkspaceDesk } from "./workspace-desk";
import { ShipmentBoard } from "./shipment-board";
import { ReadOnlyPortalView } from "./read-only-portal-view";
import {
  Badge,
  secondary,
  Empty,
  DocumentList,
  lane,
  LoadFacts,
  Panel,
} from "./workspace-ui";

export function PortalWorkspace({
  desk = false,
  previewData,
  initialRole,
}: {
  desk?: boolean;
  previewData?: Workspace;
  initialRole?: "carrier" | "customer";
}) {
  const [data, setData] = useState<Workspace | null>(previewData || null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("");
  const [pickupFrom, setPickupFrom] = useState(() => centralToday());
  const inFlight = useRef(false);
  const refreshVersion = useRef(0);
  const dataRef = useRef(data);
  dataRef.current = data;
  const p = data?.profile;
  const staff = !!data?.staff;
  const { role: viewRole, readOnly: alternateView } = portalView({
    staff, profileRole: p?.role, requestedRole: initialRole,
  });
  const readOnly = !desk && alternateView;
  const refresh = useCallback(async (afterSave = false) => {
    if (previewData || (inFlight.current && !afterSave)) return;
    const version = ++refreshVersion.current;
    try {
      const params = new URLSearchParams();
      if (desk) params.set("desk", "1");
      else if (initialRole) params.set("role", initialRole);
      if (!afterSave && dataRef.current?.loadVersion)
        params.set("loadsVersion", dataRef.current.loadVersion);
      if (!desk && initialRole === "carrier") params.set("pickupFrom", pickupFrom);
      const query = params.size ? `?${params}` : "";
      const res = await fetch(`/api/portal/workspace${query}`, {
        cache: "no-store",
      });
      const body = await readPortalBody(res);
      // A pending poll can finish after a bid or reservation is saved. It must
      // not overwrite the newer workspace response or trigger an old redirect.
      if (version !== refreshVersion.current) return;
      if (!res.ok) {
        if (res.status === 401 || (desk && res.status === 403)) {
          setData(null);
          window.location.assign(desk ? "/agent-desk" : "/portal");
        }
        throw new Error(String(body.error || "Unable to load your portal."));
      }
      const nextData = body as unknown as Workspace;
      if (nextData.loadsUnchanged && dataRef.current) {
        nextData.loads = dataRef.current.loads;
      }
      setData(nextData);
    } catch (e) {
      if (version === refreshVersion.current) throw e;
    }
  }, [desk, previewData, initialRole, pickupFrom]);
  useEffect(() => {
    let active = true;
    refresh().catch((e) => {
      if (active) setError(e.message);
    });
    const timer = previewData ? null : window.setInterval(() => {
      if (!inFlight.current) void refresh().catch((e) => {
        if (active) setError(e.message);
      });
    }, 60_000);
    return () => {
      active = false;
      if (timer !== null) window.clearInterval(timer);
    };
  }, [refresh]);
  const send = async (body: Record<string, unknown> | FormData) => {
    if (readOnly) {
      setNotice("Read-only staff view. Return to your account portal to use its approved actions.");
      return false;
    }
    if (previewData) {
      setNotice("Test mode: this workspace action does not save, upload, book or send email.");
      return false;
    }
    if (inFlight.current) return false;
    inFlight.current = true;
    ++refreshVersion.current;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const file = body instanceof FormData;
      if (file) {
        setNotice(await uploadDocument(body));
      } else {
        const res = await fetch("/api/portal/workspace", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const result = await readPortalBody(res);
        if (!res.ok)
          throw new Error(String(result.error || "Unable to save. Please retry."));
        setNotice(
          body.action === "refresh_loads"
            ? "Load board updated with the latest open freight."
            : "Saved. Any required notifications are queued for delivery.",
        );
      }
      try {
        await refresh(true);
      } catch {
        setError(
          "Saved successfully, but the view could not refresh. Refresh before making another change.",
        );
      }
      return true;
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Connection failed. Refresh before retrying.",
      );
      return false;
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };
  // Staff may inspect either portal, but a different saved role stays read-only.
  const approved = staff || p?.status === "approved";
  const tabs = desk
    ? [
        "Setup reviews",
        "Bids & bookings",
        "Customer requests",
        "Documents & email",
      ]
    : readOnly ? ["Read-only view"]
    : viewRole === "carrier"
      ? ["Load board", "My loads", "Setup & profile"]
      : [
          "Your load board",
          "Enter a load",
          "My documents",
          "Company documents",
          "Company profile",
        ];
  const selected = tabs.includes(tab)
    ? tab
    : !desk && p && !approved
      ? viewRole === "carrier"
        ? "Setup & profile"
        : "Company profile"
      : tabs[0];
  return (
    <section className="min-h-[70vh] border-t border-slate-200 bg-grid-technical text-[#14365b]">
      {previewData ? (
        <p className="bg-amber-100 px-6 py-3 text-center text-sm text-amber-900">
          TEST MODE · Sample data only. Workspace actions do not save, upload, book
          or send automatically. Email links open your email app.
        </p>
      ) : null}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.2em] text-blue-600">
              Five Nines · {desk ? "Operations" : "Your connection"}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {desk
                ? "Portal review desk"
                : viewRole === "carrier"
                  ? "Carrier portal"
                  : viewRole === "customer"
                    ? "Customer portal"
                    : "Welcome to your portal"}
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              {data?.email || "Secure account access"}
            </p>
          </div>
          {data ? (
            <div className="flex flex-wrap items-center gap-3">
              {data.staff ? (
                <Link
                  className={secondary}
                  href={desk ? "/portal/home" : "/agent-desk"}
                >
                  {desk ? "My portal" : "Review portal submissions"}
                </Link>
              ) : null}
              {!previewData ? <SignOutButton redirectTo={desk ? "/agent-desk" : "/portal"} /> : null}
            </div>
          ) : null}
        </div>
        {error ? (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            {error}{" "}
            <button
              className="ml-2 underline"
              onClick={() => {
                setError("");
                void refresh().catch((e) => setError(e.message));
              }}
            >
              Refresh
            </button>
          </div>
        ) : null}
        {notice ? (
          <p
            role="status"
            className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            {notice}
          </p>
        ) : null}
        {!data && !error ? (
          <p role="status" className="py-12 text-slate-500">
            Loading your workspace…
          </p>
        ) : null}
        {data && !p && !desk ? (
          <Panel title="Choose your portal">
            <p className="mb-5 text-sm text-slate-600">
              Start your {initialRole || "portal"} profile. This does not grant
              approved access or connect you to another company’s shipments.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {(initialRole ? [initialRole] : (["customer", "carrier"] as const)).map((role) => (
                <button
                  key={role}
                  disabled={busy}
                  className="rounded-xl border border-slate-200 p-7 text-left transition hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50"
                  onClick={() =>
                    void send({
                      action: "initialize",
                      role,
                      company: data.company,
                    })
                  }
                >
                  <span className="text-xl font-semibold">
                    {role === "carrier" ? "Carrier portal" : "Customer portal"}{" "}
                    →
                  </span>
                  <span className="mt-3 block text-sm leading-6 text-slate-600">
                    {role === "carrier"
                      ? "Complete your packet, verify setup and bid on open freight."
                      : "Access company documents, enter loads and follow your shipments."}
                  </span>
                </button>
              ))}
            </div>
          </Panel>
        ) : null}
        {data && (p || desk) ? (
          <>
            <div className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200">
              <nav
                className="flex flex-wrap gap-1"
                aria-label="Portal sections"
              >
                {tabs.map((t) => (
                  <button
                    key={t}
                    aria-current={selected === t ? "page" : undefined}
                    className={`border-b-2 px-4 py-4 text-sm font-medium ${selected === t ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-900"}`}
                    onClick={() => setTab(t)}
                  >
                    {t}
                  </button>
                ))}
              </nav>
              <button
                disabled={busy}
                className="px-3 py-3 text-sm text-blue-700"
                onClick={() => void refresh().catch((e) => setError(e.message))}
              >
                Refresh ���
              </button>
            </div>
            {desk ? (
              <WorkspaceDesk
                data={data}
                tab={selected}
                act={send}
                upload={send}
                busy={busy}
              />
            ) : readOnly ? (
              <ReadOnlyPortalView data={data} readOnlySamples={!!previewData} />
            ) : selected === "Setup & profile" ||
              selected === "Company profile" ? (
              <ProfileForm
                profile={p!}
                documents={data.documents}
                highwayUrl={data.highwayUrl}
                readOnlySamples={!!previewData}
                act={send}
                upload={send}
                busy={busy}
              />
            ) : viewRole === "carrier" && selected === "My loads" ? (
              <ShipmentBoard role="carrier" staff={staff} preview={!!previewData} />
            ) : viewRole === "carrier" ? (
              <CarrierBoard
                data={data}
                act={send}
                busy={busy}
                pickupFrom={pickupFrom}
                onPickupFromChange={setPickupFrom}
              />
            ) : selected === "Enter a load" ? (
              <LoadRequestForm act={send} busy={busy} />
            ) : selected === "My documents" ? (
              <Panel eyebrow="Your account" title="My documents">
                <p className="mb-5 text-sm leading-6 text-slate-600">
                  Upload shipping paperwork to your account — bills of lading,
                  purchase orders, packing lists. Private files · PDF, JPG or
                  PNG · up to 15 MB each. Documents stay saved to your account.
                </p>
                <UploadForm upload={send} busy={busy} customer />
                <div className="mt-6">
                  <DocumentList docs={data.documents} readOnlySamples={!!previewData} />
                </div>
              </Panel>
            ) : selected === "Company documents" ? (
              <Panel eyebrow="Your resource center" title="Company documents">
                <p className="mb-5 text-sm text-slate-600">
                  Download our current company documents securely. If a document
                  is missing, contact your coordinator.
                </p>
                <DocumentList docs={data.companyDocuments} company readOnlySamples={!!previewData} />
              </Panel>
            ) : (
              <div className="space-y-6">
                <div className="rounded-xl bg-[#14365b] p-7 text-white">
                  <h2 className="text-2xl font-semibold">
                    Your next project starts here.
                  </h2>
                  <p className="my-4 max-w-xl text-sm leading-6 text-blue-100">
                    Tell us the lane, load and delivery window. Our team will
                    coordinate the next steps with you.
                  </p>
                  <button
                    className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-[#14365b]"
                    onClick={() => setTab("Enter a load")}
                  >
                    Enter a load →
                  </button>
                </div>
                <ShipmentBoard role="customer" staff={staff} preview={!!previewData} />
                <Panel title="Your load board">
                  <p className="mb-6 text-sm leading-6 text-slate-600">
                    Only shipments linked to your verified customer account are
                    shown. Tracking is the latest location reported by your
                    coordinator or TAI feed, not a live GPS map.
                  </p>
                  {data.loads.length ? (
                    <div className="space-y-4">
                      {data.loads.map((load) => (
                        <article
                          key={load.id}
                          className="rounded-lg border p-5"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              {load.external_id ? (
                                <p className="font-mono text-[11px] uppercase tracking-[.2em] text-blue-600">
                                  Ref {load.external_id}
                                </p>
                              ) : null}
                              <h3 className="font-semibold">{lane(load)}</h3>
                            </div>
                            <Badge value={load.status} />
                          </div>
                          <LoadFacts load={load} />
                          <p className="my-4 rounded-lg bg-slate-50 p-3 text-sm">
                            {load.tracking_location
                              ? `Last reported: ${load.tracking_location}${load.tracking_at ? ` · ${new Date(load.tracking_at).toLocaleString()}` : ""}`
                              : "No tracking update available yet. Contact your coordinator."}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {(["pod", "invoice"] as const).map((kind) => (
                              <button
                                key={kind}
                                className={secondary}
                                disabled={
                                  busy ||
                                  data.requests.some(
                                    (r) =>
                                      r.kind === kind &&
                                      r.load_id === load.id &&
                                      r.status !== "completed",
                                  )
                                }
                                onClick={() =>
                                  void send({
                                    action: "customer_request",
                                    kind,
                                    loadId: load.id,
                                  })
                                }
                              >
                                Request {kind === "pod" ? "POD" : "invoice"}
                              </button>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <Empty>
                      {approved
                        ? "No shipments have been synced to your account yet."
                        : "Your shipments will appear after dispatch verifies and links your company account. You can enter a load request now."}
                    </Empty>
                  )}
                </Panel>
                <Panel title="Your requests">
                  {data.requests.length ? (
                    <ul className="divide-y">
                      {data.requests.map((r) => (
                        <li
                          key={r.id}
                          className="flex flex-wrap items-center justify-between gap-3 py-4"
                        >
                          <span className="text-sm">
                            {r.kind === "load"
                              ? `${r.details.origin} → ${r.details.destination}`
                              : `${r.kind.toUpperCase()} request`}
                          </span>
                          <Badge value={r.status} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Empty>No requests yet.</Empty>
                  )}
                </Panel>
              </div>
            )}
          </>
        ) : null}
        <p className="mt-8 text-xs leading-6 text-slate-500">
          Need help?{" "}
          <a className="underline" href="mailto:info@shipfivenines.com">
            Contact your Five Nines coordinator
          </a>
          .
        </p>
      </div>
    </section>
  );
}
