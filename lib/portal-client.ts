import type { Workspace } from "./portal-contract";

export const MAX_UPLOAD_BYTES = 3_145_728;
const SIZE_ERROR = "That file is too large. Each file must be 3 MB or smaller.";
const UNCONFIRMED =
  "The portal returned an unexpected response. We could not confirm the result. Refresh before retrying.";

export class PortalResponseError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "PortalResponseError";
  }
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

async function readBody(res: Response): Promise<Record<string, unknown>> {
  // A platform rejection can be plain text, HTML, or even an empty body.
  if (res.status === 413) throw new PortalResponseError(SIZE_ERROR, 413);
  let body: unknown;
  try {
    body = JSON.parse(await res.text());
  } catch {
    // Never put a platform error page in the UI or treat it as a saved result.
  }
  const message =
    record(body) && typeof body.error === "string" && body.error.trim()
      ? body.error
      : res.status === 401
        ? "Sign in to continue."
        : !res.ok
          ? `Something went wrong (${res.status}). Please try again.`
          : UNCONFIRMED;
  if (!res.ok || !record(body) || "error" in body)
    throw new PortalResponseError(message, res.status);
  return body;
}

function profile(value: unknown): boolean {
  if (value === null) return true;
  return (
    record(value) &&
    (value.role === "carrier" || value.role === "customer") &&
    ["user_id", "email", "company", "status", "highway_status", "review_note"].every(
      (key) => typeof value[key] === "string",
    ) &&
    record(value.details) &&
    Object.values(value.details).every((entry) => typeof entry === "string") &&
    typeof value.version === "number" && Number.isFinite(value.version) &&
    (value.customer_account_id === null || typeof value.customer_account_id === "string")
  );
}

function records(value: unknown): boolean {
  return Array.isArray(value) && value.every(record);
}

export async function readWorkspaceResponse(res: Response): Promise<Workspace> {
  const body = await readBody(res);
  // Validate the response envelope before it reaches React state. Domain-level
  // permissions and data validation remain the server's responsibility.
  if (
    !["email", "hint", "company"].every((key) => typeof body[key] === "string") ||
    typeof body.staff !== "boolean" ||
    !profile(body.profile) ||
    !(body.highwayUrl === null || typeof body.highwayUrl === "string") ||
    !["documents", "companyDocuments", "loads", "bids", "requests", "bookings"].every(
      (key) => records(body[key]),
    ) ||
    !["historyLoads", "profiles", "notifications"].every(
      (key) => body[key] === undefined || records(body[key]),
    )
  ) throw new PortalResponseError(UNCONFIRMED, res.status);
  return body as unknown as Workspace;
}

export async function sendPortalChange(
  body: Record<string, unknown> | FormData,
  fetcher: typeof fetch = fetch,
): Promise<void> {
  const upload = body instanceof FormData;
  if (upload) {
    const chosen = body.get("file");
    if (!(chosen instanceof File) || chosen.size === 0)
      throw new Error("Choose a PDF, JPG or PNG to upload.");
    if (chosen.size > MAX_UPLOAD_BYTES) throw new Error(SIZE_ERROR);
  }
  const res = await fetcher(`/api/portal/${upload ? "documents" : "workspace"}`, {
    method: "POST",
    ...(upload ? {} : { headers: { "Content-Type": "application/json" } }),
    body: upload ? body : JSON.stringify(body),
  });
  const result = await readBody(res);
  if (result.ok !== true) throw new PortalResponseError(UNCONFIRMED, res.status);
}
