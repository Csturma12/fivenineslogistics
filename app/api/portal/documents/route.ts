import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { PortalProblem, text, uuid } from "@/lib/portal-contract";
import {
  BUCKET,
  failure,
  portalIdentity,
  requireProfile,
  result,
  sameOrigin,
} from "@/lib/portal-service";

export const dynamic = "force-dynamic";
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
        .from(BUCKET)
        .createSignedUrl(doc.path, 60, { download: doc.name || doc.title }),
    );
    return Response.redirect(signed!.signedUrl, 303);
  } catch (error) {
    return failure(error);
  }
}
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const { user, staff } = await portalIdentity();
    if (Number(request.headers.get("content-length") || 0) > 3_200_000)
      throw new PortalProblem("Files must be 3 MB or smaller.", 413);
    const form = await request.formData();
    const kind = text(form.get("kind"), 30);
    const company = kind === "company";
    if (company && !staff)
      throw new PortalProblem("Agent desk access required.", 403);
    if (!company) await requireProfile(user.id, "carrier");
    if (!["company", "packet", "coi", "w9", "noa"].includes(kind))
      throw new PortalProblem("Choose a document type.");
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0 || file.size > 3_145_728)
      throw new PortalProblem("Choose a PDF, JPG or PNG, up to 3 MB.");
    const bytes = new Uint8Array(await file.arrayBuffer());
    const mime =
      bytes[0] === 0x25 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x44 &&
      bytes[3] === 0x46 &&
      bytes[4] === 0x2d
        ? "application/pdf"
        : bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
          ? "image/jpeg"
          : [137, 80, 78, 71, 13, 10, 26, 10].every((b, i) => bytes[i] === b)
            ? "image/png"
            : null;
    if (!mime || mime !== file.type)
      throw new PortalProblem("Upload a valid PDF, JPG or PNG.");
    const name =
      text(file.name, 200).replace(/[^a-zA-Z0-9._ -]/g, "_") || "document";
    const title = company ? text(form.get("title"), 150) : "";
    if (company && !title) throw new PortalProblem("Enter a document title.");
    const path = `${company ? "company" : user.id}/${randomUUID()}/${name}`;
    const db = createAdminClient();
    let countQuery = db
      .from(company ? "fn_company_documents" : "fn_documents")
      .select("id", { count: "exact", head: true });
    if (!company) countQuery = countQuery.eq("user_id", user.id);
    const counted = await countQuery;
    if (counted.error)
      throw new PortalProblem("Document storage unavailable.", 503);
    if ((counted.count || 0) >= 100)
      throw new PortalProblem("Document limit reached. Contact dispatch.");
    result(
      await db.storage
        .from(BUCKET)
        .upload(path, bytes, { contentType: mime, upsert: false }),
    );
    const saved = company
      ? await db.from("fn_company_documents").insert({ title, path })
      : await db.rpc("fn_add_document", {
          p_user: user.id,
          p_kind: kind,
          p_path: path,
          p_name: name,
        });
    if (saved.error) {
      await db.storage.from(BUCKET).remove([path]);
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
