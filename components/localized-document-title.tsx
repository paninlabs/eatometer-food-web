"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/use-language";
import { copy } from "@/lib/i18n";
import { getLegalDocument, isLegalDocumentSlug } from "@/lib/legal-content";

function formatTitle(pageTitle: string, appName: string) {
  return pageTitle === appName ? appName : `${pageTitle} | ${appName}`;
}

export function LocalizedDocumentTitle() {
  const pathname = usePathname() ?? "/";
  const { language } = useLanguage();
  const t = copy[language];

  useEffect(() => {
    const path = pathname.replace(/\/$/, "") || "/";
    let pageTitle: string | undefined;

    if (path === "/") {
      pageTitle = t.brandName;
    } else if (path === "/app") {
      pageTitle = t.appPageTitle;
    } else if (path === "/support") {
      pageTitle = t.supportPageTitle;
    } else if (path === "/legal") {
      pageTitle = t.legalInfoTitle;
    } else if (path.startsWith("/legal/")) {
      const slug = path.slice("/legal/".length);
      if (isLegalDocumentSlug(slug)) {
        const legalDocument = getLegalDocument(slug);
        pageTitle = legalDocument.locales[language === "ru" ? "ru" : "en"].title;
      }
    }

    if (pageTitle) {
      document.title = formatTitle(pageTitle, t.brandName);
    }
  }, [language, pathname, t]);

  return null;
}