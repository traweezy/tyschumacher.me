import type { Metadata, Viewport } from "next";
import { Fraunces, Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SiteHeader } from "@/components/layout/site-header";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://tyschumacher.me";
const title = "Tyler Schumacher | Builds calm software for high-pressure teams";
const description =
  "Principal-level product engineer shipping calm, reliable software for trading, sportsbook, and media teams under pressure.";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Tyler Schumacher",
  url: siteUrl,
  jobTitle: "Principal Software Engineer",
  email: "mailto:tyschumacher@proton.me",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Buffalo",
    addressRegion: "NY",
    addressCountry: "US",
  },
  sameAs: [
    "https://github.com/traweezy",
    "https://www.linkedin.com/in/tyler-schumacher-ba1a44360",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · Tyler Schumacher",
  },
  description,
  keywords: [
    "Tyler Schumacher",
    "Principal engineer",
    "Product engineer",
    "React",
    "TypeScript",
    "Operator-facing software",
    "High-pressure products",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    title,
    description,
    siteName: "Tyler Schumacher Portfolio",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Tyler Schumacher | Builds calm software for high-pressure teams",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4ecdf",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" data-motion="safe">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className={`${manrope.variable} ${fraunces.variable} ${geistMono.variable}`}>
        <Providers>
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <SiteHeader />
          <main id="main-content">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
