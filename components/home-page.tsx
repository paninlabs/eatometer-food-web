"use client";

import { useEffect, useRef } from "react";
import { AppStoreBadge } from "@/components/app-store-badge";
import { FeatureGraphic, type FeatureGraphicKind } from "@/components/feature-graphic";
import { useLanguage } from "@/components/use-language";
import { copy } from "@/lib/i18n";
import { pinterestTrack } from "@/lib/pinterest";

export function HomePage() {
  const { language } = useLanguage();
  const t = copy[language];
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Landing page view — fires once the Pinterest tag is available.
    pinterestTrack("pagevisit", { page: "home" });
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("revealed"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [language]);

  const features: Array<{ title: string; text: string; bezel?: string; graphic?: FeatureGraphicKind }> = [
    { title: t.mkt1Title, text: t.mkt1Text, bezel: "1" }, // Простота
    { title: t.mkt2Title, text: t.mkt2Text, graphic: "sync" }, // Синхронизация
    { title: t.mkt3Title, text: t.mkt3Text, graphic: "health" }, // Всё в одном месте
    { title: t.mkt4Title, text: t.mkt4Text, bezel: "3" }, // Прогресс (swapped with Друзья)
    { title: t.mkt5Title, text: t.mkt5Text, bezel: "share" }, // Совместное (swapped with Привычки)
    { title: t.mkt6Title, text: t.mkt6Text, bezel: "5" }, // Привычки (swapped with Совместное)
    { title: t.mkt7Title, text: t.mkt7Text, graphic: "recipes" }, // Рецепты
    { title: t.mkt8Title, text: t.mkt8Text, graphic: "rations" }, // Рационы
    { title: t.mkt9Title, text: t.mkt9Text, bezel: "4" }, // Друзья (swapped with Прогресс)
  ];

  const shot = (key: string) => `/bezels/${language}/${key}.png`;

  return (
    <main ref={rootRef}>
      <section className="hero-section" id="home" aria-labelledby="hero-title">
        <div className="hero-inner">
          <div className="hero-visual" data-reveal aria-hidden="true">
            <img className="hero-bezel" src="/hero-bezel.png" alt="" width={230} height={470} />
          </div>
          <div className="hero-content" data-reveal>
            <h1 id="hero-title">{t.homeHeroTitle}</h1>
            <p className="hero-intro">{t.mktIntro}</p>
            <div className="hero-actions">
              <AppStoreBadge language={language} label={t.appStore} />
              <img
                className="apple-health-official-badge"
                src="/apple-health-badge.svg"
                alt={t.appleHealthBadgeTitle}
                width={193}
                height={60}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="feature-rows" aria-labelledby="features-title">
        <div className="section-inner">
          <h2 id="features-title" className="feature-rows-heading">
            {t.mktFeaturesHeading}
          </h2>
          <div className="feature-rows-list">
            {features.map((feature, index) => (
              <article
                className={index % 2 === 1 ? "feature-row feature-row-reverse" : "feature-row"}
                key={feature.title}
                data-reveal
              >
                <div className="feature-row-media">
                  {feature.graphic ? (
                    <FeatureGraphic kind={feature.graphic} label={feature.title} />
                  ) : (
                    <img className="bezel-shot" src={shot(feature.bezel!)} alt={feature.title} loading="lazy" decoding="async" />
                  )}
                </div>
                <div className="feature-row-copy">
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
