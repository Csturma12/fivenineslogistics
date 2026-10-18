import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RequestCapacityProvider } from "@/components/request-capacity-panel";
import "./globals.css";
import "./redesign.css";

const _geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const _geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LogisticsService",
  name: "Five Nines Logistics",
  alternateName: "5N Logistics",
  url: "https://fivenineslogistics.com",
  telephone: "+1-205-842-3755",
  email: "dispatch@fivenineslogistics.com",
  description:
    "Mission-critical industrial freight brokerage and 3PL specializing in data center switchgear, refinery turnarounds, PFV, heavy haul, and port drayage. Operating as an authorized agency of Primary Freight LLC (MC# 841023 / U.S. DOT# 2436508).",
  identifier: [
    { "@type": "PropertyValue", propertyID: "MC Number", value: "MC# 841023" },
    { "@type": "PropertyValue", propertyID: "USDOT Number", value: "2436508" },
  ],
  parentOrganization: {
    "@type": "Organization",
    name: "Primary Freight LLC",
    description: "Licensed freight broker authority (MC# 841023 / U.S. DOT# 2436508) under which Five Nines Logistics operates as an authorized agency.",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Houston",
    addressRegion: "TX",
    addressCountry: "US",
  },
  areaServed: ["US", "CA", "MX"],
  openingHours: "Mo-Su 00:00-23:59",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "24/7 live dispatch",
    telephone: "+1-205-842-3755",
    email: "dispatch@fivenineslogistics.com",
    areaServed: ["US", "CA", "MX"],
    availableLanguage: ["English", "Spanish"],
  },
};

export const metadata: Metadata = {
  metadataBase: new URL("https://fivenineslogistics.com"),
  title: "Five Nines Logistics | Critical Freight Brokerage",
  description:
    "Mission-critical industrial freight brokerage and 3PL: data center switchgear, refinery turnarounds, PFV, heavy haul, port drayage, and white-label 3PL execution. Authorized agency of Primary Freight LLC (MC# 841023).",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#12345a",
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <script
          type="application/ld+json"
          // JSON-LD is static, server-rendered data; it never includes user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body
        className={`${_geistSans.variable} ${_geistMono.variable} antialiased font-sans`}
      >
        <RequestCapacityProvider>{children}</RequestCapacityProvider>
        {process.env.NODE_ENV === "production" && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
