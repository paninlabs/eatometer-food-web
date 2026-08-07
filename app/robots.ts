import type { MetadataRoute } from "next";
import { appConfig } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/confirm-email"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: appConfig.marketingUrl,
  };
}
