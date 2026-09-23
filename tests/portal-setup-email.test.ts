import { test } from "node:test";
import assert from "node:assert/strict";
import { carrierSetupMailto } from "../lib/portal-setup-email";

test("carrier setup email is a draft with the recipient, subject and document checklist", () => {
  const link = new URL(carrierSetupMailto("setup@example.test"));
  assert.equal(link.protocol, "mailto:");
  assert.equal(link.pathname, "setup@example.test");
  assert.equal(link.searchParams.get("subject"), "Five Nines carrier setup documents");
  const body = link.searchParams.get("body")!;
  for (const field of ["carrier packet", "COI", "W-9", "NOA", "if factoring applies", "Portal account email:", "Highway"])
    assert.ok(body.includes(field), `missing ${field}`);
  assert.match(body, /attach these documents before sending/);
  assert.equal(link.searchParams.has("attachment"), false);
});
