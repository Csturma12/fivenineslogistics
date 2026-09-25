import { test } from "node:test";
import assert from "node:assert/strict";
import { MAX_UPLOAD_BYTES, readPortalBody, uploadDocument } from "../lib/portal-upload-client";

function uploadForm(file: File, kind = "combined", split = false) {
  const form = new FormData();
  form.set("file", file);
  form.set("kind", kind);
  if (split) form.set("split", "yes");
  return form;
}

test("a 4 MB packet uses sign, direct Storage upload, then record without sending bytes to the API", async () => {
  const file = new File([new Uint8Array(4 * 1024 * 1024)], "master.pdf", { type: "application/pdf" });
  const calls: Record<string, unknown>[] = [];
  const message = await uploadDocument(uploadForm(file), {
    fetcher: (async (_url, init) => {
      assert.equal(init?.headers && (init.headers as Record<string, string>)["Content-Type"], "application/json");
      const payload = init?.body;
      assert.equal(typeof payload, "string");
      assert.ok(String(payload).length < 1000);
      const body = JSON.parse(String(payload)) as Record<string, unknown>;
      calls.push(body);
      return Response.json(body.action === "sign"
        ? { path: "owner/id/master.pdf", token: "one-time-token" }
        : { ok: true });
    }) as typeof fetch,
    uploadBytes: async (path, token, uploaded, contentType) => {
      assert.equal(path, "owner/id/master.pdf");
      assert.equal(token, "one-time-token");
      assert.equal(uploaded, file);
      assert.equal(uploaded.size, 4 * 1024 * 1024);
      assert.equal(contentType, "application/pdf");
      return { error: null };
    },
  });
  assert.deepEqual(calls.map((call) => call.action), ["sign", "record"]);
  assert.deepEqual(calls.map((call) => call.kind), ["combined", "combined"]);
  assert.match(message, /Add another file/);
});

test("optional packet splitting stays a sign, Storage, split flow", async () => {
  const calls: string[] = [];
  const result = await uploadDocument(
    uploadForm(new File(["%PDF-1.7"], "packet.pdf", { type: "application/pdf" }), "packet", true),
    {
      fetcher: (async (_url, init) => {
        const body = JSON.parse(init?.body as string) as { action: string };
        calls.push(body.action);
        return Response.json(body.action === "sign"
          ? { path: "owner/id/packet.pdf", token: "token" }
          : { ok: true, created: [{ label: "COI", pages: 2 }] });
      }) as typeof fetch,
      uploadBytes: async () => { calls.push("storage"); return { error: null }; },
    },
  );
  assert.deepEqual(calls, ["sign", "storage", "split"]);
  assert.match(result, /COI \(2 pg\)/);
});

test("oversized files and non-PDF combined packets fail before any network call", async () => {
  const noNetwork = () => { throw new Error("Network must not run"); };
  await assert.rejects(
    uploadDocument(uploadForm(new File([new Uint8Array(MAX_UPLOAD_BYTES + 1)], "too-big.pdf", { type: "application/pdf" })), { fetcher: noNetwork }),
    /15 MB/,
  );
  await assert.rejects(
    uploadDocument(uploadForm(new File(["jpeg"], "packet.jpg", { type: "image/jpeg" })), { fetcher: noNetwork }),
    /must be a PDF/,
  );
  await assert.rejects(
    uploadDocument(uploadForm(new File(["pdf"], "packet.pdf", { type: "text/plain" })), { fetcher: noNetwork }),
    /valid PDF, JPG or PNG/,
  );
  await assert.rejects(
    uploadDocument(uploadForm(new File(["pdf"], "packet.exe", { type: "application/pdf" })), { fetcher: noNetwork }),
    /valid PDF, JPG or PNG/,
  );
});

test("an upload with an unknown browser MIME uses its validated file extension", async () => {
  const file = new File(["%PDF-1.7"], "carrier.PDF");
  let contentType = "";
  await uploadDocument(uploadForm(file), {
    fetcher: (async (_url, init) => Response.json(
      JSON.parse(init?.body as string).action === "sign"
        ? { path: "owner/id/carrier.PDF", token: "token" }
        : { ok: true },
    )) as typeof fetch,
    uploadBytes: async (_path, _token, _file, mime) => {
      contentType = mime;
      return { error: null };
    },
  });
  assert.equal(contentType, "application/pdf");
});

test("a failed Storage transfer never records a document", async () => {
  const actions: string[] = [];
  await assert.rejects(uploadDocument(
    uploadForm(new File(["%PDF-1.7"], "carrier.pdf", { type: "application/pdf" })),
    {
      fetcher: (async (_url, init) => {
        const action = JSON.parse(init?.body as string).action as string;
        actions.push(action);
        return Response.json({ path: "owner/id/carrier.pdf", token: "token" });
      }) as typeof fetch,
      uploadBytes: async () => ({ error: new Error("Storage unavailable") }),
    },
  ), /could not be uploaded/);
  assert.deepEqual(actions, ["sign"]);
});

test("a lost record response retries the same path once and accepts an already-recorded reply", async () => {
  const calls: Record<string, unknown>[] = [];
  let recordAttempts = 0;
  const message = await uploadDocument(
    uploadForm(new File(["%PDF-1.7"], "carrier.pdf", { type: "application/pdf" })),
    {
      fetcher: (async (_url, init) => {
        const body = JSON.parse(init?.body as string) as Record<string, unknown>;
        calls.push(body);
        if (body.action === "sign")
          return Response.json({ path: "owner/id/carrier.pdf", token: "token" });
        recordAttempts += 1;
        if (recordAttempts === 1) throw new TypeError("Reply lost");
        return Response.json({ ok: true, alreadyRecorded: true });
      }) as typeof fetch,
      uploadBytes: async () => ({ error: null }),
    },
  );
  assert.deepEqual(calls.map((call) => call.action), ["sign", "record", "record"]);
  assert.deepEqual(calls[1], calls[2]);
  assert.match(message, /Add another file/);
});

test("a lost split response is not retried because it may have created documents", async () => {
  const calls: string[] = [];
  await assert.rejects(uploadDocument(
    uploadForm(new File(["%PDF-1.7"], "packet.pdf", { type: "application/pdf" }), "packet", true),
    {
      fetcher: (async (_url, init) => {
        const action = JSON.parse(init?.body as string).action as string;
        calls.push(action);
        if (action === "sign") return Response.json({ path: "owner/id/packet.pdf", token: "token" });
        throw new TypeError("Reply lost");
      }) as typeof fetch,
      uploadBytes: async () => ({ error: null }),
    },
  ), /Refresh your documents before uploading it again/);
  assert.deepEqual(calls, ["sign", "split"]);
});

test("two lost record responses ask for a refresh before another upload", async () => {
  const calls: string[] = [];
  await assert.rejects(uploadDocument(
    uploadForm(new File(["%PDF-1.7"], "carrier.pdf", { type: "application/pdf" })),
    {
      fetcher: (async (_url, init) => {
        const action = JSON.parse(init?.body as string).action as string;
        calls.push(action);
        if (action === "sign") return Response.json({ path: "owner/id/carrier.pdf", token: "token" });
        throw new TypeError("Reply lost");
      }) as typeof fetch,
      uploadBytes: async () => ({ error: null }),
    },
  ), /Refresh your documents before uploading it again/);
  assert.deepEqual(calls, ["sign", "record", "record"]);
});

test("a plain-text 413 and an unconfirmed success never appear as a saved upload", async () => {
  const body = await readPortalBody(new Response("Request Entity Too Large", { status: 413 }));
  assert.match(String(body.error), /15 MB/);
  await assert.rejects(uploadDocument(
    uploadForm(new File(["%PDF-1.7"], "master.pdf", { type: "application/pdf" })),
    {
      fetcher: (async (_url, init) => Response.json(
        JSON.parse(init?.body as string).action === "sign"
          ? { path: "owner/id/master.pdf", token: "token" }
          : {},
      )) as typeof fetch,
      uploadBytes: async () => ({ error: null }),
    },
  ), /Refresh your documents before uploading it again/);
});
