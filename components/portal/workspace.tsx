"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DOCUMENT_BUCKET, type Workspace } from "@/lib/portal-contract";
import { createClient } from "@/lib/supabase/client";
import { SignOutButton } from "./sign-out-button";
import { ProfileForm, LoadRequestForm, UploadForm } from "./workspace-forms";
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

const MAX_UPLOAD_BYTES = 15_728_640; // 15 MB

async function readBody(res: Response): Promise<{ error?: string; [k: string]: unknown }> {
  const raw = await res.text();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    // Non-JSON response (e.g. platform 413 "Request Entity Too Large" or a proxy error page).
    return {
      error:
        res.status === 413
          ? "That file is too large to upload. Each file must be 15 MB or smaller."
          : `Something went wrong (${res.status || "network error"}). Please try again.`,
    };
  }
}

// Direct-to-storage upload. The file bytes go straight to Supabase Storage via a
// one-time signed URL, so they never pass through the API route (which is capped
// at ~4.5 MB on Vercel and lower behind the preview proxy). The route only issues
// the signed URL and, afterwards, records the verified metadata.
async function uploadDocument(form: FormData): Promise<string> {
  const file = form.get("file");
  const kind = String(form.get("kind") || "");
  const title = String(form.get("title") || "");
  const split = String(form.get("split") || "") === "yes";
  if (!(file instanceof File) || file.size === 0)
    throw new Error("Choose a PDF, JPG or PNG to upload.");
  if (file.size > MAX_UPLOAD_BYTES)
    throw new Error("That file is too large. Each file must be 15 MB or smaller.");
  if (split && file.type !== "application/pdf")
    throw new Error("Auto-split needs a PDF. Upload a PDF or turn off splitting.");

  const signRes = await fetch("/api/portal/documents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "sign", kind, name: file.name, title }),
  });
  const signed = await readBody(signRes);
  if (!signRes.ok)
    throw new Error(signed.error || "Upload could not start. Please retry.");
  const { path, token } = signed as { path: string; token: string };

  const { error: uploadError } = await createClient()
    .storage.from(DOCUMENT_BUCKET)
    .uploadToSignedUrl(path, token, file, {
      contentType: file.type || undefined,
    });
  if (uploadError)
    throw new Error(
      "The file could not be uploaded. Check your connection and retry.",
    );

  if (split) {
    const splitRes = await fetch("/api/portal/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "split", path }),
    });
    const result = await readBody(splitRes);
    if (!splitRes.ok)
      throw new Error(
        result.error || "The packet could not be split. Please retry.",
      );
    const created = Array.isArray(result.created)
      ? (result.created as { label: string; pages: number }[])
      : [];
    if (created.length === 0)
      return "Upload complete, but no separate documents were detected.";
    const summary = created
      .map((doc) => `${doc.label} (${doc.pages} pg)`)
      .join(", ");
    return `Split into ${created.length} document${created.length === 1 ? "" : "s"}: ${summary}.`;
  }

  const recordRes = await fetch("/api/portal/documents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "record", kind, path, name: file.name, title }),
  });
  const recorded = await readBody(recordRes);
  if (!recordRes.ok)
    throw new Error(
      recorded.error || "The document could not be saved. Please retry.",
    );
  return "Document uploaded securely.";
}

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
  const inFlight = useRef(false);
  const refresh = useCallback(async () => {
    if (previewData) return;
    const query = desk ? "?desk=1" : initialRole ? `?role=${initialRole}` : "";
    const res = await fetch(`/api/portal/workspace${query}`, {
      cache: "no-store",
    });
    const body = await readBody(res);
    if (!res.ok) {
      if (res.status === 401) window.location.assign("/portal");
      throw new Error(body.error || "Unable to load your portal.");
    }
    setData(body as unknown as Workspace);
  }, [desk, previewData, initialRole]);
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
      if (file) {
        setNotice(await uploadDocument(body));
      } else {
        const res = await fetch("/api/portal/workspace", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const result = await readBody(res);
        if (!res.ok)
          throw new Error(result.error || "Unable to save. Please retry.");
        setNotice("Saved. Any required notifications are queued for delivery.");
      }
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
  const staff = !!data?.staff;
  // Staff-domain users can view either portal (URL-driven) and are treated as
  // approved, so the paperwork gate never pins them to the setup tab.
  const viewRole = staff ? (initialRole ?? p?.role) : p?.role;
  const approved = staff || p?.status === "approved";
  const tabs = desk
    ? [
        "Setup reviews",
        "Bids & bookings",
        "Customer requests",
        "Documents & email",
      ]
    : viewRole === "carrier"
      ? ["Load board", "Setup & profile"]
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
            ) : viewRole === "carrier" ? (
              <CarrierBoard data={data} act={send} busy={busy} />
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
                  <DocumentList docs={data.documents} />
                </div>
              </Panel>
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
