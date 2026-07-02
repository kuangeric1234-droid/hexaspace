import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnquiryProvider from '@/components/enquiry/EnquiryProvider';
import LocaleProvider from '@/i18n/LocaleProvider';
import { getLocale } from '@/i18n/server';
import { COMMON } from '@/i18n/dictionaries/common';

// Hexa brand typefaces (loaded locally from licensed .otf files)
const display = localFont({
  src: '../fonts/BigDailyShort-ExtraLight.otf',
  variable: '--font-display',
  weight: '200',
  display: 'swap',
});

const heading = localFont({
  src: '../fonts/ReworkMicro-Semibold.otf',
  variable: '--font-heading',
  weight: '600',
  display: 'swap',
});

const body = localFont({
  src: '../fonts/GT-America-Standard-Thin.otf',
  variable: '--font-body',
  weight: '300',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COMMON[locale].meta;
  return {
    title: t.title,
    description: t.description,
    metadataBase: new URL('https://www.hexaspace.com.au'),
    openGraph: {
      title: t.title,
      description: t.ogDescription,
      type: 'website',
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html
      lang={locale === 'zh' ? 'zh-Hans' : 'en'}
      className={`${display.variable} ${heading.variable} ${body.variable}`}
    >
      <body>
        <LocaleProvider locale={locale}>
          <EnquiryProvider>
            <Header />
            {children}
            <Footer />
          </EnquiryProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
