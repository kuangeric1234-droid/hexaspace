'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { LOCALE_COOKIE, type Locale } from './config';
import { useLocale } from './LocaleProvider';

/**
 * EN / 中文 switch. Writes the locale cookie then refreshes the tree so
 * server components re-render in the chosen language.
 */
export default function LanguageToggle({ className = '' }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const setLocale = (next: Locale) => {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  };

  const item = (value: Locale, label: string) => (
    <button
      type="button"
      onClick={() => setLocale(value)}
      aria-pressed={locale === value}
      className={`whitespace-nowrap transition-opacity duration-300 ${
        locale === value ? 'opacity-100' : 'opacity-45 hover:opacity-80'
      }`}
    >
      {label}
    </button>
  );

  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap font-heading uppercase tracking-nav text-[11px] ${className}`}
    >
      {item('en', 'EN')}
      <span aria-hidden className="opacity-30">
        /
      </span>
      {item('zh', '中文')}
    </span>
  );
}
