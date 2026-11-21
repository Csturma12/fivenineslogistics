// Username logins are stored as Supabase users on a non-mailbox subdomain so
// customers can sign in without a real email address.
export const PORTAL_USERNAME_DOMAIN = "portal.fivenineslogistics.com"

export function usernameSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function portalLoginEmail(identifier: string): string {
  const value = identifier.trim().toLowerCase()
  if (value.includes("@")) return value
  return `${usernameSlug(value)}@${PORTAL_USERNAME_DOMAIN}`
}
