import Image from "next/image";
import { appConfig } from "@/lib/config";

type EatometerBrandProps = {
  size?: "default" | "hero";
  showDomain?: boolean;
  name?: string;
};

export function EatometerBrand({ size = "default", showDomain = false, name = appConfig.appName }: EatometerBrandProps) {
  const imageSize = size === "hero" ? 112 : 52;

  return (
    <span className={`eatometer-brand eatometer-brand-${size}`}>
      <span className="eatometer-brand-icon-shell" aria-hidden="true">
        <Image
          src="/header-logo.png"
          alt=""
          width={imageSize}
          height={imageSize}
          className="eatometer-brand-icon"
          priority={size === "hero"}
          unoptimized
        />
      </span>

      <span className="eatometer-brand-text">
        <span className="eatometer-brand-name">{name}</span>
        {showDomain ? <span className="eatometer-brand-domain">{appConfig.domain}</span> : null}
      </span>
    </span>
  );
}