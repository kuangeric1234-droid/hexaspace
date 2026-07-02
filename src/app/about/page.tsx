import type { Metadata } from 'next';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import CTASection from '@/components/CTASection';
import Reveal from '@/components/Reveal';
import EnquireButton from '@/components/enquiry/EnquireButton';
import { getLocale } from '@/i18n/server';
import { PAGES } from '@/i18n/dictionaries/pages';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = PAGES[locale].about;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
  };
}

export default async function AboutPage() {
  const locale = await getLocale();
  const t = PAGES[locale].about;

  return (
    <main>
      <PageHero
        kicker={t.heroKicker}
        title={
          <>
            {t.heroTitle}
            <br />
            <span className="italic">{t.heroTitleItalic}</span>
          </>
        }
        intro={t.heroIntro}
        image="/photos/hero-main.jpg"
      />

      {/* Story */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">{t.storyEyebrow}</p>
            <h2 className="h-section mt-6">
              {t.storyTitle}
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:pt-2">
            <div className="space-y-5 max-w-xl">
              <p className="lead">
                {t.storyLead}
              </p>
              <p className="prose-body">
                {t.storyBody1}
              </p>
              <p className="prose-body">
                {t.storyBody2}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pillars */}
      <section id="ethos" className="bg-paper py-20 md:py-28">
        <div className="container-page">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">{t.pillarsEyebrow}</p>
            <h2 className="h-section mt-6">{t.pillarsTitle}</h2>
          </Reveal>
          <div className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2">
            {t.pillars.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 120}>
                <div className="border-t border-ink pt-6">
                  <span className="font-heading uppercase tracking-label text-[11px] text-muted">
                    0{i + 1}
                  </span>
                  <h3 className="font-display font-extralight text-4xl mt-4">
                    {p.title}
                  </h3>
                  <p className="prose-body mt-4 max-w-md">{p.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Place feature */}
      <section className="bg-charcoal text-paper py-20 md:py-28 lg:py-32">
        <div className="container-page">
          <div className="grid items-center gap-10 md:gap-14 lg:gap-20 lg:grid-cols-2">
            <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden">
              <Image
                src="/photos/about-2.jpg"
                alt={t.placeImageAlt}
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-charcoal" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-charcoal/70" />
            </div>
            <div className="max-w-xl">
              <p className="eyebrow text-paper/50">{t.placeEyebrow}</p>
              <h2 className="h-display mt-6">
                {t.placeTitle}
                <br />
                <span className="italic">{t.placeTitleItalic}</span>
              </h2>
              <p className="lead text-paper/80 mt-7">
                {t.placeLead}
              </p>
              <p className="prose-body text-paper/55 mt-5 max-w-md">
                {t.placeBody}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-paper py-16 md:py-24">
        <div className="container-page">
          <div className="grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {t.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 90} className="bg-paper">
                <div className="p-8 text-center">
                  <p className="font-display font-extralight text-[clamp(2.4rem,5vw,4rem)] leading-none">
                    {s.value}
                  </p>
                  <p className="eyebrow mt-4">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Hexa Group */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal>
            <p className="eyebrow">{t.groupEyebrow}</p>
            <h2 className="h-section mt-6 max-w-2xl">
              {t.groupTitle}
            </h2>
            <p className="prose-body mt-6 max-w-xl">
              {t.groupBody}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <EnquireButton className="btn">
              {t.groupCta}
            </EnquireButton>
          </Reveal>
        </div>
      </section>

      <CTASection tour />
    </main>
  );
}
