/**
 * FYNDO language core.
 *
 * Kannada is the default language for every first-time visitor. The choice is
 * persisted client-side (localStorage + cookie) and read back synchronously so
 * route `head()` metadata can be produced in the active language.
 */

export const LANGS = ["kn", "en", "hi"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "kn";

export const LANG_LABELS: Record<Lang, string> = {
  kn: "ಕನ್ನಡ",
  en: "English",
  hi: "हिन्दी",
};

/** BCP-47 tags used for <html lang> and og:locale. */
export const LANG_TAGS: Record<Lang, string> = {
  kn: "kn-IN",
  en: "en-IN",
  hi: "hi-IN",
};

export const LANG_OG_LOCALE: Record<Lang, string> = {
  kn: "kn_IN",
  en: "en_IN",
  hi: "hi_IN",
};

const STORAGE_KEY = "fyndo.lang";

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (LANGS as readonly string[]).includes(value);
}

function readStored(): Lang {
  if (typeof window === "undefined") return DEFAULT_LANG;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLang(stored)) return stored;
    const cookie = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${STORAGE_KEY}=`))
      ?.split("=")[1];
    if (isLang(cookie)) return cookie;
  } catch {
    /* storage may be unavailable */
  }
  return DEFAULT_LANG;
}

/** The language the server actually rendered, read from <html lang>. */
function readServerRenderedLang(): Lang {
  if (typeof document === "undefined") return DEFAULT_LANG;
  const tag = document.documentElement.lang;
  const hit = (LANGS as readonly Lang[]).find((l) => LANG_TAGS[l] === tag);
  return hit ?? DEFAULT_LANG;
}

/**
 * Module-scoped active language. On the client this starts from the language
 * the server rendered so hydration never mismatches (which would otherwise
 * regenerate the whole tree and flash on launch). The provider switches to the
 * stored preference after mount.
 */
let currentLang: Lang = typeof window === "undefined" ? DEFAULT_LANG : readServerRenderedLang();


/** Server-side per-request override, applied in the root route's beforeLoad. */
export function setCurrentLang(lang: Lang): void {
  currentLang = lang;
}

export function getCurrentLang(): Lang {
  return currentLang;
}

export function persistLang(lang: Lang): void {
  currentLang = lang;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.cookie = `${STORAGE_KEY}=${lang}; path=/; max-age=31536000; samesite=lax`;
  } catch {
    /* persistence is best-effort */
  }
  document.documentElement.lang = LANG_TAGS[lang];
}

export function readInitialLang(): Lang {
  return readStored();
}
