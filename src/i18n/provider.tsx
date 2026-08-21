import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "@tanstack/react-router";
import {
  LANG_TAGS,
  getCurrentLang,
  persistLang,
  readInitialLang,
  type Lang,
} from "./lang";
import { DICTS } from "./dict";

type Node = unknown;

function resolve(dict: Node, path: string): Node {
  return path.split(".").reduce<Node>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, Node>)) {
      return (acc as Record<string, Node>)[key];
    }
    return undefined;
  }, dict);
}

/** Translate a dot-path in the given language, falling back to English then the key. */
export function translate(lang: Lang, path: string): string {
  const hit = resolve(DICTS[lang], path) ?? resolve(DICTS.en, path);
  return typeof hit === "string" ? hit : path;
}

/** Translate a dot-path that points at an array or object of content. */
export function translateAny<T>(lang: Lang, path: string): T {
  const hit = resolve(DICTS[lang], path) ?? resolve(DICTS.en, path);
  return hit as T;
}

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (path: string) => string;
  tx: <T>(path: string) => T;
}

const I18nContext = createContext<I18nValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  // SSR resolves the language from the request cookie and the client module
  // reads the same cookie synchronously, so first paint matches the server.
  const [lang, setLangState] = useState<Lang>(() => getCurrentLang());

  useEffect(() => {
    const stored = readInitialLang();
    document.documentElement.lang = LANG_TAGS[stored];
    if (stored !== getCurrentLang()) {
      persistLang(stored);
      setLangState(stored);
      router.invalidate();
    } else {
      persistLang(stored);
    }
  }, [router]);

  const setLang = useCallback(
    (next: Lang) => {
      persistLang(next);
      setLangState(next);
      router.invalidate();
    },
    [router],
  );

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang,
      t: (path: string) => translate(lang, path),
      tx: <T,>(path: string) => translateAny<T>(lang, path),
    }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (ctx) return ctx;
  const lang = getCurrentLang();
  return {
    lang,
    setLang: () => undefined,
    t: (path: string) => translate(lang, path),
    tx: <T,>(path: string) => translateAny<T>(lang, path),
  };
}

/** Convenience hook for components that only need the translate function. */
export function useT() {
  return useI18n().t;
}
