"use client";

import { SupportForm } from "@/components/support-form";
import { useLanguage } from "@/components/use-language";
import { appConfig } from "@/lib/config";
import { copy } from "@/lib/i18n";
import { Mail, MessageSquare, TimerReset } from "lucide-react";

export function SupportPage() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <main>
      <section className="subhero section-inner support-page-grid">
        <div className="subhero-copy">
          <p className="eyebrow">{t.supportEyebrow}</p>
          <h1>{t.supportPageTitle}</h1>
          <p>{t.supportPageLead}</p>
          <div className="support-methods">
            <a href={`mailto:${appConfig.supportEmail}`}>
              <Mail size={20} aria-hidden="true" />
              <span>{appConfig.supportEmail}</span>
            </a>
            <span>
              <TimerReset size={20} aria-hidden="true" />
              <span>{t.supportResponse}</span>
            </span>
            <span>
              <MessageSquare size={20} aria-hidden="true" />
              <span>{t.supportScope}</span>
            </span>
          </div>
        </div>
        <SupportForm />
      </section>
    </main>
  );
}