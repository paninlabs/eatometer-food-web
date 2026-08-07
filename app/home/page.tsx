import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";

export const metadata: Metadata = {
  title: {
    absolute: "Едометр",
  },
  description: "Едометр помогает вести дневник питания, воды, рецептов и продуктов в одном приложении.",
  alternates: {
    canonical: "/",
  },
};

export default function Page() {
  return <HomePage />;
}
