import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { appConfig } from "@/lib/config";
import { SiteShell } from "@/components/site-chrome";
import "./globals.css";

// Base metadata is intentionally in English for search-engine crawlers and
// social/robots; the UI itself is still fully localized on the client.
const siteDescription =
  "Eatometer is a food diary and nutrition tracker: log meals, water, calories, macros, goals and habits, and save your recipes, products and meal plans — synced across your devices.";

export const metadata: Metadata = {
  title: {
    default: appConfig.appName,
    template: `%s | ${appConfig.appName}`,
  },
  description: siteDescription,
  metadataBase: new URL(appConfig.marketingUrl),
  other: {
    "p:domain_verify": "6be209f77e4fc6c01f75a3322f2fbe81",
  },
  alternates: {
    canonical: "/",
  },
  applicationName: appConfig.appName,
  appleWebApp: {
    capable: true,
    title: appConfig.appName,
  },
  category: "health",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    url: appConfig.marketingUrl,
    siteName: appConfig.appName,
    title: appConfig.appName,
    description: siteDescription,
    images: [
      {
        url: "/icon.png",
        width: 1024,
        height: 1024,
        alt: appConfig.appName,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: appConfig.appName,
    description: siteDescription,
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>

        {/* Pinterest Tag */}
        <Script id="pinterest-tag" strategy="afterInteractive">
          {`!function(e){if(!window.pintrk){window.pintrk = function () {
window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
pintrk('load', '2613639623113');
pintrk('page');`}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src="https://ct.pinterest.com/v3/?event=init&tid=2613639623113&noscript=1"
          />
        </noscript>
        {/* end Pinterest Tag */}
      </body>
    </html>
  );
}
