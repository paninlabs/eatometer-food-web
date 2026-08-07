import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FoodSharePage } from "@/components/food-share-page";
import { appConfig, buildFoodShareMetadata, resolveFoodLink } from "@/lib/config";
import { resolveFoodSharePreviewForRoute } from "@/lib/food-share-preview";
import { normalizeLanguage } from "@/lib/i18n";

type FoodSharePageProps = {
  params: Promise<{ code: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params, searchParams }: FoodSharePageProps): Promise<Metadata> {
  const { code } = await params;
  const query = await searchParams;
  const target = resolveFoodLink(code);

  if (!target) {
    return {
      title: `Shared content from ${appConfig.appName}`,
      description: `Open a shared recipe or meal from ${appConfig.appName}.`,
    };
  }

  const preview = await resolveFoodSharePreviewForRoute(target.kind, code, query);
  const language = normalizeLanguage(firstSearchParamValue(query?.lang) || firstSearchParamValue(query?.locale));
  return buildFoodShareMetadata(target, preview, language || undefined);
}

export default async function RedirectPage({ params, searchParams }: FoodSharePageProps) {
  const { code } = await params;
  const query = await searchParams;
  const target = resolveFoodLink(code);

  if (!target) {
    notFound();
  }

  const preview = await resolveFoodSharePreviewForRoute(target.kind, code, query);

  return <FoodSharePage target={target} preview={preview} />;
}

function firstSearchParamValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
