import { getRequest } from "@tanstack/react-start/server";
import { DEFAULT_LANG, isLang, type Lang } from "./lang";

/** Reads the persisted FYNDO language cookie from the incoming SSR request. */
export function readRequestLang(): Lang {
  try {
    const cookie = getRequest().headers.get("cookie") ?? "";
    const match = /(?:^|;\s*)fyndo\.lang=([^;]+)/.exec(cookie);
    const value = match?.[1];
    if (isLang(value)) return value;
  } catch {
    /* no request context (prerender) — fall back to the default language */
  }
  return DEFAULT_LANG;
}
