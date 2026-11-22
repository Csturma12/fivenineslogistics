import type { Metadata } from "next"
import { LegalPage, type LegalSection } from "@/components/legal-page"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Privacy Policy | Five Nines Logistics",
  description:
    "How Five Nines Logistics collects, uses, shares and protects information from shippers, carriers and website visitors.",
  alternates: { canonical: "/privacy" },
}

const email = site.infoEmail

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <p>
        Five Nines Logistics (&ldquo;Five Nines,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) is a freight
        coordination and brokerage brand based in {site.location}, operating as an authorized agency of{" "}
        {site.authority} ({site.mc} / {site.dot}). This policy covers {site.domain}, our shipper and carrier
        portals, and the communications we send in connection with them.
      </p>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    body: (
      <>
        <p>We collect only what we need to quote, move and document freight:</p>
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>
            <strong className="text-foreground">Contact details</strong> you submit through quote, capacity,
            consultation, document or job forms: name, company, email, phone and role.
          </li>
          <li>
            <strong className="text-foreground">Shipment details</strong> such as origin, destination, dates,
            commodity, dimensions, weights and special handling notes.
          </li>
          <li>
            <strong className="text-foreground">Portal account data</strong>: username, encrypted password,
            company association and sign-in activity.
          </li>
          <li>
            <strong className="text-foreground">Carrier compliance records</strong>: MC/DOT numbers, insurance
            certificates, W-9s and similar onboarding documents.
          </li>
          <li>
            <strong className="text-foreground">Technical data</strong>: IP address, browser type and pages
            visited, collected through standard server logs and essential cookies.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    title: "How we use information",
    body: (
      <ul className="flex list-disc flex-col gap-2 pl-5">
        <li>To respond to quote and capacity requests and arrange transportation.</li>
        <li>To operate portal accounts, show shipment status, PODs and documents to authorized users.</li>
        <li>To vet and onboard carriers and prevent fraud and double-brokering.</li>
        <li>To send operational emails and notifications about your shipments or requests.</li>
        <li>To keep the site secure, troubleshoot problems and meet legal and regulatory obligations.</li>
      </ul>
    ),
  },
  {
    id: "google-data",
    title: "Google user data",
    body: (
      <>
        <p>
          Some features connect to Google Workspace services (for example Gmail, Google Drive, Google Sheets,
          Google Contacts, Google Chat and Google Maps) to send shipment emails, store freight documents,
          maintain contact records and display locations. Data accessed through these services is used only to
          provide those features to you and to our internal team.
        </p>
        <p>
          Five Nines&apos; use and transfer of information received from Google APIs adheres to the{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            className="text-primary underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements. We do not sell Google user data, use it for advertising, or
          use it to train generalized AI models, and people at Five Nines do not read it except where needed for
          security, legal compliance, or with your permission to support a request.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "How we share information",
    body: (
      <>
        <p>We do not sell personal information. We share it only as needed to move freight and run our business:</p>
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>With {site.authority}, under whose broker authority every load is arranged.</li>
          <li>
            With carriers, facilities and partners assigned to your shipment, limited to what they need to
            perform it.
          </li>
          <li>
            With service providers that host and support our systems, such as website hosting, database,
            email delivery and Google Workspace, under confidentiality obligations.
          </li>
          <li>When required by law, regulation, subpoena or to protect the rights and safety of others.</li>
        </ul>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <p>
        We use essential cookies to keep you signed in to the portal and to protect forms from abuse. We do not
        use advertising cookies. You can block cookies in your browser, but the portal will not work without
        them.
      </p>
    ),
  },
  {
    id: "security-retention",
    title: "Security and retention",
    body: (
      <>
        <p>
          Data is encrypted in transit, passwords are stored hashed, and portal users can see only their own
          company&apos;s records. No system is perfectly secure, so please keep your login private and tell us
          right away if you suspect misuse.
        </p>
        <p>
          We keep shipment and compliance records for as long as needed for operations, billing, claims and
          regulatory recordkeeping, then delete or anonymize them.
        </p>
      </>
    ),
  },
  {
    id: "your-choices",
    title: "Your choices",
    body: (
      <p>
        You can ask us to access, correct or delete your personal information, or to close your portal
        account, by emailing{" "}
        <a href={`mailto:${email}`} className="text-primary underline underline-offset-4">
          {email}
        </a>
        . Some records may need to be kept to meet legal or contractual obligations. Our site is intended for
        business use and is not directed to children under 16.
      </p>
    ),
  },
  {
    id: "changes-contact",
    title: "Changes and contact",
    body: (
      <p>
        We may update this policy as our services change; the effective date above will show the latest
        version. Questions? Email{" "}
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

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      effectiveDate="November 22, 2026"
      intro={
        <p>
          Shippers and carriers trust us with freight details, documents and contacts. Here is exactly what we
          collect, why, and who sees it.
        </p>
      }
      sections={sections}
      related={{ href: "/terms", label: "Read the Terms of Service" }}
    />
  )
}
