import type { Metadata } from 'next';
import CTASection from '@/components/CTASection';
import Reveal from '@/components/Reveal';
import { getLocale } from '@/i18n/server';
import { MERCH } from '@/i18n/dictionaries/merch';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = MERCH[locale].meta;
  return { title: t.title, description: t.description };
}

export default async function MerchPage() {
  const locale = await getLocale();
  const t = MERCH[locale];

  return (
    <main>
      {/* Dark editorial hero (no photo — the products are the imagery) */}
      <section className="relative bg-charcoal text-paper min-h-[70svh] flex items-end overflow-hidden">
        {/* oversized watermark hexagon */}
        <svg
          aria-hidden
          viewBox="0 0 100 110"
          className="pointer-events-none absolute -right-16 -top-24 h-[130%] opacity-[0.06]"
        >
          <path
            d="M50,2 L95,28 L95,82 L50,108 L5,82 L5,28 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path d="M50,30 L72,42 L50,54 L28,42 Z" fill="currentColor" />
          <path d="M28,42 L50,54 L50,80 L28,68 Z" fill="currentColor" opacity="0.7" />
          <path d="M72,42 L50,54 L50,80 L72,68 Z" fill="currentColor" opacity="0.45" />
        </svg>

        <div className="relative container-page pb-16 md:pb-24 pt-40">
          <p className="eyebrow text-paper/60 animate-rise">{t.hero.kicker}</p>
          <h1
            className="h-display text-paper mt-5 max-w-4xl animate-rise"
            style={{ animationDelay: '120ms' }}
          >
            {t.hero.title}
            <br />
            <span className="italic">{t.hero.titleItalic}</span>
          </h1>
          <p
            className="lead text-paper/80 mt-7 max-w-2xl animate-rise"
            style={{ animationDelay: '240ms' }}
          >
            {t.hero.intro}
          </p>
          <p
            className="mt-9 inline-block border border-hexa-green/60 text-hexa-green font-heading uppercase tracking-nav text-[11px] px-5 py-2.5 animate-rise"
            style={{ animationDelay: '360ms' }}
          >
            {t.hero.badge}
          </p>
        </div>
      </section>

      {/* Product grid */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-page">
          <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow">{t.grid.eyebrow}</p>
              <h2 className="h-section mt-6">{t.grid.title}</h2>
            </div>
            <p className="prose-body max-w-md">{t.grid.body}</p>
          </Reveal>

          <div className="mt-14 grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {t.products.map((p, i) => (
              <Reveal key={p.image} delay={(i % 4) * 90} className="bg-bone">
                <div className="group flex h-full flex-col bg-bone hover:bg-paper transition-colors duration-500">
                  <div className="relative overflow-hidden">
                    {/* concept renders are local SVGs — plain img keeps them crisp at any size */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.name}
                      className="aspect-[4/5] w-full object-cover transition-transform duration-[1.2s] ease-lux group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-4 top-4 bg-ink/80 text-paper font-heading uppercase tracking-nav text-[9px] px-3 py-1.5">
                      {t.grid.comingSoon}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="font-heading uppercase tracking-[0.06em] text-[13px]">
                          {p.name}
                        </h3>
                        <span className="font-display font-extralight text-xl whitespace-nowrap">
                          {p.price}
                        </span>
                      </div>
                      <p className="prose-body mt-3 text-[13px]">{p.copy}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* imagery disclaimer */}
          <Reveal className="mt-10">
            <p className="prose-body text-[13px] max-w-2xl">
              <span className="font-heading uppercase tracking-label text-[10px] text-hexa-green mr-3">
                {t.note.label}
              </span>
              {t.note.body}
            </p>
          </Reveal>
        </div>
      </section>

      <CTASection
        eyebrow={t.cta.eyebrow}
        title={
          <>
            {t.cta.title} <span className="italic">{t.cta.titleItalic}</span>
          </>
        }
        body={t.cta.body}
        primaryLabel={t.cta.primary}
        interest="Merchandise"
      />
    </main>
  );
}
