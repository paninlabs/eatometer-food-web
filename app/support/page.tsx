import type { Metadata } from "next";
import { SupportPage } from "@/components/support-page";

export const metadata: Metadata = {
  title: "Поддержка",
  description: "Связаться с поддержкой Едометра и отправить запрос через форму.",
  alternates: {
    canonical: "/support",
  },
};

export default function Page() {
  return <SupportPage />;
}
