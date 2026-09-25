import { test } from "node:test";
import assert from "node:assert/strict";
import type { User } from "@supabase/supabase-js";
import { verifiedPortalIdentity } from "../lib/portal-access-policy";
import { authRedirectPath, portalHomeDestination } from "../lib/portal-auth-routing";

function user(overrides: Partial<User> = {}): User {
  return {
    id: "fictional-auth-routing-user",
    aud: "authenticated",
    created_at: "2026-01-01T00:00:00Z",
    email: "chris@shipfivenines.com",
    email_confirmed_at: "2026-01-01T00:00:00Z",
    app_metadata: {},
    user_metadata: {},
    ...overrides,
  };
}

test("auth confirmation preserves the signup, recovery, and existing portal destinations", () => {
  for (const path of ["/agent-desk", "/portal/reset-password", "/portal/home", "/portal", "/portal/customer", "/portal/carrier"])
    assert.equal(authRedirectPath(path), path);
});

test("auth redirects reject external URL tricks and unrecognized paths", () => {
  for (const path of [
    undefined, null, "", "@outside.example", "https://outside.example/agent-desk",
    "//outside.example", "/\\outside.example", "\\\\outside.example",
    "javascript:alert(1)", " /agent-desk", "/agent-desk\n", "/agent-desk\r\nLocation: https://outside.example",
    "%2f%2foutside.example", "/%2foutside.example", "/portal/../agent-desk",
    "/agent-desk?next=https://outside.example", "/auth/confirm", "/unknown",
  ]) {
    const result = authRedirectPath(path);
    assert.equal(result, "/portal/home", String(path));
    assert.equal(new URL(result, "https://fivenineslogistics.com").origin, "https://fivenineslogistics.com");
  }
});

test("verified company accounts return to the desk after recovery without requiring a portal profile", () => {
  const identity = verifiedPortalIdentity(user());
  for (const profileRole of [undefined, null, "customer", "carrier"])
    assert.equal(portalHomeDestination(identity, profileRole), "/agent-desk");
});

test("other verified users keep persisted customer/carrier routing ahead of metadata hints", () => {
  const carrier = verifiedPortalIdentity(user({
    email: "carrier@example.test", app_metadata: { role: "customer" },
  }));
  assert.equal(portalHomeDestination(carrier, "carrier"), "/portal");
  assert.equal(portalHomeDestination(carrier), "/portal/customer");
  const customer = verifiedPortalIdentity(user({
    email: "customer@example.test", app_metadata: { role: "carrier" },
  }));
  assert.equal(portalHomeDestination(customer, "customer"), "/portal/customer");
  assert.equal(portalHomeDestination(customer), "/portal");
});

test("staff metadata cannot route another domain to the desk and unverified staff cannot route as authenticated", () => {
  const external = verifiedPortalIdentity(user({
    email: "outsider@example.test",
    app_metadata: { role: "staff", staff: true },
    user_metadata: { email: "chris@shipfivenines.com", email_verified: true },
  }));
  assert.equal(portalHomeDestination(external), "/portal");
  for (const identity of [user({ email_confirmed_at: undefined }), user({ is_anonymous: true })])
    assert.throws(() => portalHomeDestination(verifiedPortalIdentity(identity)), /Sign in to continue/);
});
