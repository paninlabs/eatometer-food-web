import type { Metadata } from "next";
import { LegalIndexPageContent } from "@/components/legal-index-page";
import { appConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Юридическая информация",
  description: `Пользовательское соглашение и политика конфиденциальности ${appConfig.localizedAppName}.`,
  alternates: {
    canonical: "/legal",
  },
};

export default function LegalIndexPage() {
  return <LegalIndexPageContent />;
}
