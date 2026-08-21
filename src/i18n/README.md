# FYNDO i18n conventions

Languages: `kn` (Kannada, DEFAULT), `en` (English), `hi` (Hindi).

## Where strings live

`src/i18n/dict/<lang>/<namespace>.ts` — each file default-exports one nested
object (`as const`). Namespaces: `common`, `home`, `services`, `pages`, `extra`.
`src/i18n/dict/index.ts` aggregates them into `DICTS`.

Key paths are dot-paths including the namespace, e.g. `home.hero.title`.

## Using strings in components

```tsx
import { useI18n, useT } from "@/i18n/provider";

const t = useT();                       // strings
const { t, tx, lang } = useI18n();      // tx for arrays/objects
tx<readonly { title: string; body: string }[]>("home.problems.items")
```

Never hard-code user-facing English in components. `FYNDO` stays untranslated.

## Route head() metadata

```tsx
import { pageMeta, t as tHead, langMeta } from "@/i18n/head";

head: () => ({
  meta: pageMeta("pages.about.meta", "/about"),   // title + description keys
  links: [{ rel: "canonical", href: "/about" }],
  scripts: [ ... JSON.stringify(...) with tHead("...") ... ],
})
```

`pageMeta(base, path)` reads `<base>.title` and `<base>.description` from the
active dictionary and emits og/twitter/language tags. Language changes call
`router.invalidate()` so `head()` re-runs.

## Translation quality

- Kannada: simple, modern, everyday Kannada used in Karnataka. No literary forms.
- Hindi: simple conversational Hindi, not formal Sanskritised Hindi.
- English: keep existing polished copy.
- Keep the same object shape/keys across all three languages.

## Translated service taxonomy (shared contract)

`src/i18n/taxonomy.ts` (owned by the services work) exports:

```ts
export interface UiTrade { label: string; serviceSlug?: string }
export interface UiCategory { slug: string; name: string; blurb: string; emoji: string; trades: UiTrade[] }
export interface UiService { slug: string; name: string; category: string; summary: string; covers: string[]; whenYouNeed: string[] }

export function useCategories(): UiCategory[];
export function useServices(): UiService[];
export function useService(slug: string): UiService | undefined;
```

Raw English data stays in `src/lib/services.ts` (slugs are the stable keys);
translations live in the `services` dictionary namespace.
Any component needing category/service copy uses these hooks.
