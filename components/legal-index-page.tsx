"use client";

import Link from "next/link";
import { useLanguage } from "@/components/use-language";
import { buildLegalDocumentPath, getLegalDocument, legalDocumentOrder } from "@/lib/legal-content";
import { copy } from "@/lib/i18n";

export function LegalIndexPageContent() {
  const { language } = useLanguage();
  const t = copy[language];
  const legalLocale = language === "ru" ? "ru" : "en";

  return (
    <main className="legal-hub-page">
      <section className="legal-hub">
        <header className="legal-hub-header">
          <h1>{t.legalInfoTitle}</h1>
        </header>

        <div className="legal-card-list">
          {legalDocumentOrder.map((slug) => {
            const document = getLegalDocument(slug);
            const documentCopy = document.locales[legalLocale];

            return (
              <Link className="legal-card legal-card-link" href={buildLegalDocumentPath(slug)} key={slug}>
                <h2>{documentCopy.title}</h2>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}