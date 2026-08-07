import { appConfig } from "@/lib/config";
import { buildLegalDocumentPath, legalDocumentOrder } from "@/lib/legal-content";

export type SeoRoute = {
  path: string;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
};

export const seoRoutes: SeoRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/home", changeFrequency: "weekly", priority: 0.9 },
  { path: "/app", changeFrequency: "monthly", priority: 0.8 },
  { path: "/support", changeFrequency: "monthly", priority: 0.4 },
  { path: "/legal", changeFrequency: "monthly", priority: 0.3 },
  ...legalDocumentOrder.map((slug) => ({
    path: buildLegalDocumentPath(slug),
    changeFrequency: "yearly" as const,
    priority: 0.2,
  })),
];

export function absoluteUrl(path = "/"): string {
  return new URL(path, appConfig.marketingUrl).toString();
}
