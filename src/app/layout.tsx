import type { Metadata, Viewport } from "next";
import { Fraunces, Geist_Mono, Manrope } from "next/font/google";
import { headers } from "next/headers";
import "react-vertical-timeline-component/style.min.css";
import "./globals.css";
import { Providers } from "./providers";
import { SiteHeader } from "@/components/layout/site-header";

const themeModeStorageKey = "tyschumacher.theme-mode";
const themeModeInitializerScript = `(() => {
  const modes = new Set(["light", "dark"]);
  const readStoredMode = () => {
    try {
      const value = window.localStorage.getItem("${themeModeStorageKey}");
      return modes.has(value) ? value : null;
    } catch {
      return null;
    }
  };
  const readSystemMode = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const mode = readStoredMode() ?? readSystemMode();
  document.documentElement.dataset.theme = "civic-" + mode;
  document.documentElement.dataset.themeMode = mode;
})();`;
const themeControlsInitializerScript = `(() => {
  const readMode = () =>
    document.documentElement.dataset.themeMode === "dark" ? "dark" : "light";
  const syncControls = () => {
    const mode = readMode();
    const nextMode = mode === "dark" ? "light" : "dark";
    document.querySelectorAll("[data-theme-mode-toggle]").forEach((control) => {
      if (!(control instanceof HTMLButtonElement)) {
        return;
      }
      control.setAttribute("aria-pressed", String(mode === "dark"));
      control.setAttribute("aria-label", "Switch to " + nextMode + " theme");
    });
  };
  syncControls();
})();`;

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
const title = "Tyler Schumacher | Software for teams that work live";
const description =
  "I build interfaces and services for trading, sportsbook, and operations teams that need fast decisions, visible state, and reliable releases.";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Tyler Schumacher",
  url: siteUrl,
  jobTitle: "Principal Product Engineer",
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
    "Operator software",
    "Systems reliability",
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
        alt: "Tyler Schumacher | Software for teams that work live",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5fb" },
    { media: "(prefers-color-scheme: dark)", color: "#070813" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang="en"
      data-theme="civic-light"
      data-theme-mode="light"
      data-motion="safe"
      suppressHydrationWarning
    >
      <head>
        <script
          data-theme-initializer
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: themeModeInitializerScript }}
        />
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body
        className={`${manrope.variable} ${fraunces.variable} ${geistMono.variable}`}
      >
        <Providers>
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <SiteHeader />
          <script
            data-theme-controls-initializer
            nonce={nonce}
            dangerouslySetInnerHTML={{ __html: themeControlsInitializerScript }}
          />
          <main id="main-content">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
