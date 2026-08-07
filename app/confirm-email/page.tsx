import type { Metadata } from "next";
import OpenInAppCard from "@/components/open-in-app-card";
import { appConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Confirm email",
  description: "Open Eatometer to confirm your email address.",
  robots: {
    index: false,
    follow: false,
  },
};

type ConfirmEmailPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ConfirmEmailPage({ searchParams }: ConfirmEmailPageProps) {
  const token = firstParam((await searchParams).token)?.trim();
  const deepLink = token
    ? `eatometer://confirm-email?token=${encodeURIComponent(token)}`
    : "eatometer://confirm-email";

  return (
    <OpenInAppCard
      kicker="Email confirmation"
      title="Open Eatometer"
      description="Finish confirming your email address in the Eatometer app."
      deepLink={deepLink}
      fallbackUrl={appConfig.appStoreUrl}
    />
  );
}
