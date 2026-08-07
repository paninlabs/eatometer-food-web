"use client";

import Link from "next/link";
import { type ChangeEvent, type ReactNode } from "react";
import { CookieNotice } from "@/components/cookie-notice";
import { EatometerBrand } from "@/components/eatometer-brand";
import { LocalizedDocumentTitle } from "@/components/localized-document-title";
import { useLanguage } from "@/components/use-language";
import { copy, languageLabels, languages, type Language } from "@/lib/i18n";
import { AtSign, Globe2, Send } from "lucide-react";

type SiteSection = "home" | "support";

type SiteChromeProps = {
  activeSection: SiteSection;
  children: ReactNode;
};

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <LocalizedDocumentTitle />
      <div className="site-shell">
        <SiteHeader />
        <div className="site-content">{children}</div>
        <SiteFooter />
      </div>
      <CookieNotice />
    </>
  );
}

function SiteHeader() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="brand-mark" href="/" aria-label={t.brandName}>
          <EatometerBrand name={t.brandName} />
        </Link>
      </div>
    </header>
  );
}

function SiteFooter() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-top">
          <Link className="footer-brand" href="/" aria-label={t.brandName}>
            <EatometerBrand name={t.brandName} />
          </Link>

          <div className="footer-columns">
            <div className="footer-col">
              <span className="footer-col-title">{t.brandName}</span>
              <Link href="/">{t.navHome}</Link>
              <Link href="/support">{t.navSupport}</Link>
            </div>
            <div className="footer-col">
              <span className="footer-col-title">{t.footerLegal}</span>
              <Link href="/legal">{t.footerLegal}</Link>
            </div>
            <div className="footer-col">
              <span className="footer-col-title">{t.mktContactLabel}</span>
              <a href="mailto:support@goeatometer.com">support@goeatometer.com</a>
              <a href="https://instagram.com/goeatometer" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://t.me/goeatometer" target="_blank" rel="noreferrer">Telegram</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p className="footer-brandline">Eatometer</p>
            <p className="footer-copyright">© 2026 Eatometer</p>
            <p className="footer-trademark">
              {t.footerTrademarkNotice}{" "}
              <a href="https://www.apple.com/legal/intellectual-property/trademark/appletmlist.html" target="_blank" rel="noreferrer">
                {t.footerTrademarkLink}
              </a>
            </p>
          </div>

          <div className="footer-bottom-right">
            <div className="footer-social" aria-label="Social">
              <a href="https://instagram.com/goeatometer" target="_blank" rel="noreferrer" aria-label="Instagram">
                <AtSign size={19} strokeWidth={2} aria-hidden="true" />
              </a>
              <a href="https://t.me/goeatometer" target="_blank" rel="noreferrer" aria-label="Telegram">
                <Send size={19} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
            <LanguageSelect />
          </div>
        </div>
      </div>
    </footer>
  );
}

function LanguageSelect() {
  const { language, setLanguage } = useLanguage();
  const t = copy[language];

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value;
    if (languages.some((item) => item === next)) {
      setLanguage(next as Language);
    }
  };

  return (
    <label className="language-select">
      <Globe2 className="language-select-icon" size={17} strokeWidth={2} aria-hidden="true" />
      <select value={language} onChange={handleChange} aria-label={t.languageLabel}>
        {languages.map((item) => (
          <option value={item} key={item}>
            {languageLabels[item]}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SiteChrome({ activeSection, children }: SiteChromeProps) {
  void activeSection;
  return <>{children}</>;
}

export function FooterTextLinks() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <div className="footer-text-links">
      <Link href="/legal">{t.footerLegal}</Link>
    </div>
  );
}

