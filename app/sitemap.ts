import type { MetadataRoute } from "next";
import { appConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: appConfig.marketingUrl, changeFrequency: "weekly", priority: 1 }];
}
