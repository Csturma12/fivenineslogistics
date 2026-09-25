import { test } from "node:test";
import assert from "node:assert/strict";
import type { User } from "@supabase/supabase-js";
import { isAgentDeskEmail, verifiedPortalIdentity } from "../lib/portal-access-policy";
import { PortalProblem } from "../lib/portal-contract";

function confirmedUser(overrides: Partial<User> = {}): User {
  return {
    id: "fictional-portal-user",
    aud: "authenticated",
    created_at: "2026-01-01T00:00:00Z",
    email: "chris@shipfivenines.com",
    email_confirmed_at: "2026-01-01T00:00:00Z",
    app_metadata: {},
    user_metadata: {},
    ...overrides,
  };
}

test("agent desk permits the exact company domain, including mixed case and aliases", () => {
  for (const email of ["chris@shipfivenines.com", "Chris@ShipFiveNines.COM", "dispatch+desk@shipfivenines.com"])
    assert.equal(isAgentDeskEmail(email), true, email);
});

test("agent desk rejects other domains, lookalikes, subdomains, malformed emails, and whitespace", () => {
  for (const email of [
    undefined, "", "@shipfivenines.com", "chris", "chris@primarycompanies.com",
    "sturma@blbxcritical.com", "chris@sub.shipfivenines.com", "chris@shipfivenines.com.evil.test",
    "chris@evilshipfivenines.com", "chris@shipfiveninesXcom", "chris@shipfivenines.co",
    "chris@@shipfivenines.com", "chris@evil.test@shipfivenines.com",
    " chris@shipfivenines.com", "chris@shipfivenines.com ", "ch ris@shipfivenines.com",
    "chris\t@shipfivenines.com", "chris@shipfivenines.com\n", "chris@shipfivenines.com\r\n",
  ])
    assert.equal(isAgentDeskEmail(email), false, String(email));
});

test("confirmed company users are staff and other confirmed users retain ordinary portal access", () => {
  const staff = confirmedUser();
  assert.deepEqual(verifiedPortalIdentity(staff), { user: staff, staff: true });
  const carrier = confirmedUser({ email: "carrier@example.test" });
  assert.deepEqual(verifiedPortalIdentity(carrier), { user: carrier, staff: false });
});

test("missing, unconfirmed, failed-auth, and anonymous identities are rejected with 401", () => {
  const attempts: [User | null, unknown][] = [
    [null, null],
    [confirmedUser({ email: undefined }), null],
    [confirmedUser({ email: "" }), null],
    [confirmedUser({ email_confirmed_at: undefined }), null],
    [confirmedUser({ email_confirmed_at: "" }), null],
    [confirmedUser(), new Error("Token not valid")],
    [confirmedUser({ is_anonymous: true }), null],
  ];
  for (const [user, error] of attempts)
    assert.throws(() => verifiedPortalIdentity(user, error), (problem: unknown) =>
      problem instanceof PortalProblem && problem.status === 401);
});

test("user and app metadata cannot turn an external user into staff or verify their email", () => {
  const impostor = confirmedUser({
    email: "outsider@example.test",
    user_metadata: { email: "chris@shipfivenines.com", email_verified: true, staff: true, role: "staff" },
    app_metadata: { email: "chris@shipfivenines.com", email_verified: true, staff: true, role: "staff" },
  });
  assert.equal(verifiedPortalIdentity(impostor).staff, false);
  assert.throws(() => verifiedPortalIdentity({ ...impostor, email_confirmed_at: undefined }),
    (problem: unknown) => problem instanceof PortalProblem && problem.status === 401);
});
