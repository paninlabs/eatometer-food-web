import {
  resolveFoodSharePreview,
  type FoodLinkKind,
  type FoodNutritionPreview,
  type FoodSharePreview,
} from "@/lib/config";

type SearchParamValue = string | string[] | undefined;

type FoodSharePreviewApiResponse = {
  kind?: string;
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

const foodShareApiUrl = process.env.FOOD_SHARE_API_URL?.trim() || "";

export async function resolveFoodSharePreviewForRoute(
  kind: FoodLinkKind,
  code: string,
  searchParams?: Record<string, SearchParamValue>,
): Promise<FoodSharePreview | null> {
  const queryPreview = resolveFoodSharePreview(searchParams);
  const apiPreview = await fetchFoodSharePreview(kind, code);

  if (!apiPreview) {
    return queryPreview;
  }
  if (!queryPreview) {
    return apiPreview;
  }

  return mergeFoodSharePreviews(apiPreview, queryPreview);
}

async function fetchFoodSharePreview(kind: FoodLinkKind, code: string): Promise<FoodSharePreview | null> {
  if (!foodShareApiUrl || !code.trim()) {
    return null;
  }

  try {
    const endpoint = new URL(
      `${foodShareApiUrl.replace(/\/+$/, "")}/${foodShareApiSegment(kind)}/${encodeURIComponent(code.trim())}`,
    );
    const response = await fetch(endpoint, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) {
      console.warn(`Food share preview request failed: ${response.status} ${endpoint.toString()}`);
      return null;
    }

    return normalizeApiPreview((await response.json()) as FoodSharePreviewApiResponse);
  } catch (error) {
    console.warn("Food share preview request failed", error);
    return null;
  }
}

function foodShareApiSegment(kind: FoodLinkKind): string {
  return kind === "mealTemplate" ? "meal-template" : kind;
}

function mergeFoodSharePreviews(apiPreview: FoodSharePreview, queryPreview: FoodSharePreview): FoodSharePreview {
  return {
    kind: apiPreview.kind || queryPreview.kind,
    code: apiPreview.code || queryPreview.code,
    title: apiPreview.title || queryPreview.title,
    subtitle: apiPreview.subtitle || queryPreview.subtitle,
    description: apiPreview.description || queryPreview.description,
    emoji: apiPreview.emoji || queryPreview.emoji,
    category: apiPreview.category || queryPreview.category,
    brand: apiPreview.brand || queryPreview.brand,
    servings: apiPreview.servings || queryPreview.servings,
    itemCount: apiPreview.itemCount || queryPreview.itemCount,
    items: apiPreview.items?.length ? apiPreview.items : queryPreview.items,
    nutrition: apiPreview.nutrition || queryPreview.nutrition,
  };
}

function normalizeApiPreview(preview: FoodSharePreviewApiResponse): FoodSharePreview | null {
  const normalized: FoodSharePreview = {
    kind: normalizeKind(preview.kind),
    code: normalizeText(preview.code),
    title: normalizeText(preview.title),
    subtitle: normalizeText(preview.subtitle),
    description: excerptShareText(preview.description),
    emoji: normalizeText(preview.emoji),
    category: normalizeText(preview.category),
    brand: normalizeText(preview.brand),
    servings: normalizePositiveNumber(preview.servings),
    itemCount: normalizePositiveNumber(preview.itemCount),
    items: normalizeItems(preview.items),
    nutrition: normalizeNutrition(preview.nutrition),
  };

  if (!normalized.title && !normalized.subtitle && !normalized.description && !normalized.nutrition && !normalized.items?.length) {
    return null;
  }

  return normalized;
}

function normalizeKind(value?: string): FoodLinkKind | undefined {
  const normalized = normalizeText(value);
  if (normalized === "recipe" || normalized === "product" || normalized === "meal" || normalized === "mealTemplate") {
    return normalized;
  }
  return undefined;
}

function normalizeItems(items?: string[]): string[] | undefined {
  if (!Array.isArray(items)) {
    return undefined;
  }
  const normalized = items.map(normalizeText).filter(Boolean).slice(0, 8) as string[];
  return normalized.length ? normalized : undefined;
}

function normalizeNutrition(nutrition?: FoodNutritionPreview): FoodNutritionPreview | undefined {
  if (!nutrition) {
    return undefined;
  }
  const normalized: FoodNutritionPreview = {
    calories: normalizeNumber(nutrition.calories),
    protein: normalizeNumber(nutrition.protein),
    fat: normalizeNumber(nutrition.fat),
    carbs: normalizeNumber(nutrition.carbs),
    fiber: normalizeNumber(nutrition.fiber),
    sugar: normalizeNumber(nutrition.sugar),
    sodiumMg: normalizeNumber(nutrition.sodiumMg),
  };
  return Object.values(normalized).some((value) => typeof value === "number" && value > 0) ? normalized : undefined;
}

function normalizeText(value?: string): string | undefined {
  const trimmed = value?.replace(/\s+/g, " ").trim();
  if (!trimmed) {
    return undefined;
  }
  return localizedKnownKey(trimmed) || (looksLikeTechnicalKey(trimmed) ? undefined : trimmed);
}

function localizedKnownKey(value: string): string | undefined {
  return knownTextKeys[value.trim().toLowerCase()];
}

function looksLikeTechnicalKey(value: string): boolean {
  return /^(eatometer\.|meal\.|recipe\.category\.)/i.test(value);
}

const knownTextKeys: Record<string, string> = {
  breakfast: "Завтрак",
  lunch: "Обед",
  dinner: "Ужин",
  snack: "Перекус",
  "meal.breakfast": "Завтрак",
  "meal.lunch": "Обед",
  "meal.dinner": "Ужин",
  "meal.snack": "Перекус",
  "eatometer.mealcategory.breakfast": "Завтрак",
  "eatometer.mealcategory.lunch": "Обед",
  "eatometer.mealcategory.dinner": "Ужин",
  "eatometer.mealcategory.snack": "Перекус",
  "recipe.category.breakfast": "Завтрак",
  "recipe.category.lunch": "Обед",
  "recipe.category.dinner": "Ужин",
  "recipe.category.snack": "Перекус",
  "recipe.category.soup": "Супы",
  "recipe.category.hot": "Горячее",
  "recipe.category.stew": "Рагу",
  "recipe.category.porridge": "Каши",
  "recipe.category.meat": "Мясо",
  "recipe.category.fish": "Рыба",
  "recipe.category.pasta": "Паста",
  "recipe.category.pizza": "Пицца",
  "recipe.category.salad": "Салаты",
  "recipe.category.appetizer": "Закуски",
  "recipe.category.side": "Гарниры",
  "recipe.category.sauce": "Соусы",
  "recipe.category.baking": "Выпечка",
  "recipe.category.dessert": "Десерты",
  "recipe.category.drink": "Напитки",
  "recipe.category.other": "Другое",
};

function normalizeNumber(value?: number): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return undefined;
  }
  return value;
}

function normalizePositiveNumber(value?: number): number | undefined {
  const normalized = normalizeNumber(value);
  return normalized && normalized > 0 ? normalized : undefined;
}

function excerptShareText(value?: string, limit = 240): string | undefined {
  const normalized = normalizeText(value);
  if (!normalized) {
    return undefined;
  }
  if (normalized.length <= limit) {
    return normalized;
  }
  return `${normalized.slice(0, limit - 3).trimEnd()}...`;
}
