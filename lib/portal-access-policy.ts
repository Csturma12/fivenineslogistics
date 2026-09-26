import type { User } from "@supabase/supabase-js";
import { PortalProblem } from "./portal-contract";

/** Only the exact company domain grants access to the agent desk. */
export function isAgentDeskEmail(email?: string): boolean {
  return !!email && !/\s/.test(email) && /^[^@\s]+@shipfivenines\.com$/i.test(email);
}

/** The user must come from a successful server-side auth.getUser() call. */
export function verifiedPortalIdentity(user: User | null, error: unknown = null) {
  if (error || !user?.email || !user.email_confirmed_at || user.is_anonymous)
    throw new PortalProblem("Sign in to continue.", 401);

  // Editable profile/identity metadata must never grant staff access.
  return { user, staff: isAgentDeskEmail(user.email) };
}
