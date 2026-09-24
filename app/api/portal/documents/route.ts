import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { splitCarrierPacket } from "@/lib/portal-doc-split";
import {
  DOCUMENT_BUCKET,
  PortalProblem,
  text,
  uuid,
} from "@/lib/portal-contract";
import {
  failure,
  portalIdentity,
  requireProfile,
  result,
  sameOrigin,
} from "@/lib/portal-service";

export const dynamic = "force-dynamic";
// unpdf + pdf-lib and the AI classification need the Node.js runtime.
export const runtime = "nodejs";
// Splitting downloads a PDF, runs OCR-free text extraction and an AI call, then
// writes several files, so allow well beyond the default handler budget.
export const maxDuration = 60;

const CARRIER_KINDS = ["packet", "coi", "w9", "noa"];
const CUSTOMER_KINDS = ["bol", "po", "packing_list", "other"];
const MAX_BYTES = 15_728_640; // 15 MB — covers scanned BOLs and phone photos of PODs/COIs.
const MIME_BY_EXT: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};

function extensionOf(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot < 0 ? "" : name.slice(dot + 1).toLowerCase();
}

export async function GET(request: Request) {
  try {
    const { user, staff } = await portalIdentity();
    const query = new URL(request.url).searchParams;
    const company = query.get("company") === "1";
    const db = createAdminClient();
    let lookup = db
      .from(company ? "fn_company_documents" : "fn_documents")
      .select("*")
      .eq("id", uuid(query.get("id")));
    if (!company && !staff) lookup = lookup.eq("user_id", user.id);
    if (!staff) await requireProfile(user.id);
    const doc = result(await lookup.maybeSingle());
    if (!doc) throw new PortalProblem("Document not found.", 404);
    const signed = result(
      await db.storage
        .from(DOCUMENT_BUCKET)
        .createSignedUrl(doc.path, 60, { download: doc.name || doc.title }),
    );
    return new Response(null, {
      status: 303,
      headers: {
        Location: signed!.signedUrl,
        "Cache-Control": "private, no-store",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch (error) {
    return failure(error);
  }
}

// Uploads use a two-phase, direct-to-storage flow so large files never pass
// through this API route (Vercel caps request bodies at ~4.5 MB and the preview
// proxy lower still):
//   1. action "sign"   -> validate, reserve a private path, return a one-time
//                         signed upload URL token. The browser PUTs the bytes
//                         straight to Supabase Storage.
//   2. action "record" -> verify the uploaded object's owner, size and type
//                         from storage metadata, then persist the DB row.
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const { user, staff } = await portalIdentity();
    let payload: Record<string, unknown>;
    try {
      payload = (await request.json()) as Record<string, unknown>;
    } catch {
      throw new PortalProblem("Refresh this page before submitting.");
    }
    const action =
      payload.action === "record"
        ? "record"
        : payload.action === "split"
          ? "split"
          : "sign";

    // "split" takes an already-uploaded combined PDF and fans it out into one
    // recorded document per detected type. Carrier accounts only; the kind
    // whitelist below does not apply because the AI assigns each kind.
    if (action === "split") {
      const profile = await requireProfile(user.id);
      if (profile.role !== "carrier")
        throw new PortalProblem("Packet splitting is for carrier accounts.", 403);
      const path = text(payload.path, 300);
      if (!path.startsWith(`${user.id}/`) || path.split("/").length !== 3)
        throw new PortalProblem("Invalid upload. Please try again.");
      if (extensionOf(path) !== "pdf")
        throw new PortalProblem("Only PDF packets can be split.");
      const db = createAdminClient();
      const dir = path.slice(0, path.lastIndexOf("/"));
      const fileName = path.slice(path.lastIndexOf("/") + 1);
      const listed = result(await db.storage.from(DOCUMENT_BUCKET).list(dir));
      const object = listed?.find((entry) => entry.name === fileName);
      if (!object)
        throw new PortalProblem("Upload did not complete. Try again.");
      const size = Number(object.metadata?.size ?? 0);
      if (size <= 0 || size > MAX_BYTES)
        throw new PortalProblem(
          "That file is larger than 15 MB. Please upload a smaller file.",
        );
      const created = await splitCarrierPacket(user.id, path);
      return Response.json({ ok: true, created });
    }

    const kind = text(payload.kind, 30);
    const company = kind === "company";

    if (company) {
      if (!staff) throw new PortalProblem("Agent desk access required.", 403);
    } else {
      // Carriers and customers both upload to their own account (fn_documents,
      // scoped by user_id); each role may only use its own document kinds.
      const profile = await requireProfile(user.id);
      const allowed =
        profile.role === "carrier" ? CARRIER_KINDS : CUSTOMER_KINDS;
      if (!allowed.includes(kind))
        throw new PortalProblem("Choose a document type.");
    }

    const db = createAdminClient();
    const owner = company ? "company" : user.id;

    if (action === "sign") {
      const rawName = text(payload.name, 200);
      const ext = extensionOf(rawName);
      if (!MIME_BY_EXT[ext])
        throw new PortalProblem("Upload a PDF, JPG or PNG.");
      if (company && !text(payload.title, 150))
        throw new PortalProblem("Enter a document title.");

      let countQuery = db
        .from(company ? "fn_company_documents" : "fn_documents")
        .select("id", { count: "exact", head: true });
      if (!company) countQuery = countQuery.eq("user_id", user.id);
      const counted = await countQuery;
      if (counted.error)
        throw new PortalProblem("Document storage unavailable.", 503);
      if ((counted.count || 0) >= 100)
        throw new PortalProblem("Document limit reached. Contact dispatch.");

      const safeName =
        rawName.replace(/[^a-zA-Z0-9._ -]/g, "_") || `document.${ext}`;
      const path = `${owner}/${randomUUID()}/${safeName}`;
      const signed = result(
        await db.storage.from(DOCUMENT_BUCKET).createSignedUploadUrl(path),
      );
      return Response.json({ path, token: signed!.token });
    }

    // action === "record"
    const path = text(payload.path, 300);
    if (!path.startsWith(`${owner}/`) || path.split("/").length !== 3)
      throw new PortalProblem("Invalid upload. Please try again.");
    const fileName = path.slice(path.lastIndexOf("/") + 1);
    const ext = extensionOf(fileName);
    const expectedMime = MIME_BY_EXT[ext];
    if (!expectedMime) throw new PortalProblem("Upload a PDF, JPG or PNG.");

    const dir = path.slice(0, path.lastIndexOf("/"));
    const listed = result(await db.storage.from(DOCUMENT_BUCKET).list(dir));
    const object = listed?.find((entry) => entry.name === fileName);
    if (!object) throw new PortalProblem("Upload did not complete. Try again.");
    const size = Number(object.metadata?.size ?? 0);
    const mimetype = String(object.metadata?.mimetype ?? "");
    const invalid =
      size <= 0 || size > MAX_BYTES || mimetype !== expectedMime;
    if (invalid) {
      await db.storage.from(DOCUMENT_BUCKET).remove([path]);
      throw new PortalProblem(
        size > MAX_BYTES
          ? "That file is larger than 15 MB. Please upload a smaller file."
          : "Upload a valid PDF, JPG or PNG.",
      );
    }

    const title = company ? text(payload.title, 150) : "";
    if (company && !title) {
      await db.storage.from(DOCUMENT_BUCKET).remove([path]);
      throw new PortalProblem("Enter a document title.");
    }
    const saved = company
      ? await db.from("fn_company_documents").insert({ title, path })
      : await db.rpc("fn_add_document", {
          p_user: user.id,
          p_kind: kind,
          p_path: path,
          p_name: fileName,
        });
    if (saved.error) {
      await db.storage.from(DOCUMENT_BUCKET).remove([path]);
      throw new PortalProblem(
        "Document could not be saved. Please try again.",
        503,
      );
    }
    return Response.json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
