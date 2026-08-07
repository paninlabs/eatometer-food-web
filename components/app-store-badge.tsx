"use client";

import { appConfig } from "@/lib/config";
import type { Language } from "@/lib/i18n";
import { pinterestTrack } from "@/lib/pinterest";

const badgeByLanguage: Record<Language, string> = {
  ru: "/app-store-badges/ru.svg",
  en: "/app-store-badges/en.svg",
  cs: "/app-store-badges/cs.svg",
  de: "/app-store-badges/de.svg",
  es: "/app-store-badges/es.svg",
  fr: "/app-store-badges/fr.svg",
  it: "/app-store-badges/it.svg",
  ja: "/app-store-badges/ja.svg",
  ko: "/app-store-badges/ko.svg",
  nl: "/app-store-badges/nl.svg",
  pl: "/app-store-badges/pl.svg",
  pt: "/app-store-badges/pt.svg",
  sl: "/app-store-badges/sl.svg",
  tr: "/app-store-badges/tr.svg",
  "zh-Hans": "/app-store-badges/zh-Hant.svg",
  "zh-Hant": "/app-store-badges/zh-Hant.svg",
};

export function AppStoreBadge({ className = "", label, language }: { className?: string; label: string; language: Language }) {
  return (
    <a
      className={`app-store-badge ${className}`.trim()}
      href={appConfig.appStoreUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      onClick={() => pinterestTrack("lead", { lead_type: "app_store_click" })}
    >
      <img src={badgeByLanguage[language]} alt={label} width={162} height={48} />
    </a>
  );
}