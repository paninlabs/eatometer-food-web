import type { Metadata } from "next";
import type { Language } from "@/lib/i18n";

const defaultBundleId = "com.goeatometer.Eatometer";
const defaultAppleAppId = "XVGJW3U9VA.com.goeatometer.Eatometer";

export type FoodLinkKind = "recipe" | "meal" | "mealTemplate" | "product";

export const appConfig = {
  appName: "Eatometer",
  localizedAppName: "Едометр",
  domain: "goeatometer.com",
  scheme: "eatometer://",
  appStoreUrl: process.env.NEXT_PUBLIC_APP_STORE_URL?.trim() || "https://apps.apple.com/app/id6763617610",
  marketingUrl: "https://goeatometer.com",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "support@goeatometer.com",
  bundleId: process.env.NEXT_PUBLIC_BUNDLE_ID?.trim() || defaultBundleId,
  appleAppId:
    process.env.NEXT_PUBLIC_APPLE_APP_ID?.trim() ||
    (process.env.NEXT_PUBLIC_APPLE_TEAM_ID?.trim()
      ? `${process.env.NEXT_PUBLIC_APPLE_TEAM_ID?.trim()}.${process.env.NEXT_PUBLIC_BUNDLE_ID?.trim() || defaultBundleId}`
      : defaultAppleAppId),
};

export type LinkTarget = {
  kind: FoodLinkKind;
  code: string;
  canonicalUrl: string;
  deepLink: string;
  fallbackUrl: string;
  title: string;
  description: string;
};

type SearchParamValue = string | string[] | undefined;

export type FoodSharePreview = {
  kind?: FoodLinkKind;
  code?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  emoji?: string;
  category?: string;
  brand?: string;
  servings?: number;
  itemCount?: number;
  items?: string[];
  nutrition?: FoodNutritionPreview;
};

export type FoodNutritionPreview = {
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  fiber?: number;
  sugar?: number;
  sodiumMg?: number;
};

export function resolveFoodLink(code: string): LinkTarget | null {
  const normalizedCode = normalizeShareCode(code);
  if (!normalizedCode) {
    return null;
  }

  const staticTargets: Record<string, LinkTarget> = {
    "200": createFoodTarget("recipe", "rshare-demo"),
  };

  if (staticTargets[normalizedCode]) {
    return staticTargets[normalizedCode];
  }

  const inferredKind = inferFoodKindFromCode(normalizedCode);
  if (!inferredKind) {
    return null;
  }

  return createFoodTarget(inferredKind, normalizedCode);
}

function routeSegment(kind: FoodLinkKind): string {
  if (kind === "mealTemplate") return "meal-template";
  return kind;
}

export function buildFoodDeepLink(kind: FoodLinkKind, code: string): string {
  return `${appConfig.scheme}${routeSegment(kind)}/${encodeURIComponent(code.trim())}`;
}

export function buildFoodCanonicalUrl(_kind: FoodLinkKind, code: string): string {
  return `${appConfig.marketingUrl}/r/${encodeURIComponent(code.trim())}`;
}

const kindLabels: Record<FoodLinkKind, { title: string; description: string }> = {
  recipe: {
    title: "Открыть рецепт",
    description: "Посмотреть рецепт на странице шаринга или добавить его в iOS-приложении.",
  },
  meal: {
    title: "Открыть прием пищи",
    description: "Посмотреть состав приема пищи или добавить его в iOS-приложении.",
  },
  mealTemplate: {
    title: "Открыть рацион",
    description: "Посмотреть рацион или добавить его в iOS-приложении.",
  },
  product: {
    title: "Открыть продукт",
    description: "Посмотреть продукт и КБЖУ или добавить его в iOS-приложении.",
  },
};

export function createFoodTarget(kind: FoodLinkKind, code: string): LinkTarget {
  const normalizedCode = normalizeShareCode(code) || code.trim();
  const labels = kindLabels[kind];
  return {
    kind,
    code: normalizedCode,
    canonicalUrl: buildFoodCanonicalUrl(kind, normalizedCode),
    deepLink: buildFoodDeepLink(kind, normalizedCode),
    fallbackUrl: appConfig.appStoreUrl,
    title: labels.title,
    description: labels.description,
  };
}

const metaLabels: Record<FoodLinkKind, { noun: string; ogDescription: string }> = {
  recipe: {
    noun: "recipe",
    ogDescription: `Someone shared a recipe with you in ${appConfig.appName}. Open the link to preview it on the web or import it in the app.`,
  },
  meal: {
    noun: "meal",
    ogDescription: `Someone shared a meal with you in ${appConfig.appName}. Open the link to preview it on the web or import it in the app.`,
  },
  mealTemplate: {
    noun: "ration",
    ogDescription: `Someone shared a ration with you in ${appConfig.appName}. Open the link to preview it on the web or import it in the app.`,
  },
  product: {
    noun: "product",
    ogDescription: `Someone shared a product with you in ${appConfig.appName}. Open the link to preview it on the web or import it in the app.`,
  },
};

export function resolveFoodSharePreview(searchParams?: Record<string, SearchParamValue>): FoodSharePreview | null {
  const title = firstSearchParamValue(searchParams?.title);
  const subtitle = firstSearchParamValue(searchParams?.subtitle) || firstSearchParamValue(searchParams?.summary);
  const description = firstSearchParamValue(searchParams?.description);

  if (!title && !subtitle && !description) {
    return null;
  }

  return { title, subtitle, description };
}

export function buildFoodShareMetadata(target: LinkTarget, preview?: FoodSharePreview | null, language?: Language): Metadata {
  const labels = metaLabels[target.kind];
  const title = preview?.title || `Shared ${labels.noun} from ${appConfig.appName}`;
  const description = preview?.description || preview?.subtitle || labels.ogDescription;

  // OG cards are intentionally disabled: shared food links must unfurl as a
  // plain link plus descriptive text, with no generated preview image. We still
  // declare imageless openGraph/twitter blocks so they override the root layout
  // defaults (which would otherwise re-add the app icon as a card image).
  return {
    title,
    description,
    alternates: {
      canonical: target.canonicalUrl,
    },
    openGraph: {
      type: "website",
      url: target.canonicalUrl,
      title,
      description,
      siteName: appConfig.appName,
      images: [],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [],
    },
  };
}

function firstSearchParamValue(value: SearchParamValue): string | undefined {
  const candidate = Array.isArray(value) ? value[0] : value;
  const trimmed = candidate?.trim();
  return trimmed ? trimmed : undefined;
}

function inferFoodKindFromCode(code: string): FoodLinkKind | null {
  const normalizedCode = normalizeShareCode(code);
  if (!normalizedCode) {
    return null;
  }
  if (normalizedCode.toLowerCase().startsWith("rshare")) {
    return "recipe";
  }
  if (normalizedCode.toLowerCase().startsWith("mtshare")) {
    return "mealTemplate";
  }
  if (normalizedCode.toLowerCase().startsWith("mshare")) {
    return "meal";
  }
  if (normalizedCode.toLowerCase().startsWith("pshare")) {
    return "product";
  }
  return null;
}

function normalizeShareCode(value: string): string {
  return value.trim();
}
