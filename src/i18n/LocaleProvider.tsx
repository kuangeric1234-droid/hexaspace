'use client';

import { createContext, useContext } from 'react';
import { DEFAULT_LOCALE, type Locale } from './config';

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

/** Active locale for client components; the value is provided by the root layout. */
export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export default function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}
