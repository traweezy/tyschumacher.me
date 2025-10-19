import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SiteHeader } from "@/components/layout/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://tyschumacher.me";
const title = "Tyler Schumacher | Full stack engineer for realtime teams";
const description =
  "Principal level engineer shipping realtime accessible products for trading sports and media organizations.";

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
    "Full stack engineer",
    "React",
    "TypeScript",
    "Realtime systems",
    "Design systems",
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
        alt: "Tyler Schumacher | Full stack engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020009",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" data-motion="safe">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="cosmic-background" aria-hidden="true">
          <div className="cosmic-background__layer cosmic-background__layer--nebula" />
          <div className="cosmic-background__layer cosmic-background__layer--grid" />
          <div className="cosmic-background__layer cosmic-background__layer--stars" />
        </div>
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
