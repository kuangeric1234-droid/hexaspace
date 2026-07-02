import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { getLocale } from '@/i18n/server';
import { HOME } from '@/i18n/dictionaries/home';

export default async function Community() {
  const locale = await getLocale();
  const t = HOME[locale].community;

  return (
    <section id="community" className="bg-paper py-24 md:py-36">
      <div className="container-page">
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-3xl">
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 className="h-section mt-6">{t.title}</h2>
          </div>
          <Link href="/community" className="btn-ghost">
            {t.explore}
          </Link>
        </Reveal>

        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {t.values.map((v, i) => (
            <Reveal key={v.title} delay={i * 120}>
              <div className="border-t border-ink pt-6">
                <span className="font-heading uppercase tracking-label text-[11px] text-muted">
                  0{i + 1}
                </span>
                <h3 className="font-display font-extralight text-3xl mt-5">{v.title}</h3>
                <p className="prose-body mt-4">{v.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
