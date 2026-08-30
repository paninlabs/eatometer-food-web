export const languages = ["ru", "en"] as const;

export type Language = (typeof languages)[number];

export const copy: Record<
  Language,
  {
    brandName: string;
    download: string;
    appStore: string;
    heroTitle: string;
    heroDescription: string;
    appleHealth: string;
    trademarkNotice: string;
    trademarkLink: string;
  }
> = {
  ru: {
    brandName: "Едометр",
    download: "Скачать",
    appStore: "Скачать Едометр в App Store",
    heroTitle: "Питайтесь осознанно. Достигайте большего.",
    heroDescription:
      "Едометр — ваш простой и удобный помощник для подсчёта калорий, контроля макронутриентов и формирования полезных привычек.",
    appleHealth: "Работает с Apple Health",
    trademarkNotice:
      "Apple, App Store, Apple Health и логотип Works with Apple Health являются товарными знаками Apple Inc., зарегистрированными в США и других странах и регионах, где применимо.",
    trademarkLink: "Список товарных знаков Apple.",
  },
  en: {
    brandName: "Eatometer",
    download: "Download",
    appStore: "Download Eatometer on the App Store",
    heroTitle: "Eat mindfully. Achieve more.",
    heroDescription:
      "Eatometer is your simple, convenient companion for tracking calories, managing macronutrients, and building healthier habits.",
    appleHealth: "Works with Apple Health",
    trademarkNotice:
      "Apple, App Store, Apple Health, and the Works with Apple Health logo are trademarks of Apple Inc., registered in the U.S. and other countries and regions where applicable.",
    trademarkLink: "Apple trademark list.",
  },
};

export function languageFromBrowser(browserLanguages: readonly string[]): Language {
  return browserLanguages.some((language) => language.toLowerCase().startsWith("ru")) ? "ru" : "en";
}
