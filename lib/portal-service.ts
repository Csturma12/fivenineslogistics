import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendPortalEmail } from "@/lib/portal-mail";
import { notificationHtml } from "@/lib/portal-notification";
import { DOCUMENT_BUCKET, PortalProblem, type Profile } from "@/lib/portal-contract";
import { verifiedPortalIdentity } from "@/lib/portal-access-policy";

export const BUCKET = DOCUMENT_BUCKET;
export async function portalIdentity() {
  const {
    data: { user },
    error,
  } = await (await createClient()).auth.getUser();
  return verifiedPortalIdentity(user, error);
}
export function sameOrigin(req: Request) {
  if (req.headers.get("origin") !== new URL(req.url).origin)
    throw new PortalProblem("Refresh this page before submitting.", 403);
}
export async function profileFor(id: string): Promise<Profile | null> {
  const { data, error } = await createAdminClient()
    .from("fn_profiles")
    .select("*")
    .eq("user_id", id)
    .maybeSingle();
  if (error)
    throw new PortalProblem(
      "Portal setup is temporarily unavailable. Please contact dispatch.",
      503,
    );
  return data as Profile | null;
}
export async function requireProfile(id: string, role?: string) {
  const p = await profileFor(id);
  if (!p || p.status === "suspended" || (role && p.role !== role))
    throw new PortalProblem(
      "This account does not have access to that action.",
      403,
    );
  return p;
}
export function result<T>(response: {
  data: T;
  error: { message: string } | null;
}): T {
  if (response.error)
    throw new PortalProblem(
      "The change could not be completed. Refresh and try again.",
      409,
    );
  return response.data;
}

// A lost API response may follow a committed document insert. Verify the
// owner's stored path before retrying or cleaning up its Storage object.
export async function recordedDocumentState(input: {
  db: ReturnType<typeof createAdminClient>;
  company: boolean;
  path: string;
  userId: string;
  kind: string;
  name: string;
  title: string;
}): Promise<"absent" | "matching" | "conflict"> {
  const { db, company, path, userId, kind, name, title } = input;
  if (company) {
    const { data, error } = await db.from("fn_company_documents")
      .select("id,title").eq("path", path).maybeSingle();
    if (error) throw new PortalProblem(
      "Upload status could not be verified. Refresh the page before retrying.", 503,
    );
    if (!data) return "absent";
    return data.title === title ? "matching" : "conflict";
  }
  const { data, error } = await db.from("fn_documents")
    .select("id,user_id,kind,name").eq("path", path).maybeSingle();
  if (error) throw new PortalProblem(
    "Upload status could not be verified. Refresh the page before retrying.", 503,
  );
  if (!data) return "absent";
  return data.user_id === userId && data.kind === kind && data.name === name
    ? "matching" : "conflict";
}
export function failure(error: unknown) {
  const known = error instanceof PortalProblem;
  return Response.json(
    {
      error: known
        ? error.message
        : "Portal unavailable. Please try again shortly.",
    },
    {
      status: known ? error.status : 503,
      headers: { "Cache-Control": "private, no-store" },
    },
  );
}
/** Durable queue; provider idempotency prevents concurrent sends from duplicating mail. */
export async function flushNotifications() {
  const db = createAdminClient();
  const cutoff = new Date(Date.now() - 23 * 3600_000).toISOString();
  await db
    .from("fn_notifications")
    .update({
      last_error: "Manual follow-up required; delivery window expired.",
    })
    .is("sent_at", null)
    .lt("created_at", cutoff);
  // Expired items remain visible to dispatch, but must not starve newer mail.
  const { data, error } = await db
    .from("fn_notifications")
    .select("*")
    .is("sent_at", null)
    .gte("created_at", cutoff)
    .order("created_at")
    .limit(20);
  if (error) return;
  for (const event of data || []) {
    // Provider deduplication expires after 24h. Older uncertain sends need desk review.
    if (Date.parse(event.created_at) < Date.now() - 23 * 3600_000) {
      await db
        .from("fn_notifications")
        .update({
          last_error: "Manual follow-up required; delivery window expired.",
        })
        .eq("id", event.id);
      continue;
    }
    try {
      const response = await sendPortalEmail({
        to: [event.recipient],
        subject: event.subject,
        html: notificationHtml(event),
        idempotencyKey: `portal-event/${event.id}`,
      });
      if (response.error) throw new Error("Email delivery failed");
      await db
        .from("fn_notifications")
        .update({ sent_at: new Date().toISOString(), last_error: null })
        .eq("id", event.id);
    } catch {
      await db
        .from("fn_notifications")
        .update({
          last_error:
            "Email not confirmed. Retry delivery or contact the recipient.",
        })
        .eq("id", event.id);
    }
  }
}
