import { PortalEntry } from "@/components/portal/portal-entry";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Customer portal — Five Nines Logistics",
  robots: { index: false, follow: false },
};
export default function CustomerPortalPage() { return <PortalEntry role="customer" />; }
