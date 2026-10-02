import type { User } from "@supabase/supabase-js";
import { PortalProblem } from "./portal-contract";

// This one verified address remains available while the owner tests the desk.
const TEST_AGENT_DESK_EMAIL = "sturma@blbxcritical.com";

/** Exact company domain, plus the owner's designated testing address. */
export function isAgentDeskEmail(email?: string): boolean {
  return !!email && !/\s/.test(email) && (
    /^[^@\s]+@shipfivenines\.com$/i.test(email) ||
    email.toLowerCase() === TEST_AGENT_DESK_EMAIL
  );
}

/** The user must come from a successful server-side auth.getUser() call. */
export function verifiedPortalIdentity(user: User | null, error: unknown = null) {
  if (error || !user?.email || !user.email_confirmed_at || user.is_anonymous)
    throw new PortalProblem("Sign in to continue.", 401);

  // Editable profile/identity metadata must never grant staff access.
  return { user, staff: isAgentDeskEmail(user.email) };
}
