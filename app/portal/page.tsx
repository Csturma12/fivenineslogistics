import { PortalEntry } from "@/components/portal/portal-entry";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Carrier portal — Five Nines Logistics",
  description: "Complete your carrier setup and bid on available Five Nines loads.",
  robots: { index: false, follow: false },
};

export default function CarrierPortalPage() {
  return <PortalEntry role="carrier" />;
}
