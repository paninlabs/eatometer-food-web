import type { Metadata, Viewport } from "next";
import { SiteShell } from "@/components/site-chrome";
import { appConfig } from "@/lib/config";
import "./globals.css";

const description =
  "Eatometer is a simple food diary for tracking calories, macronutrients, water, and healthy habits.";

export const metadata: Metadata = {
  title: appConfig.appName,
  description,
  metadataBase: new URL(appConfig.marketingUrl),
  applicationName: appConfig.appName,
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    url: appConfig.marketingUrl,
    siteName: appConfig.appName,
    title: appConfig.appName,
    description,
    images: ["/icon.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
