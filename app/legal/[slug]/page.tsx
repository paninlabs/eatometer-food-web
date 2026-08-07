import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDocumentPageContent } from "@/components/legal-document-page";
import {
  buildLegalMetadata,
  isLegalDocumentSlug,
  legalDocumentOrder,
  type LegalDocumentSlug,
} from "@/lib/legal-content";

export function generateStaticParams() {
  return legalDocumentOrder.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  if (!isLegalDocumentSlug(slug)) {
    return {};
  }

  return buildLegalMetadata(slug);
}

export default async function LegalDocumentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!isLegalDocumentSlug(slug)) {
    notFound();
  }

  return <LegalDocumentPageContent slug={slug as LegalDocumentSlug} />;
}