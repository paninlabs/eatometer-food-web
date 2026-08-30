"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useLanguage } from "@/components/use-language";
import { appConfig } from "@/lib/config";
import { copy } from "@/lib/i18n";

export function SiteShell({ children }: { children: ReactNode }) {
  const language = useLanguage();
  const t = copy[language];

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="brand" href="/" aria-label={t.brandName}>
            <Image src="/icon.png" alt="" width={46} height={46} priority />
            <span>{t.brandName}</span>
          </Link>

          <a className="download-button" href={appConfig.appStoreUrl} target="_blank" rel="noreferrer">
            {t.download}
          </a>
        </div>
      </header>

      {children}

      <footer className="site-footer">
        <p>
          {t.trademarkNotice}{" "}
          <a href="https://www.apple.com/legal/intellectual-property/trademark/appletmlist.html" target="_blank" rel="noreferrer">
            {t.trademarkLink}
          </a>
        </p>
      </footer>
    </div>
  );
}
