import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { PortalWorkspace } from "@/components/portal/workspace";
import { previewWorkspace } from "@/tests/portal-fixtures";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Local portal preview",
  robots: { index: false, follow: false },
};
export default async function Preview({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  // No configuration switch, no auth override. Never available in production.
  if (process.env.NODE_ENV !== "development") notFound();
  const { view = "carrier" } = await searchParams;
  return (
    <main>
      <SiteHeader />
      <PortalWorkspace
        desk={view === "desk"}
        previewData={previewWorkspace(view)}
      />
    </main>
  );
}
