import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { User } from "@supabase/supabase-js";
import { verifiedPortalIdentity } from "../lib/portal-access-policy";
import { canUsePortalSamples, portalSampleView } from "../lib/portal-sample-access";
import { samplePortalWorkspace } from "../lib/portal-sample-data";
import { DocumentList } from "../components/portal/workspace-ui";
import { PortalWorkspace } from "../components/portal/workspace";

function user(email: string, changes: Partial<User> = {}): User {
  return { id: "sample-auth-user", aud: "authenticated", email,
    created_at: "2026-01-01T00:00:00Z", email_confirmed_at: "2026-01-01T00:00:00Z",
    app_metadata: {}, user_metadata: {}, ...changes };
}

test("only the exact verified owner can use sample portals, not other staff or metadata", () => {
  assert.equal(canUsePortalSamples(verifiedPortalIdentity(user("Chris@ShipFiveNines.COM"))), true);
  for (const email of ["dispatch@shipfivenines.com", "chris+test@shipfivenines.com", "chris@shipfivenines.com.evil.test", "outsider@example.test"]) {
    const identity = verifiedPortalIdentity(user(email, {
      app_metadata: { email: "chris@shipfivenines.com", owner: true },
      user_metadata: { email: "chris@shipfivenines.com", owner: true },
    }));
    assert.equal(canUsePortalSamples(identity), false, email);
  }
  assert.equal(canUsePortalSamples(null), false);
  assert.throws(() => canUsePortalSamples(verifiedPortalIdentity(user("chris@shipfivenines.com", { email_confirmed_at: undefined }))));
  assert.throws(() => canUsePortalSamples(verifiedPortalIdentity(user("chris@shipfivenines.com", { is_anonymous: true }))));
});

test("sample selector exposes only carrier setup, carrier board, and customer views", () => {
  assert.equal(portalSampleView("carrier"), "carrier");
  assert.equal(portalSampleView("customer"), "customer");
  for (const invalid of [undefined, "setup", "desk", "../../agent-desk", "external"])
    assert.equal(portalSampleView(invalid), "setup");
});

test("sample profiles are isolated and setup demonstrates pending Highway verification", () => {
  const setup = samplePortalWorkspace("setup");
  assert.equal(setup.profile?.role, "carrier");
  assert.equal(setup.profile?.highway_status, "awaiting_invitation");
  assert.equal(setup.profile?.status, "draft");
  assert.equal(samplePortalWorkspace("carrier").profile?.status, "approved");
  assert.equal(samplePortalWorkspace("customer").profile?.role, "customer");
  assert.equal(samplePortalWorkspace("customer").staff, false);
  setup.profile!.company = "Locally edited sample";
  assert.equal(samplePortalWorkspace("setup").profile?.company, "Sample Carrier");
  assert.ok(setup.loads.every(load => load.external_id?.startsWith("SAMPLE-")));
});

test("sample document labels never link to the live document API", () => {
  const docs = samplePortalWorkspace("carrier").documents;
  const sample = renderToStaticMarkup(createElement(DocumentList, { docs, readOnlySamples: true }));
  assert.match(sample, /sample-packet\.pdf/);
  assert.match(sample, /Sample only/);
  assert.doesNotMatch(sample, /href=|\/api\/portal\/documents/);
  const ordinary = renderToStaticMarkup(createElement(DocumentList, { docs }));
  assert.match(ordinary, /\/api\/portal\/documents\?id=/);
});

test("customer samples render the same tracking text across server and browser timezones", () => {
  const originalTimezone = process.env.TZ;
  try {
    process.env.TZ = "UTC";
    const serverMarkup = renderToStaticMarkup(createElement(PortalWorkspace, {
      previewData: samplePortalWorkspace("customer"),
    }));
    process.env.TZ = "America/Los_Angeles";
    const browserMarkup = renderToStaticMarkup(createElement(PortalWorkspace, {
      previewData: samplePortalWorkspace("customer"),
    }));
    assert.match(serverMarkup, /Last reported: Huntsville, TX/);
    assert.equal(serverMarkup, browserMarkup);
  } finally {
    if (originalTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimezone;
  }
});
