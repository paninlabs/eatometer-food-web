import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";

export const metadata: Metadata = {
  title: {
    absolute: "Едометр",
  },
  description: "Едометр помогает считать калории, контролировать макронутриенты и формировать полезные привычки.",
  alternates: {
    canonical: "/",
  },
};

export default function Page() {
  return <HomePage />;
}
