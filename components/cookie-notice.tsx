"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/use-language";
import { copy } from "@/lib/i18n";

const storageKey = "eatometer-cookie-ack";

export function CookieNotice() {
  const { language } = useLanguage();
  const [acknowledged, setAcknowledged] = useState(true);

  useEffect(() => {
    setAcknowledged(window.localStorage.getItem(storageKey) === "1");
  }, []);

  if (acknowledged) {
    return null;
  }

  const dismiss = () => {
    window.localStorage.setItem(storageKey, "1");
    setAcknowledged(true);
  };

  return (
    <div className="cookie-notice" role="region" aria-label="cookies">
      <div className="cookie-notice__mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className="cookie-notice__text">{copy[language].cookieNoticeText}</p>
      <button type="button" className="cookie-notice__button" onClick={dismiss}>
        {copy[language].cookieNoticeButton}
      </button>
    </div>
  );
}