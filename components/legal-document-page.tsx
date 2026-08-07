"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/use-language";
import { getLegalDocument, type LegalDocumentSlug } from "@/lib/legal-content";

type LegalDocumentPageProps = {
  slug: LegalDocumentSlug;
};

function backLabel(language: string) {
  return language === "ru" ? "Назад" : "Back";
}

export function LegalDocumentPageContent({ slug }: LegalDocumentPageProps) {
  const { language } = useLanguage();
  const document = getLegalDocument(slug);
  const documentCopy = document.locales[language === "ru" ? "ru" : "en"];

  return (
    <main className="legal-document-page">
      <div className="legal-document-wrap">
        <Link className="legal-back-link" href="/legal">
          <ArrowLeft size={18} strokeWidth={2.2} aria-hidden="true" />
          <span>{backLabel(language)}</span>
        </Link>

        <article className="legal-document-article panel">
          <header className="legal-document-header">
            <h1>{documentCopy.title}</h1>
          </header>

          <div className="legal-document-sections">
            {documentCopy.sections.map((section) => (
              <section className="legal-document-section" key={section.title}>
                <h2>{section.title}</h2>
                {(Array.isArray(section.content) ? section.content : [section.content]).map((paragraph, index) => (
                  <p key={`${section.title}-${index}`}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
}