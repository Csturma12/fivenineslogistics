import type { Metadata } from "next"
import { LegalPage, type LegalSection } from "@/components/legal-page"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Terms of Service | Five Nines Logistics",
  description:
    "Terms for using the Five Nines Logistics website, shipper portal and carrier portal.",
  alternates: { canonical: "/terms" },
}

const email = site.infoEmail

const sections: LegalSection[] = [
  {
    id: "agreement",
    title: "Agreement to these terms",
    body: (
      <p>
        These terms govern your use of {site.domain}, the Five Nines shipper portal and carrier portal
        (together, the &ldquo;Services&rdquo;). By using the Services you agree to these terms. If you use them on
        behalf of a company, you confirm you are authorized to bind that company.
      </p>
    ),
  },
  {
    id: "brokerage",
    title: "Our role and broker authority",
    body: (
      <>
        <p>
          Five Nines Logistics is an authorized agency of {site.authority}. All transportation is arranged under{" "}
          {site.authority}&apos;s broker authority ({site.mc} / {site.dot}). Unless a shipment document states
          otherwise, Five Nines acts as a broker and does not take possession of freight.
        </p>
        <p>
          Each shipment is governed by its rate confirmation, any signed shipper or broker-carrier agreement, and
          the bill of lading. If those documents conflict with these terms, the shipment documents control.
        </p>
      </>
    ),
  },
  {
    id: "quotes",
    title: "Quotes and rates",
    body: (
      <p>
        Website and portal quotes, rate estimates and capacity responses are informational and non-binding until
        confirmed in a written rate confirmation. Rates can change with fuel, accessorials, detention, permits,
        and changes to the shipment details you provide. You are responsible for the accuracy of weights,
        dimensions, commodity descriptions and site requirements.
      </p>
    ),
  },
  {
    id: "accounts",
    title: "Portal accounts",
    body: (
      <ul className="flex list-disc flex-col gap-2 pl-5">
        <li>Portal access is granted by Five Nines to approved shippers and carriers and may be revoked at any time.</li>
        <li>Keep your username and password confidential. You are responsible for activity under your login.</li>
        <li>Do not share accounts. Ask us for additional logins for your team instead.</li>
        <li>Tell us immediately at {email} if you believe your account has been compromised.</li>
      </ul>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <p>You agree not to:</p>
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>Access records that do not belong to your company or attempt to bypass security.</li>
          <li>Submit false documents, impersonate another carrier or shipper, or re-broker freight without written consent.</li>
          <li>Scrape, overload or interfere with the Services, or upload malware.</li>
          <li>Use the Services for anything unlawful.</li>
        </ul>
        <p>Five Nines maintains a zero double-brokering policy and may report violations to authorities.</p>
      </>
    ),
  },
  {
    id: "content",
    title: "Documents and content",
    body: (
      <p>
        You keep ownership of the documents and information you upload, and you give us permission to use them to
        provide the Services and arrange your shipments. The Five Nines name, marks and site content belong to us
        and may not be copied without permission.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Disclaimers and liability",
    body: (
      <>
        <p>
          The Services, including tracking data, ETAs, maps and status updates, are provided &ldquo;as is&rdquo; and
          may be delayed or inaccurate. Cargo loss and damage claims are handled under the applicable shipment
          documents and the carrier&apos;s liability, not these terms.
        </p>
        <p>
          To the fullest extent allowed by law, Five Nines and {site.authority} are not liable for indirect,
          incidental, special or consequential damages, including lost profits or downtime, arising from use of
          the website or portals.
        </p>
      </>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    body: (
      <p>
        These terms are governed by the laws of the State of Texas and applicable U.S. federal law. Disputes about
        the Services will be brought in the state or federal courts located in Harris County, Texas.
      </p>
    ),
  },
  {
    id: "changes-contact",
    title: "Changes and contact",
    body: (
      <p>
        We may update these terms; continued use after an update means you accept the new version. Questions?
        Email{" "}
        <a href={`mailto:${email}`} className="text-primary underline underline-offset-4">
          {email}
        </a>{" "}
        or call{" "}
        <a href={site.phoneHref} className="text-primary underline underline-offset-4">
          {site.phone}
        </a>
        .
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      effectiveDate="November 22, 2026"
      intro={
        <p>
          The ground rules for using our website and portals. Shipment-specific terms always live in your rate
          confirmation.
        </p>
      }
      sections={sections}
      related={{ href: "/privacy", label: "Read the Privacy Policy" }}
    />
  )
}
