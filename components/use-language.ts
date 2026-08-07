"use client";

import { useCallback, useEffect, useState } from "react";
import { isLanguage, languageChangeEvent, languageStorageKey, normalizeLanguage, type Language } from "@/lib/i18n";

function readInitialLanguage(): Language {
  if (typeof window === "undefined") {
    return "ru";
  }

  const storedLanguage = readStoredLanguage();
  if (isLanguage(storedLanguage)) {
    return storedLanguage;
  }

  const browserLanguages = window.navigator.languages?.length ? window.navigator.languages : [window.navigator.language];
  for (const browserLanguage of browserLanguages) {
    const language = normalizeLanguage(browserLanguage);
    if (language) {
      return language;
    }
  }

  return "ru";
}

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>("ru");

  useEffect(() => {
    setLanguageState(readInitialLanguage());
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    writeLanguageCookie(language);
  }, [language]);

  useEffect(() => {
    const handleLanguageChange = (event: Event) => {
      const nextLanguage = (event as CustomEvent<Language>).detail;
      if (isLanguage(nextLanguage)) {
        setLanguageState(nextLanguage);
        document.documentElement.lang = nextLanguage;
      }
    };

    window.addEventListener(languageChangeEvent, handleLanguageChange);
    return () => window.removeEventListener(languageChangeEvent, handleLanguageChange);
  }, []);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    writeStoredLanguage(nextLanguage);
    document.documentElement.lang = nextLanguage;
    window.dispatchEvent(new CustomEvent(languageChangeEvent, { detail: nextLanguage }));
  }, []);

  return { language, setLanguage };
}

function readStoredLanguage(): string | null {
  const storage = getBrowserStorage();
  if (storage) {
    try {
      const storedLanguage = storage.getItem(languageStorageKey);
      if (storedLanguage) {
        return storedLanguage;
      }
    } catch {
      return readLanguageCookie();
    }
  }

  return readLanguageCookie();
}

function writeStoredLanguage(language: Language) {
  const storage = getBrowserStorage();
  if (storage) {
    try {
      storage.setItem(languageStorageKey, language);
    } catch {
      // Keep the cookie write below as the server-facing source.
    }
  }

  writeLanguageCookie(language);
}

function getBrowserStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storage = window.localStorage;
  if (typeof storage?.getItem !== "function" || typeof storage.setItem !== "function") {
    return null;
  }

  return storage;
}

function readLanguageCookie(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${languageStorageKey}=`));

  return cookie ? decodeURIComponent(cookie.slice(languageStorageKey.length + 1)) : null;
}

function writeLanguageCookie(language: Language) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${languageStorageKey}=${encodeURIComponent(language)}; Max-Age=31536000; Path=/; SameSite=Lax`;
}