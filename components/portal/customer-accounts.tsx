"use client";
import { useState } from "react";
import type { Workspace } from "@/lib/portal-contract";
import { readPortalBody } from "@/lib/portal-upload-client";
import { customersFromCsv, type CsvResult } from "@/lib/customer-contact-csv";
import { Badge, button, input, Panel, secondary } from "./workspace-ui";

type Contact = { name: string; email: string; phone: string };
type Outcome = { email: string; status: string; invited: boolean; message?: string };

const blank = (): Contact => ({ name: "", email: "", phone: "" });

async function addCustomer(body: { company: string; accountId: string; contacts: Contact[] }) {
  const res = await fetch("/api/portal/workspace", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "add_customer", ...body }),
  });
  const result = (await readPortalBody(res)) as { error?: string; message?: string; contacts?: Outcome[] };
  if (!res.ok) throw new Error(String(result.error || "Could not save. Try again."));
  return { message: String(result.message || "Saved."), contacts: result.contacts || [] };
}

/**
 * Agent desk: add a customer the way TAI does. A customer is its TAI customer ID
 * plus at least one contact, and each contact gets an email login and an invite
 * to choose a password.
 */
export function CustomerAccounts({ data, onSaved }: { data: Workspace; onSaved: () => void }) {
  const [company, setCompany] = useState("");
  const [accountId, setAccountId] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([blank()]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [file, setFile] = useState<CsvResult | null>(null);

  const customers = new Map<string, { company: string; people: NonNullable<Workspace["profiles"]> }>();
  for (const p of data.profiles || []) {
    if (p.role !== "customer" || !p.customer_account_id) continue;
    const key = p.customer_account_id;
    const entry = customers.get(key) || { company: p.company, people: [] };
    entry.people.push(p);
    customers.set(key, entry);
  }

  const setContact = (i: number, patch: Partial<Contact>) =>
    setContacts((rows) => rows.map((row, n) => (n === i ? { ...row, ...patch } : row)));

  async function run(body: { company: string; accountId: string; contacts: Contact[] }, reset: boolean) {
    setBusy(true);
    setError("");
    setNotice("");
    setOutcomes([]);
    try {
      const saved = await addCustomer(body);
      setNotice(saved.message);
      setOutcomes(saved.contacts.filter((c) => c.status === "failed" || !c.invited));
      if (reset && saved.contacts.every((c) => c.status !== "failed")) {
        setCompany("");
        setAccountId("");
        setContacts([blank()]);
      }
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Connection failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function importFile() {
    if (!file?.customers.length) return;
    setBusy(true);
    setError("");
    setNotice("");
    setOutcomes([]);
    const problems: Outcome[] = [];
    let saved = 0;
    for (const customer of file.customers) {
      try {
        const res = await addCustomer(customer);
        for (const c of res.contacts) {
          if (c.status === "failed" || !c.invited) problems.push(c);
          else saved++;
        }
      } catch (e) {
        problems.push({ email: customer.company, status: "failed", invited: false, message: e instanceof Error ? e.message : "failed" });
      }
    }
    setNotice(`Import finished: ${saved} contact${saved === 1 ? "" : "s"} saved and emailed.`);
    setOutcomes(problems);
    setFile(null);
    setBusy(false);
    onSaved();
  }

  return (
    <div className="space-y-6">
      <Panel eyebrow="Customer portal logins" title="Import contacts from a TAI export">
        <p className="mb-4 text-sm text-slate-600">
          Choose a CSV with a company name, TAI customer ID, contact name and email for each contact
          (phone optional). You will see what was found before anything is saved.
        </p>
        <input
          type="file"
          accept=".csv,.txt,text/csv"
          className={input}
          disabled={busy}
          onChange={async (e) => {
            const picked = e.target.files?.[0];
            setFile(picked ? customersFromCsv(await picked.text()) : null);
          }}
        />
        {file ? (
          <div className="mt-4 space-y-2 text-sm">
            {file.missingColumns.length ? (
              <p className="text-red-700">Missing columns: {file.missingColumns.join(", ")}.</p>
            ) : null}
            <p>
              Found {file.customers.length} customer{file.customers.length === 1 ? "" : "s"} with{" "}
              {file.customers.reduce((n, c) => n + c.contacts.length, 0)} contacts.
              {file.skipped.length ? ` ${file.skipped.length} rows will be skipped.` : ""}
            </p>
            {file.skipped.length ? (
              <ul className="max-h-40 overflow-auto text-xs text-slate-600">
                {file.skipped.map((s, i) => (
                  <li key={i}>{s.line ? `Row ${s.line}: ` : ""}{s.reason}</li>
                ))}
              </ul>
            ) : null}
            <button type="button" className={button} disabled={busy || !file.customers.length} onClick={() => void importFile()}>
              {busy ? "Importing…" : "Import and send logins"}
            </button>
          </div>
        ) : null}
      </Panel>
      <Panel eyebrow="Customer portal logins" title="Add a customer">
        <p className="mb-5 text-sm text-slate-600">
          Like TAI: save the customer with its TAI customer ID, then add its contacts. Each contact
          signs in with their own email and gets an email to choose a password. Adding an existing
          contact again re-links them and sends a fresh invite.
        </p>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void run({ company, accountId, contacts }, true);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Company name
              <input className={input} value={company} onChange={(e) => setCompany(e.target.value)} required maxLength={160} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              TAI customer ID
              <input
                className={input}
                value={accountId}
                onChange={(e) => setAccountId(e.target.value.replace(/\D/g, ""))}
                inputMode="numeric"
                required
                maxLength={40}
              />
            </label>
          </div>
          <fieldset className="space-y-3">
            <legend className="mb-2 text-sm font-medium text-slate-700">Contacts (at least one)</legend>
            {contacts.map((c, i) => (
              <div key={i} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_1.3fr_1fr_auto] sm:items-end">
                <label className="block text-xs font-medium text-slate-600">
                  Name
                  <input className={input} value={c.name} onChange={(e) => setContact(i, { name: e.target.value })} required maxLength={120} />
                </label>
                <label className="block text-xs font-medium text-slate-600">
                  Email (their login)
                  <input className={input} type="email" value={c.email} onChange={(e) => setContact(i, { email: e.target.value })} required maxLength={254} />
                </label>
                <label className="block text-xs font-medium text-slate-600">
                  Phone
                  <input className={input} type="tel" value={c.phone} onChange={(e) => setContact(i, { phone: e.target.value })} maxLength={40} />
                </label>
                <button
                  type="button"
                  className={secondary}
                  disabled={contacts.length === 1}
                  onClick={() => setContacts((rows) => rows.filter((_, n) => n !== i))}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className={secondary} onClick={() => setContacts((rows) => [...rows, blank()])}>
              Add another contact
            </button>
          </fieldset>
          <button className={button} disabled={busy}>
            {busy ? "Saving…" : "Save customer and send logins"}
          </button>
        </form>
        {error ? <p className="mt-4 text-sm text-red-700" role="alert">{error}</p> : null}
        {notice ? <p className="mt-4 text-sm text-emerald-800" aria-live="polite">{notice}</p> : null}
        {outcomes.length ? (
          <ul className="mt-3 space-y-1 text-sm text-red-700">
            {outcomes.map((o) => (
              <li key={o.email}>{o.email}: {o.message || "not sent"}</li>
            ))}
          </ul>
        ) : null}
      </Panel>

      <Panel eyebrow="Customer portal logins" title="Customers and contacts">
        {customers.size === 0 ? (
          <p className="text-sm text-slate-600">No customers with portal contacts yet.</p>
        ) : (
          <div className="space-y-3">
            {[...customers.entries()].map(([id, entry]) => (
              <details key={id} className="rounded-lg border p-4">
                <summary className="cursor-pointer font-medium">
                  {entry.company || "Customer"} · TAI {id} · {entry.people.length} contact{entry.people.length === 1 ? "" : "s"}
                </summary>
                <ul className="mt-4 divide-y text-sm">
                  {entry.people.map((p) => (
                    <li key={p.user_id} className="flex flex-wrap items-center justify-between gap-3 py-2">
                      <span>
                        {String(p.details?.contact || "") || p.email} · {p.email} <Badge value={p.status} />
                      </span>
                      <button
                        type="button"
                        className={secondary}
                        disabled={busy}
                        onClick={() =>
                          void run(
                            {
                              company: entry.company,
                              accountId: id,
                              contacts: [{ name: String(p.details?.contact || p.email), email: p.email, phone: String(p.details?.phone || "") }],
                            },
                            false,
                          )
                        }
                      >
                        Resend login email
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
