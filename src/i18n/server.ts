import { cookies, headers } from 'next/headers';
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from './config';

/**
 * Resolve the active locale on the server.
 * Order: explicit cookie choice → Accept-Language hint → English.
 */
export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  const chosen = jar.get(LOCALE_COOKIE)?.value;
  if (isLocale(chosen)) return chosen;

  // First visit: respect a Chinese browser preference.
  const accept = (await headers()).get('accept-language') ?? '';
  if (/^zh|,\s*zh/i.test(accept)) return 'zh';

  return DEFAULT_LOCALE;
}
