import { LANG_OG_LOCALE, LANG_TAGS, getCurrentLang, type Lang } from "./lang";
import { translate } from "./provider";

/**
 * Helper for route `head()` blocks: builds the localized meta set for the
 * currently active language. `head()` re-runs after a language change because
 * the switcher invalidates the router.
 */
export function headLang(): Lang {
  return getCurrentLang();
}

export function t(path: string): string {
  return translate(getCurrentLang(), path);
}

/** Language-related meta tags shared by every page. */
export function langMeta() {
  const lang = getCurrentLang();
  return [
    { property: "og:locale", content: LANG_OG_LOCALE[lang] },
    { name: "language", content: LANG_TAGS[lang] },
  ];
}

/**
 * Standard localized page meta. `base` keys resolve against the active
 * dictionary, e.g. pageMeta("home.meta", "/").
 */
export function pageMeta(base: string, path: string) {
  const title = t(`${base}.title`);
  const description = t(`${base}.description`);
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: path },
    { name: "twitter:card", content: "summary_large_image" },
    ...langMeta(),
  ];
}
