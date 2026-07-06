import Image from 'next/image';
import Link from 'next/link';
import TourButton from '@/components/enquiry/TourButton';
import { getLocale } from '@/i18n/server';
import { HOME } from '@/i18n/dictionaries/home';

export default async function Hero() {
  const locale = await getLocale();
  const t = HOME[locale].hero;

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
      {/* Full-bleed image */}
      <Image
        src="/photos/hero-main.jpg"
        alt={t.imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover animate-fade"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/10 to-ink/70" />

      {/* Copy — text-forward, words land first. Top padding reserves the fixed
          header's space so on high zoom / short viewports the section grows
          instead of the text sliding under the nav. */}
      <div className="relative container-page pt-28 md:pt-32 pb-20 md:pb-28">
        <div className="max-w-4xl md:pl-6 lg:pl-10 pr-4">
          <p className="eyebrow text-paper/70 animate-rise">{t.eyebrow}</p>
          <h1 className="h-display text-paper mt-6 animate-rise" style={{ animationDelay: '120ms' }}>
            {t.title}
            <br />
            <span className="italic">{t.titleItalic}</span>
          </h1>
          <p
            className="lead text-paper/85 mt-8 max-w-2xl animate-rise"
            style={{ animationDelay: '240ms' }}
          >
            {t.lead}
          </p>
          <div
            className="mt-10 flex flex-wrap gap-4 animate-rise"
            style={{ animationDelay: '360ms' }}
          >
            <Link href="#workspaces" className="btn btn-light">
              {t.explore}
            </Link>
            <TourButton className="btn btn-light border-paper/40">{t.tour}</TourButton>
          </div>
        </div>
      </div>
    </section>
  );
}
