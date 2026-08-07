export type FeatureGraphicKind = "sync" | "health" | "recipes" | "rations";

export function FeatureGraphic({ kind, label }: { kind: FeatureGraphicKind; label: string }) {
  return (
    <div className="feature-graphic" role="img" aria-label={label}>
      <svg className="fg-svg" viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle className="fg-bg" cx="130" cy="130" r="116" />
        {kind === "sync" && (
          <>
            <path className="fg-accent" d="M78 130a52 52 0 0 1 89-36" />
            <path className="fg-accent" d="M170 66v30h-30" />
            <path className="fg-accent" d="M182 130a52 52 0 0 1-89 36" />
            <path className="fg-accent" d="M90 194v-30h30" />
            <circle className="fg-dot" cx="130" cy="130" r="9" />
          </>
        )}
        {kind === "health" && (
          <>
            <path
              className="fg-accent fg-fill"
              d="M130 180C94 154 70 132 70 106C70 88 84 76 102 76C116 76 126 86 130 94C134 86 144 76 158 76C176 76 190 88 190 106C190 132 166 154 130 180Z"
            />
            <path className="fg-line" d="M90 122h22l9-20 15 40 10-20h24" />
          </>
        )}
        {kind === "recipes" && (
          <>
            <path className="fg-accent" d="M104 78c8-10-6-16 0-26M130 74c8-10-6-16 0-26M156 78c8-10-6-16 0-26" />
            <path className="fg-line" d="M74 116h112" />
            <path className="fg-line" d="M84 116h92v42a24 24 0 0 1-24 24h-44a24 24 0 0 1-24-24z" />
            <path className="fg-line" d="M84 132H70M176 132h14" />
          </>
        )}
        {kind === "rations" && (
          <>
            <rect className="fg-card" x="76" y="150" width="108" height="38" rx="13" />
            <rect className="fg-card" x="86" y="122" width="88" height="34" rx="13" />
            <rect className="fg-card" x="96" y="96" width="68" height="30" rx="13" />
            <circle className="fg-dot" cx="112" cy="111" r="6" />
            <path className="fg-accent" d="M126 111h26" />
          </>
        )}
      </svg>
    </div>
  );
}
