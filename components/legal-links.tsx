"use client";

import Link from "next/link";
import { useLanguage } from "@/components/use-language";
import { appConfig } from "@/lib/config";
import {
  buildLegalDocumentPath,
  buildLegalDocumentUrl,
  legalDocumentLabels,
  legalDocumentOrder,
} from "@/lib/legal-content";
import { copy } from "@/lib/i18n";

type LegalLinksProps = {
  title?: string;
  description?: string;
  compact?: boolean;
};

export default function LegalLinks({
  title,
  description,
  compact = false,
}: LegalLinksProps) {
  const { language } = useLanguage();
  const t = copy[language];
  const legalLocale = language === "ru" ? "ru" : "en";

  return (
    <section className={`legal-links${compact ? " legal-links-compact" : ""}`}>
      <div className="legal-links-copy">
        <div className="kicker">Legal</div>
        <h2>{title ?? t.legalLinksTitle}</h2>
        <p className="lead">{description ?? t.legalLinksDescription}</p>
      </div>

      <div className="legal-link-list">
        {legalDocumentOrder.map((slug) => (
          <div className="legal-link-item" key={slug}>
            <Link className="legal-link-title" href={buildLegalDocumentPath(slug)}>
              {legalDocumentLabels[slug][legalLocale]}
            </Link>
            {compact ? null : <span className="legal-link-url">{buildLegalDocumentUrl(slug)}</span>}
          </div>
        ))}
      </div>

      {compact ? null : (
        <p className="legal-links-contact">
          {t.legalLinksContactPrefix} <a href={`mailto:${appConfig.supportEmail}`}>{appConfig.supportEmail}</a>
        </p>
      )}
    </section>
  );
}