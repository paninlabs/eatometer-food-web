"use client";

import { useEffect, useMemo } from "react";
import LegalLinks from "@/components/legal-links";
import { useLanguage } from "@/components/use-language";
import { appConfig } from "@/lib/config";
import { copy } from "@/lib/i18n";

type OpenInAppCardProps = {
  kicker: string;
  title: string;
  description: string;
  deepLink: string;
  fallbackUrl: string;
  browserUrl?: string;
};

export default function OpenInAppCard({
  kicker,
  title,
  description,
  deepLink,
  fallbackUrl,
  browserUrl,
}: OpenInAppCardProps) {
  const { language } = useLanguage();
  const t = copy[language];
  const encodedDeepLink = useMemo(() => encodeURIComponent(deepLink), [deepLink]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.replace(deepLink);
    }, 120);

    return () => {
      window.clearTimeout(timer);
    };
  }, [deepLink]);

  return (
    <main className="redirect-shell">
      <section className="panel redirect-card">
        <div className="kicker">{kicker}</div>
        <h1>{title}</h1>
        <p className="redirect-meta">{description}</p>
        <p className="redirect-meta">{t.redirectFallback}</p>
        <div className="actions">
          <a className="button button-primary" href={deepLink}>
            {t.redirectOpenApp}
          </a>
          {browserUrl ? (
            <a className="button button-secondary" href={browserUrl}>
              {t.redirectOpenBrowser}
            </a>
          ) : null}
          <a className="button button-secondary" href={fallbackUrl}>
            App Store
          </a>
        </div>
        <p className="redirect-meta redirect-hint">
          {t.redirectDeepLink}: <span>{encodedDeepLink}</span>
        </p>
        <LegalLinks compact />
      </section>
    </main>
  );
}