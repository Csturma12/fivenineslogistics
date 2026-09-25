import { DOCUMENT_BUCKET } from "./portal-contract";
import { createClient } from "./supabase/client";

export const MAX_UPLOAD_BYTES = 15_728_640;

type UploadDeps = {
  fetcher?: typeof fetch;
  uploadBytes?: (path: string, token: string, file: File, contentType: string) => Promise<{ error: unknown }>;
};

const MIME_BY_EXT: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};

// Browsers and operating systems can report these types for otherwise valid
// files. Storage receives the canonical type derived from the allowed suffix.
const MIME_ALIASES: Record<string, readonly string[]> = {
  "application/pdf": ["application/pdf", "application/x-pdf"],
  "image/jpeg": ["image/jpeg", "image/pjpeg"],
  "image/png": ["image/png", "image/x-png"],
};

const UNCONFIRMED_UPLOAD =
  "The upload may have finished, but confirmation was lost. Refresh your documents before uploading it again.";

function uploadMime(file: File): string {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  const expected = MIME_BY_EXT[extension];
  const reported = file.type.toLowerCase();
  if (!expected || (reported && reported !== "application/octet-stream" && !MIME_ALIASES[expected].includes(reported)))
    throw new Error("Choose a valid PDF, JPG or PNG file.");
  return expected;
}

export async function readPortalBody(res: Response): Promise<Record<string, unknown>> {
  const raw = await res.text();
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : { error: "The portal returned an unexpected response. Refresh and try again." };
  } catch {
    return {
      error: res.status === 413
        ? "That file is too large to upload. Each file must be 15 MB or smaller."
        : `Something went wrong (${res.status || "network error"}). Please try again.`,
    };
  }
}

// The API receives only metadata. File bytes use a one-time Storage upload URL.
export async function uploadDocument(form: FormData, deps: UploadDeps = {}): Promise<string> {
  const file = form.get("file");
  const kind = String(form.get("kind") || "");
  const title = String(form.get("title") || "");
  const split = String(form.get("split") || "") === "yes";
  if (!(file instanceof File) || file.size === 0)
    throw new Error("Choose a PDF, JPG or PNG to upload.");
  if (file.size > MAX_UPLOAD_BYTES)
    throw new Error("That file is too large. Each file must be 15 MB or smaller.");
  const contentType = uploadMime(file);
  if ((split || kind === "combined") && contentType !== "application/pdf")
    throw new Error("A combined packet or auto-split upload must be a PDF.");

  const fetcher = deps.fetcher ?? fetch;
  const signRes = await fetcher("/api/portal/documents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "sign", kind, name: file.name, title }),
  });
  const signed = await readPortalBody(signRes);
  if (!signRes.ok || signed.error)
    throw new Error(String(signed.error || "Upload could not start. Please retry."));
  const { path, token } = signed;
  if (typeof path !== "string" || typeof token !== "string" || !path || !token)
    throw new Error("Upload could not start. Refresh before retrying.");

  const uploadBytes = deps.uploadBytes ?? (async (uploadPath, uploadToken, uploadFile, mime) =>
    createClient().storage.from(DOCUMENT_BUCKET).uploadToSignedUrl(
      uploadPath, uploadToken, uploadFile, { contentType: mime },
    ));
  const { error: uploadError } = await uploadBytes(path, token, file, contentType);
  if (uploadError)
    throw new Error("The file could not be uploaded. Check your connection and retry.");

  const action = split ? "split" : "record";
  const finishRequest: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(split
      ? { action, path }
      : { action, kind, path, name: file.name, title }),
  };
  let finishRes: Response;
  let finished: Record<string, unknown>;
  try {
    finishRes = await fetcher("/api/portal/documents", finishRequest);
    finished = await readPortalBody(finishRes);
  } catch {
    if (split) throw new Error(UNCONFIRMED_UPLOAD);
    // A lost reply may follow a committed record. Retry the same path once;
    // the record endpoint treats an already-recorded matching path as success.
    try {
      finishRes = await fetcher("/api/portal/documents", finishRequest);
      finished = await readPortalBody(finishRes);
    } catch {
      throw new Error(UNCONFIRMED_UPLOAD);
    }
  }
  if (!finishRes.ok || finished.error || finished.ok !== true)
    throw new Error(
      finished.error
        ? `${String(finished.error)} Refresh your documents before uploading again.`
        : UNCONFIRMED_UPLOAD,
    );
  if (!split) return "Document uploaded securely. Add another file if needed.";

  const created = Array.isArray(finished.created)
    ? finished.created as { label: string; pages: number }[]
    : [];
  if (created.length === 0)
    return "Upload complete, but no separate documents were detected.";
  const summary = created.map((doc) => `${doc.label} (${doc.pages} pg)`).join(", ");
  return `Split into ${created.length} document${created.length === 1 ? "" : "s"}: ${summary}.`;
}
