"use client";

import { useEffect } from "react";
import { useLanguage } from "@/components/use-language";
import { type FoodLinkKind, type FoodSharePreview, type LinkTarget } from "@/lib/config";
import { copy } from "@/lib/i18n";
import { Utensils } from "lucide-react";

type FoodSharePageProps = {
  target: LinkTarget;
  preview: FoodSharePreview | null;
};

type LocalizedKindCopy = {
  eyebrow: string;
  fallbackTitle: string;
  fallbackDescription: string;
  itemLabel: string;
  portionLabel: string;
};

const kindCopy: Record<"ru" | "en", Record<FoodLinkKind, LocalizedKindCopy>> = {
  ru: {
    recipe: {
      eyebrow: "Рецепт",
      fallbackTitle: "Рецепт",
      fallbackDescription: "Откройте рецепт, посмотрите КБЖУ и добавьте его в свою библиотеку.",
      itemLabel: "ингредиентов",
      portionLabel: "порций",
    },
    product: {
      eyebrow: "Продукт",
      fallbackTitle: "Продукт",
      fallbackDescription: "Посмотрите продукт, пищевую ценность и сохраните его в приложении.",
      itemLabel: "позиции",
      portionLabel: "порций",
    },
    meal: {
      eyebrow: "Прием пищи",
      fallbackTitle: "Прием пищи",
      fallbackDescription: "Посмотрите состав приема пищи и добавьте его в дневник.",
      itemLabel: "позиций",
      portionLabel: "порций",
    },
    mealTemplate: {
      eyebrow: "Рацион",
      fallbackTitle: "Рацион",
      fallbackDescription: "Посмотрите готовый рацион и добавьте его в приложение.",
      itemLabel: "позиций",
      portionLabel: "порций",
    },
  },
  en: {
    recipe: {
      eyebrow: "Recipe",
      fallbackTitle: "Recipe",
      fallbackDescription: "Preview the recipe, nutrition, and save it to your library.",
      itemLabel: "ingredients",
      portionLabel: "servings",
    },
    product: {
      eyebrow: "Product",
      fallbackTitle: "Product",
      fallbackDescription: "Preview the product, nutrition, and save it in the app.",
      itemLabel: "items",
      portionLabel: "servings",
    },
    meal: {
      eyebrow: "Meal",
      fallbackTitle: "Meal",
      fallbackDescription: "Preview the meal contents and add it to your diary.",
      itemLabel: "items",
      portionLabel: "servings",
    },
    mealTemplate: {
      eyebrow: "Ration",
      fallbackTitle: "Ration",
      fallbackDescription: "Preview the ready-made ration and add it to the app.",
      itemLabel: "items",
      portionLabel: "servings",
    },
  },
};

export function FoodSharePage({ target, preview }: FoodSharePageProps) {
  const { language } = useLanguage();
  const t = copy[language];
  const localized = language === "ru" ? kindCopy.ru[target.kind] : kindCopy.en[target.kind];
  const title = preview?.title || target.title || localized.fallbackTitle;
  const rawSubtitle = target.kind === "recipe" ? "" : preview?.subtitle || preview?.category || preview?.brand || localized.eyebrow;
  const subtitle = rawSubtitle.trim().toLocaleLowerCase() === localized.eyebrow.toLocaleLowerCase() ? "" : rawSubtitle;
  const description = preview?.description || target.description || localized.fallbackDescription;
  const items = preview?.items || [];
  const itemCount = preview?.itemCount || items.length;
  const metaEntries = [
    preview?.servings ? `${formatNumber(preview.servings)} ${localized.portionLabel}` : null,
    itemCount ? `${formatNumber(itemCount)} ${localized.itemLabel}` : null,
  ].filter((entry): entry is string => Boolean(entry));
  const hasMeta = metaEntries.length > 0;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.replace(target.deepLink);
    }, 220);

    return () => window.clearTimeout(timer);
  }, [target.deepLink]);

  return (
    <main className="food-share-shell">
      <section className="food-share-hero" aria-labelledby="food-share-title">
        <article className="food-preview-card">
          <div className="food-preview-cover">
            <div className="food-preview-token" aria-hidden="true">
              {preview?.emoji || <Utensils size={34} strokeWidth={2.1} />}
            </div>
          </div>

          <div className="food-preview-body">
            {subtitle ? <p className="food-share-subtitle">{subtitle}</p> : null}
            <h1 id="food-share-title">{title}</h1>
            <p className="food-share-description">{description}</p>

            {hasMeta ? (
              <div className="food-share-preview-meta" aria-label="Share details">
                {metaEntries.map((entry) => <span key={entry}>{entry}</span>)}
              </div>
            ) : null}

            <NutritionTable preview={preview} language={language} />

            <div className="actions food-preview-actions">
              <a className="button button-primary" href={target.deepLink}>
                {t.redirectOpenApp}
              </a>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}

function NutritionTable({ preview, language }: { preview: FoodSharePreview | null; language: string }) {
  const nutrition = preview?.nutrition;
  const labels = language === "ru"
    ? { title: "Пищевая ценность", calories: "Калории", protein: "Белки", fat: "Жиры", carbs: "Углеводы" }
    : { title: "Nutrition Facts", calories: "Calories", protein: "Protein", fat: "Fat", carbs: "Carbs" };
  const metrics = [
    { label: labels.calories, value: nutrition?.calories, formatter: formatCalories },
    { label: labels.protein, value: nutrition?.protein, formatter: formatGrams },
    { label: labels.fat, value: nutrition?.fat, formatter: formatGrams },
    { label: labels.carbs, value: nutrition?.carbs, formatter: formatGrams },
  ];

  return (
    <div className="food-share-nutrition" aria-label={labels.title}>
      <div className="food-share-nutrition-title">
        <span>{labels.title}</span>
      </div>
      <div className="food-share-nutrition-table">
        {metrics.map((metric) => (
          <div className="food-share-nutrition-row" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value === undefined ? "-" : metric.formatter(metric.value)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatCalories(value: number): string {
  return Math.round(value).toLocaleString("ru-RU");
}

function formatGrams(value: number): string {
  return formatNumber(value);
}

function formatNumber(value: number): string {
  const rounded = Math.abs(value) >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
  return rounded.toLocaleString("ru-RU", { maximumFractionDigits: 1 });
}