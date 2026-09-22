"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Workspace } from "@/lib/portal-contract";
import { SignOutButton } from "./sign-out-button";
import { ProfileForm, LoadRequestForm } from "./workspace-forms";
import { CarrierBoard } from "./carrier-board";
import { WorkspaceDesk } from "./workspace-desk";
import {
  Badge,
  button,
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
}: {
  desk?: boolean;
  previewData?: Workspace;
}) {
  const [data, setData] = useState<Workspace | null>(previewData || null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("");
  const inFlight = useRef(false);
  const refresh = useCallback(async () => {
    if (previewData) return;
    const res = await fetch(`/api/portal/workspace${desk ? "?desk=1" : ""}`, {
      cache: "no-store",
    });
    const body = await res.json();
    if (!res.ok) {
      if (res.status === 401) window.location.assign("/portal");
      throw new Error(body.error || "Unable to load your portal.");
    }
    setData(body);
  }, [desk, previewData]);
  useEffect(() => {
    let active = true;
    refresh().catch((e) => {
      if (active) setError(e.message);
    });
    return () => {
      active = false;
    };
  }, [refresh]);
  const send = async (body: Record<string, unknown> | FormData) => {
    if (previewData) {
      setNotice("Local preview only. No data is saved or email sent.");
      return false;
    }
    if (inFlight.current) return false;
    inFlight.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const file = body instanceof FormData;
      const res = await fetch(
        `/api/portal/${file ? "documents" : "workspace"}`,
        {
          method: "POST",
          ...(file ? {} : { headers: { "Content-Type": "application/json" } }),
          body: file ? body : JSON.stringify(body),
        },
      );
      const result = await res.json();
      if (!res.ok)
        throw new Error(result.error || "Unable to save. Please retry.");
      setNotice(
        file
          ? "Document uploaded securely."
          : "Saved. Any required notifications are queued for delivery.",
      );
      try {
        await refresh();
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
  const p = data?.profile;
  const tabs = desk
    ? [
        "Setup reviews",
        "Bids & bookings",
        "Customer requests",
        "Documents & email",
      ]
    : p?.role === "carrier"
      ? ["Load board", "Setup & profile"]
      : [
          "Your load board",
          "Enter a load",
          "Company documents",
          "Company profile",
        ];
  const selected = tabs.includes(tab)
    ? tab
    : !desk && p && p.status !== "approved"
      ? p.role === "carrier"
        ? "Setup & profile"
        : "Company profile"
      : tabs[0];
  return (
    <section className="min-h-[70vh] border-t border-slate-200 bg-grid-technical text-[#14365b]">
      {previewData ? (
        <p className="bg-amber-100 px-6 py-3 text-center text-sm text-amber-900">
          LOCAL PREVIEW · Sample data only. Actions do not save data or send
          email.
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
                ? "Agent desk"
                : p?.role === "carrier"
                  ? "Carrier portal"
                  : p?.role === "customer"
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
                  {desk ? "My portal" : "Open agent desk"}
                </Link>
              ) : null}
              {!previewData ? <SignOutButton /> : null}
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
              Select the account you are setting up. This does not grant
              approved access or connect you to another company’s shipments.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {(["customer", "carrier"] as const).map((role) => (
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
                Refresh ↻
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
            ) : selected === "Setup & profile" ||
              selected === "Company profile" ? (
              <ProfileForm
                profile={p!}
                documents={data.documents}
                highwayUrl={data.highwayUrl}
                act={send}
                upload={send}
                busy={busy}
              />
            ) : p?.role === "carrier" ? (
              <CarrierBoard data={data} act={send} busy={busy} />
            ) : selected === "Enter a load" ? (
              <LoadRequestForm act={send} busy={busy} />
            ) : selected === "Company documents" ? (
              <Panel eyebrow="Your resource center" title="Company documents">
                <p className="mb-5 text-sm text-slate-600">
                  Download our current company documents securely. If a document
                  is missing, contact your coordinator.
                </p>
                <DocumentList docs={data.companyDocuments} company />
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
                          <div className="flex flex-wrap justify-between gap-3">
                            <h3 className="font-semibold">{lane(load)}</h3>
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
                      {p?.status === "approved"
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
          <a className="underline" href="mailto:sturma@blbxcritical.com">
            Contact your Five Nines coordinator
          </a>
          .
        </p>
      </div>
    </section>
  );
}
