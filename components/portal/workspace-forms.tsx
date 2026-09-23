"use client";
import { useState } from "react";
import type { Profile, Workspace } from "@/lib/portal-contract";
import { centralToday, setupMissing } from "@/lib/portal-contract";
import { carrierSetupMailto } from "@/lib/portal-setup-email";
import { site } from "@/lib/site";
import {
  Panel,
  Field,
  DocumentList,
  button,
  secondary,
  input,
  Badge,
  type Act,
  type Upload,
} from "./workspace-ui";

export function ProfileForm({
  profile,
  documents,
  highwayUrl,
  act,
  upload,
  busy,
}: {
  profile: Profile;
  documents: Workspace["documents"];
  highwayUrl: string | null;
  act: Act;
  upload: Upload;
  busy: boolean;
}) {
  const carrier = profile.role === "carrier";
  const d = profile.details;
  const missing = setupMissing(profile, documents, centralToday());
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
      <Panel
        eyebrow="Your account"
        title={carrier ? "Carrier setup & profile" : "Company profile"}
      >
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Badge value={profile.status} />
          <p className="text-sm text-slate-500">
            Changes require a new review.
          </p>
        </div>
        {profile.review_note ? (
          <p className="mb-5 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
            Dispatch note: {profile.review_note}
          </p>
        ) : null}
        <form
          key={profile.version}
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const details = Object.fromEntries(form.entries());
            const submit =
              (e.nativeEvent as SubmitEvent).submitter?.getAttribute(
                "value",
              ) === "submit";
            await act({
              action: "save_profile",
              company: form.get("company"),
              details,
              submit,
            });
          }}
        >
          <fieldset disabled={busy} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Company legal name"
                name="company"
                value={profile.company}
                required
                maxLength={200}
              />
              <Field
                label="Contact name"
                name="contact"
                value={d.contact}
                required
              />
              <Field
                label="Phone"
                name="phone"
                value={d.phone}
                required
                type="tel"
              />
              <Field
                label="Business address"
                name="address"
                value={d.address}
              />
            </div>
            {carrier ? (
              <>
                <h3 className="border-t pt-5 font-semibold">
                  Authority & operations
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="DOT number" name="dot" value={d.dot} required />
                  <Field
                    label="MC number, if applicable"
                    name="mc"
                    value={d.mc}
                  />
                  <Field
                    label="Equipment types"
                    name="equipment"
                    value={d.equipment}
                    required
                  />
                  <Field
                    label="Fleet size"
                    name="fleet_size"
                    value={d.fleet_size}
                  />
                  <Field
                    label="Preferred lanes / service area"
                    name="lanes"
                    value={d.lanes}
                    required
                  />
                  <Field
                    label="Certifications"
                    name="certifications"
                    value={d.certifications}
                  />
                </div>
                <h3 className="border-t pt-5 font-semibold">
                  Insurance & payment contact
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Insurance company"
                    name="insurance_company"
                    value={d.insurance_company}
                  />
                  <Field
                    label="Insurance expires"
                    name="insurance_expiry"
                    value={d.insurance_expiry}
                    type="date"
                    required
                  />
                  <label className="text-sm font-medium">
                    Do you use factoring?
                    <select
                      className={input}
                      name="factoring"
                      defaultValue={d.factoring || ""}
                      required
                    >
                      <option value="">Choose one</option>
                      <option value="no">No</option>
                      <option value="yes">Yes — NOA required</option>
                    </select>
                  </label>
                  <Field
                    label="Factoring company, if applicable"
                    name="factor_name"
                    value={d.factor_name}
                  />
                  <Field
                    label="Payment contact email"
                    name="payment_contact"
                    value={d.payment_contact}
                    type="email"
                  />
                </div>
                <p className="text-xs leading-5 text-slate-500">
                  Do not enter bank account, routing or tax identification
                  numbers here. Payment verification and contracts are handled
                  through the approved setup process.
                </p>
                <Field
                  label="Operating notes / questionnaire"
                  name="questionnaire"
                  value={d.questionnaire}
                />
                <Field
                  label="Tracking / integration capabilities"
                  name="integrations"
                  value={d.integrations}
                />
                <label className="flex gap-3 text-sm leading-6">
                  <input
                    className="mt-1 size-4"
                    type="checkbox"
                    name="contract_ack"
                    value="yes"
                    defaultChecked={d.contract_ack === "yes"}
                    required
                  />
                  I confirm these details are accurate. This does not replace
                  Highway verification or a signed carrier agreement.
                </label>
              </>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <button
                className={secondary}
                type="submit"
                value="draft"
                formNoValidate
              >
                Save draft
              </button>
              <button className={button} type="submit" value="submit">
                Submit for review
              </button>
            </div>
          </fieldset>
        </form>
      </Panel>
      <div className="space-y-6">
        {carrier ? (
          <>
            <Panel eyebrow="Setup checklist" title="Your next steps">
              <ol className="space-y-4 text-sm leading-6 text-slate-600">
                <li>1. Save your business and operating details.</li>
                <li>2. Upload the packet, COI, W9 and NOA if you factor.</li>
                <li>3. Complete Highway setup and submit for review.</li>
                <li>
                  4. Dispatch verifies your setup and opens load-board access.
                </li>
              </ol>
              {missing.length ? (
                <p className="mt-5 rounded-lg bg-blue-50 p-4 text-sm leading-6 text-blue-900">
                  Still needed: {missing.join(", ")}.
                </p>
              ) : (
                <p className="mt-5 text-sm text-emerald-700">
                  Required information is saved. Submit when ready for dispatch
                  review.
                </p>
              )}
            </Panel>
            <Panel title="Highway verification">
              <Badge value={profile.highway_status} />
              <p className="my-4 text-sm leading-6 text-slate-600">
                Your profile information is stored here for our team. Highway is
                a separate secure verification process.
              </p>
              {highwayUrl ? (
                <a
                  className={button}
                  href={highwayUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Complete Highway setup ↗
                </a>
              ) : (
                <p className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  Dispatch will send your secure Highway invitation separately.
                  Need an invitation?{" "}
                  <a
                    className="underline"
                    href="mailto:chris@shipfivenines.com?subject=Highway%20setup%20invitation"
                  >
                    Contact carrier setup
                  </a>
                  .
                </p>
              )}
            </Panel>
            <Panel title="Carrier documents">
              <p className="mb-4 text-sm text-slate-600">
                Private files · PDF, JPG or PNG · up to 3 MB each. Save your
                draft before uploading.
              </p>
              <UploadForm upload={upload} busy={busy} />
              <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                <p className="font-medium text-[#14365b]">File too large or having trouble?</p>
                <p className="mt-2">
                  Email your setup documents to our carrier team. We’ll help you
                  complete the remaining portal steps.
                </p>
                <a className="mt-3 inline-block font-medium text-blue-700 underline" href={carrierSetupMailto(site.carriersEmail)}>
                  Email setup documents →
                </a>
                <p className="mt-2 text-xs">
                  Opens your email app with a checklist. Attach your packet, COI,
                  W-9 and NOA (if applicable) yourself. Emailing does not automatically
                  complete portal setup or Highway approval.
                </p>
                <p className="mt-2 text-xs">No email app? Send the same documents to {site.carriersEmail}.</p>
              </div>
              <DocumentList docs={documents} />
            </Panel>
          </>
        ) : (
          <Panel title="What happens next?">
            <p className="text-sm leading-7 text-slate-600">
              You can access company documents and submit a project request now.
              Dispatch verifies your company and links your account to the
              correct TAI customer record before showing shipments or tracking.
            </p>
          </Panel>
        )}
      </div>
    </div>
  );
}
export function UploadForm({
  upload,
  busy,
  company = false,
}: {
  upload: Upload;
  busy: boolean;
  company?: boolean;
}) {
  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (await upload(new FormData(form))) form.reset();
      }}
    >
      <fieldset disabled={busy} className="space-y-3">
        {company ? (
          <>
            <input type="hidden" name="kind" value="company" />
            <Field
              label="Document title"
              name="title"
              required
              maxLength={150}
            />
          </>
        ) : (
          <label className="block text-sm">
            Document type
            <select name="kind" className={input}>
              <option value="packet">Carrier packet</option>
              <option value="coi">Certificate of insurance (COI)</option>
              <option value="w9">W9</option>
              <option value="noa">Notice of assignment (NOA)</option>
            </select>
          </label>
        )}
        <label className="block text-sm">
          Choose file
          <input
            className="mt-2 block w-full text-sm file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:p-2 file:text-blue-800"
            type="file"
            name="file"
            accept="application/pdf,image/jpeg,image/png"
            required
          />
        </label>
        <button className={secondary}>Upload securely</button>
      </fieldset>
    </form>
  );
}
export function LoadRequestForm({ act, busy }: { act: Act; busy: boolean }) {
  const [sent, setSent] = useState(false);
  return (
    <Panel eyebrow="Start a project" title="Enter a load in our system">
      <p className="mb-6 text-sm leading-6 text-slate-600">
        Tell us what needs to move. Your request goes to our team to review
        capacity, pricing and scheduling — it is not a confirmed booking yet.
      </p>
      {sent ? (
        <p
          role="status"
          className="mb-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          Your load request is saved. A dispatch notification is queued for
          delivery.
        </p>
      ) : null}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          if (
            await act({
              action: "customer_request",
              kind: "load",
              details: Object.fromEntries(new FormData(form).entries()),
            })
          ) {
            form.reset();
            setSent(true);
          }
        }}
      >
        <fieldset disabled={busy} className="grid gap-4 sm:grid-cols-2">
          <Field label="Origin city, state" name="origin" required />
          <Field label="Destination city, state" name="destination" required />
          <Field label="Pickup date" name="pickup_date" type="date" required />
          <Field
            label="Delivery date, if known"
            name="delivery_date"
            type="date"
          />
          <Field label="Equipment / freight mode" name="equipment" required />
          <Field label="Weight (lb)" name="weight" />
          <Field label="Dimensions, if known" name="dimensions" />
          <Field label="Instructions / project details" name="notes" />
          <div className="sm:col-span-2">
            <button className={button}>Send load request</button>
          </div>
        </fieldset>
      </form>
    </Panel>
  );
}
