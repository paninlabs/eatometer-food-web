import type { Metadata } from "next";
import { FoodSharePage } from "@/components/food-share-page";
import { buildFoodShareMetadata, createFoodTarget } from "@/lib/config";
import { resolveFoodSharePreviewForRoute } from "@/lib/food-share-preview";

type FoodSharePageProps = {
  params: Promise<{ code: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params, searchParams }: FoodSharePageProps): Promise<Metadata> {
  const { code } = await params;
  const preview = await resolveFoodSharePreviewForRoute("mealTemplate", code, await searchParams);
  return buildFoodShareMetadata(createFoodTarget("mealTemplate", code), preview);
}

export default async function RationPage({ params, searchParams }: FoodSharePageProps) {
  const { code } = await params;
  const target = createFoodTarget("mealTemplate", code);
  const preview = await resolveFoodSharePreviewForRoute("mealTemplate", code, await searchParams);

  return <FoodSharePage target={target} preview={preview} />;
}