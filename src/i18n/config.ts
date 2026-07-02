// ─────────────────────────────────────────────────────────────────────────────
// Locale configuration.
// The site is bilingual (English / Simplified Chinese). The active locale is
// stored in a cookie so server components can render the right language while
// every URL stays exactly the same.
// ─────────────────────────────────────────────────────────────────────────────

export const LOCALES = ['en', 'zh'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** Cookie that carries the visitor's language choice. */
export const LOCALE_COOKIE = 'hexa-locale';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/** Pick a string (or any per-locale value) by locale. */
export function pick<T>(locale: Locale, en: T, zh: T): T {
  return locale === 'zh' ? zh : en;
}
