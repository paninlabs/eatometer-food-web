"use client";

import { AppStoreBadge } from "@/components/app-store-badge";
import { useLanguage } from "@/components/use-language";
import { copy } from "@/lib/i18n";

export function HomePage() {
  const language = useLanguage();
  const t = copy[language];

  return (
    <main className="landing-main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">{t.heroTitle}</h1>
          <p>{t.heroDescription}</p>

          <div className="hero-badges">
            <AppStoreBadge language={language} label={t.appStore} />
            <img
              className="apple-health-badge"
              src="/apple-health-badge.svg"
              alt={t.appleHealth}
              width={253}
              height={70}
            />
          </div>
        </div>

        <div className="hero-preview" aria-hidden="true">
          <img src="/app-preview.gif" alt="" width={450} height={920} />
        </div>
      </section>
    </main>
  );
}
