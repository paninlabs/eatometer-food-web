import { appConfig } from "@/lib/config";
import type { Language } from "@/lib/i18n";

export function AppStoreBadge({ language, label }: { language: Language; label: string }) {
  return (
    <a className="app-store-badge" href={appConfig.appStoreUrl} target="_blank" rel="noreferrer" aria-label={label}>
      <img src={`/app-store-badges/${language}.svg`} alt={label} width={209} height={70} />
    </a>
  );
}
