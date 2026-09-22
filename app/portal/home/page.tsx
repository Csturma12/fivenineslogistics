import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { profileFor } from "@/lib/portal-service";
export const dynamic = "force-dynamic";
export default async function LegacyPortalHome() {
  const { data: { user } } = await (await createClient()).auth.getUser();
  const profile = user ? await profileFor(user.id) : null;
  redirect((profile?.role || user?.app_metadata?.role) === "customer" ? "/portal/customer" : "/portal");
}
