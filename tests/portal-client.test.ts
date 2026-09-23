import { test } from "node:test";
import assert from "node:assert/strict";
import type { Workspace } from "../lib/portal-contract";
import {
  MAX_UPLOAD_BYTES,
  PortalResponseError,
  readWorkspaceResponse,
  sendPortalChange,
} from "../lib/portal-client";
import { previewWorkspace } from "./portal-fixtures";

function workspace(): Workspace {
  return {
    email: "carrier@example.test",
    staff: false,
    profile: null,
    hint: "carrier",
    company: "Fictional carrier",
    highwayUrl: null,
    documents: [],
    companyDocuments: [],
    loads: [],
    bids: [],
    requests: [],
    bookings: [],
  };
}

function transport(reply: () => Response) {
  const calls: { input: Parameters<typeof fetch>[0]; init?: RequestInit }[] = [];
  const fetcher: typeof fetch = async (input, init) => {
    calls.push({ input, init });
    return reply();
  };
  return { fetcher, calls };
}

function upload(size: number): FormData {
  const body = new FormData();
  body.set("kind", "packet");
  body.set("file", new File([new Uint8Array(size)], "sample.pdf", {
    type: "application/pdf",
  }));
  return body;
}

for (const [label, raw] of [
  ["plain text", "Request Entity Too Large"],
  ["HTML", "<html><body>Upload rejected</body></html>"],
  ["empty", ""],
] as const) {
  test(`${label} 413 responses explain the 3 MB limit in both request paths`, async () => {
    const response = () => new Response(raw, { status: 413 });
    const { fetcher } = transport(response);
    const isSizeError = (error: unknown) => {
      assert.ok(error instanceof PortalResponseError);
      assert.equal(error.status, 413);
      assert.match(error.message, /3\s*MB/i);
      assert.doesNotMatch(error.message, /Unexpected token|<html>/i);
      return true;
    };
    await assert.rejects(() => readWorkspaceResponse(response()), isSizeError);
    await assert.rejects(
      () => sendPortalChange({ action: "save_profile" }, fetcher),
      isSizeError,
    );
  });
}

test("JSON API errors preserve their message and HTTP status", async () => {
  const message = "Your profile changed. Refresh before reviewing.";
  const response = () => Response.json({ error: message }, { status: 409 });
  const { fetcher } = transport(response);
  const isApiError = (error: unknown) => {
    assert.ok(error instanceof PortalResponseError);
    assert.equal(error.status, 409);
    assert.equal(error.message, message);
    return true;
  };
  await assert.rejects(() => readWorkspaceResponse(response()), isApiError);
  await assert.rejects(
    () => sendPortalChange({ action: "save_profile" }, fetcher),
    isApiError,
  );
});

test("401 status is retained so the caller can return to sign-in", async () => {
  const response = () => Response.json({ error: "Sign in to continue." }, { status: 401 });
  const { fetcher } = transport(response);
  const isUnauthorized = (error: unknown) => {
    assert.ok(error instanceof PortalResponseError);
    assert.equal(error.status, 401);
    return true;
  };
  await assert.rejects(() => readWorkspaceResponse(response()), isUnauthorized);
  await assert.rejects(
    () => sendPortalChange({ action: "save_profile" }, fetcher),
    isUnauthorized,
  );
});

const malformedSuccesses: [string, () => Response][] = [
  ["HTML 200", () => new Response("<html>Sign in</html>", { status: 200 })],
  ["plain text 200", () => new Response("OK", { status: 200 })],
  ["empty 200", () => new Response("", { status: 200 })],
  ["empty 204", () => new Response(null, { status: 204 })],
  ["JSON null", () => Response.json(null)],
  ["JSON array", () => Response.json([])],
  ["JSON string", () => Response.json("success")],
  ["JSON boolean", () => Response.json(true)],
  ["JSON number", () => Response.json(1)],
  ["error object", () => Response.json({ error: "Not saved" })],
  ["empty object", () => Response.json({})],
];
for (const [label, response] of malformedSuccesses) {
  test(`${label} cannot be treated as a successful save or workspace`, async () => {
    const { fetcher } = transport(response);
    await assert.rejects(() => readWorkspaceResponse(response()));
    await assert.rejects(() => sendPortalChange({ action: "save_profile" }, fetcher));
  });
}

test("only an explicit ok:true mutation response confirms a save", async () => {
  const valid = transport(() => Response.json({ ok: true }));
  await assert.doesNotReject(() => sendPortalChange({ action: "save_profile" }, valid.fetcher));
  for (const body of [{ ok: false }, { ok: "true" }, { ok: 1 }]) {
    const invalid = transport(() => Response.json(body));
    await assert.rejects(() => sendPortalChange({ action: "save_profile" }, invalid.fetcher));
  }
});

test("valid workspace envelopes accept nullable profiles and optional record collections", async () => {
  const fresh = workspace();
  assert.deepEqual(await readWorkspaceResponse(Response.json(fresh)), fresh);
  const approved = previewWorkspace("carrier");
  approved.historyLoads = [...approved.loads];
  assert.deepEqual(await readWorkspaceResponse(Response.json(approved)), approved);
});

test("workspace response requires correctly typed envelope metadata", async () => {
  for (const patch of [
    { email: undefined }, { email: 123 }, { staff: undefined }, { staff: "false" },
    { profile: undefined }, { hint: null }, { company: null },
    { highwayUrl: undefined }, { highwayUrl: 123 },
  ]) {
    await assert.rejects(() => readWorkspaceResponse(Response.json({ ...workspace(), ...patch })));
  }
});

test("workspace collections must be arrays of records", async () => {
  for (const field of ["documents", "companyDocuments", "loads", "bids", "requests", "bookings"]) {
    for (const value of [undefined, null, {}, "not an array", [null], ["row"], [[]]]) {
      await assert.rejects(
        () => readWorkspaceResponse(Response.json({ ...workspace(), [field]: value })),
        `${field} must reject ${JSON.stringify(value)}`,
      );
    }
  }
  for (const field of ["profiles", "notifications", "historyLoads"]) {
    for (const value of [null, {}, "not an array", [null], [1], [[]]]) {
      await assert.rejects(
        () => readWorkspaceResponse(Response.json({ ...workspace(), [field]: value })),
        `${field} must reject ${JSON.stringify(value)}`,
      );
    }
  }
});

test("a non-null workspace profile must satisfy the profile contract", async () => {
  const valid = previewWorkspace("carrier");
  for (const profile of [[], {}, "carrier", true, 1]) {
    await assert.rejects(() => readWorkspaceResponse(Response.json({ ...valid, profile })));
  }
  for (const patch of [
    { role: "staff" }, { details: null }, { details: [] }, { details: "invalid" },
    { details: { contact: 123 } },
    { user_id: undefined }, { email: null }, { company: false }, { status: null },
    { highway_status: null }, { review_note: null }, { version: "1" },
    { customer_account_id: undefined }, { customer_account_id: 1 },
  ]) {
    await assert.rejects(() => readWorkspaceResponse(Response.json({
      ...valid, profile: { ...valid.profile, ...patch },
    })));
  }
});

test("file size boundaries match the server and oversized files never reach fetch", async () => {
  assert.equal(MAX_UPLOAD_BYTES, 3_145_728);
  for (const size of [MAX_UPLOAD_BYTES - 1, MAX_UPLOAD_BYTES]) {
    const { fetcher, calls } = transport(() => Response.json({ ok: true }));
    await assert.doesNotReject(() => sendPortalChange(upload(size), fetcher));
    assert.equal(calls.length, 1);
  }
  const { fetcher, calls } = transport(() => Response.json({ ok: true }));
  await assert.rejects(() => sendPortalChange(upload(MAX_UPLOAD_BYTES + 1), fetcher), /3\s*MB/i);
  assert.equal(calls.length, 0);
});

test("missing, empty and non-file form values never start an upload", async () => {
  const missing = new FormData();
  missing.set("kind", "packet");
  const notFile = new FormData();
  notFile.set("file", "sample.pdf");
  for (const body of [missing, notFile, upload(0)]) {
    const { fetcher, calls } = transport(() => Response.json({ ok: true }));
    await assert.rejects(() => sendPortalChange(body, fetcher), /choose.*upload/i);
    assert.equal(calls.length, 0);
  }
});

test("multipart upload preserves the browser-generated boundary and document route", async () => {
  const body = upload(10);
  const { fetcher, calls } = transport(() => Response.json({ ok: true }));
  await sendPortalChange(body, fetcher);
  assert.equal(calls.length, 1);
  assert.equal(String(calls[0].input), "/api/portal/documents");
  assert.equal(calls[0].init?.method, "POST");
  assert.equal(calls[0].init?.body, body);
  assert.equal(new Headers(calls[0].init?.headers).get("Content-Type"), null);
});

test("JSON mutations retain their workspace route, content type and body", async () => {
  const body = { action: "save_profile", company: "Fictional carrier" };
  const { fetcher, calls } = transport(() => Response.json({ ok: true }));
  await sendPortalChange(body, fetcher);
  assert.equal(calls.length, 1);
  assert.equal(String(calls[0].input), "/api/portal/workspace");
  assert.equal(calls[0].init?.method, "POST");
  assert.equal(new Headers(calls[0].init?.headers).get("Content-Type"), "application/json");
  assert.deepEqual(JSON.parse(String(calls[0].init?.body)), body);
});

test("an ambiguous network failure rejects without retrying a mutation", async () => {
  let calls = 0;
  const fetcher: typeof fetch = async () => {
    calls += 1;
    throw new TypeError("Synthetic network interruption");
  };
  await assert.rejects(() => sendPortalChange({ action: "save_profile" }, fetcher));
  assert.equal(calls, 1);
});
