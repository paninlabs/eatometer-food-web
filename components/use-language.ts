"use client";

import { useEffect, useState } from "react";
import { languageFromBrowser, type Language } from "@/lib/i18n";

export function useLanguage() {
  const [language, setLanguage] = useState<Language>("ru");

  useEffect(() => {
    const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
    const detectedLanguage = languageFromBrowser(browserLanguages);
    setLanguage(detectedLanguage);
    document.documentElement.lang = detectedLanguage;
  }, []);

  return language;
}
