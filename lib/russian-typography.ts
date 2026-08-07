const shortWordsByLocale: Record<string, readonly string[]> = {
  ru: ["а", "в", "во", "к", "ко", "о", "об", "обо", "с", "со", "у", "и", "на", "за", "из", "от", "до", "по", "под", "над", "при", "про", "для", "без", "не", "ни", "ли", "же", "бы", "или"],
  en: ["a", "an", "as", "at", "by", "for", "from", "in", "into", "of", "on", "or", "the", "to", "with"],
  cs: ["a", "i", "k", "ke", "o", "od", "po", "pro", "s", "se", "u", "v", "ve", "z", "za", "ze"],
  de: ["am", "an", "auf", "aus", "bei", "bis", "das", "dem", "den", "der", "des", "die", "ein", "im", "in", "mit", "ob", "um", "und", "vom", "von", "vor", "zu", "zum", "zur"],
  es: ["a", "al", "con", "de", "del", "e", "el", "en", "la", "las", "lo", "los", "o", "para", "por", "sin", "u", "un", "una", "y"],
  fr: ["a", "à", "au", "aux", "avec", "chez", "de", "des", "du", "en", "et", "la", "le", "les", "par", "pour", "sans", "sous", "sur", "un", "une"],
  it: ["a", "ad", "al", "alla", "alle", "allo", "con", "da", "dai", "dal", "dalla", "dalle", "di", "e", "ed", "gli", "i", "il", "in", "la", "le", "lo", "per", "su", "sul", "un", "una"],
  nl: ["aan", "als", "bij", "de", "een", "en", "het", "in", "met", "na", "of", "om", "op", "te", "tot", "uit", "van", "voor"],
  pl: ["a", "bez", "czy", "dla", "do", "i", "lub", "na", "nad", "nie", "o", "od", "po", "pod", "przy", "się", "u", "w", "we", "z", "za", "ze"],
  pt: ["a", "ao", "aos", "as", "com", "da", "das", "de", "do", "dos", "e", "em", "na", "nas", "no", "nos", "o", "os", "ou", "para", "por", "sem", "um", "uma"],
  sl: ["a", "ali", "brez", "do", "in", "k", "na", "nad", "o", "ob", "od", "po", "pod", "pri", "s", "v", "za", "z"],
  tr: ["bir", "bu", "ile", "ve", "veya"],
};

const noBreakSpace = "\u00a0";
const patternCache = new Map<string, RegExp>();

function escapePatternWord(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function shortWordPattern(locale: string): RegExp | undefined {
  const words = shortWordsByLocale[locale];
  if (!words) {
    return undefined;
  }

  const cached = patternCache.get(locale);
  if (cached) {
    return cached;
  }

  const pattern = new RegExp(`(^|[\\s([{«„"“'‘])(${words.map(escapePatternWord).join("|")})\\s+(?=\\S)`, "giu");
  patternCache.set(locale, pattern);
  return pattern;
}

function shortWordPatterns(locale: string): RegExp[] {
  const locales = locale === "en" ? ["en"] : ["en", locale];
  return locales.map(shortWordPattern).filter((pattern): pattern is RegExp => Boolean(pattern));
}

export function formatLocaleText(value: string, locale: string): string {
  const patterns = shortWordPatterns(locale);
  if (patterns.length === 0) {
    return value;
  }

  return patterns.reduce((result, pattern) => result.replace(pattern, `$1$2${noBreakSpace}`), value);
}

export function formatLocaleCopy<T>(value: T, locale: string): T {
  if (typeof value === "string") {
    return formatLocaleText(value, locale) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => formatLocaleCopy(item, locale)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, formatLocaleCopy(item, locale)]),
    ) as T;
  }

  return value;
}

export function formatRussianText(value: string): string {
  return formatLocaleText(value, "ru");
}

export function formatRussianCopy<T>(value: T): T {
  return formatLocaleCopy(value, "ru");
}
