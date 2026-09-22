import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PortalWorkspace } from "@/components/portal/workspace";
export const metadata = {
  title: "Agent desk — Five Nines Logistics",
  robots: { index: false, follow: false },
};
// This shell contains no private data. Every data request verifies staff access.
export default function AgentDeskPage() {
  return (
    <main>
      <SiteHeader />
      <PortalWorkspace desk />
      <SiteFooter />
    </main>
  );
}
