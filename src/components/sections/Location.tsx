import Reveal from '@/components/Reveal';
import TourButton from '@/components/enquiry/TourButton';
import { getLocale } from '@/i18n/server';
import { HOME } from '@/i18n/dictionaries/home';

export default async function Location() {
  const locale = await getLocale();
  const t = HOME[locale].location;

  return (
    <section id="enquire" className="bg-bone py-24 md:py-36">
      <div className="container-page grid gap-14 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h-display mt-6">
            {t.title}
            <br />
            <span className="italic">{t.titleItalic}</span>
          </h2>
          <p className="lead mt-7 max-w-lg">{t.lead}</p>

          <div className="mt-10 flex flex-wrap gap-4">
            <TourButton className="btn">{t.tour}</TourButton>
            <a href="tel:+61406016666" className="btn">
              +61 406 016 666
            </a>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="grid gap-8 sm:grid-cols-2 lg:pl-10">
            <div className="border-t border-ink pt-4">
              <p className="eyebrow">{t.addressLabel}</p>
              <p className="prose-body text-ink mt-3">
                Level 4, 830 Whitehorse Road,
                <br />
                Box Hill VIC 3128
              </p>
            </div>
            <div className="border-t border-ink pt-4">
              <p className="eyebrow">{t.contactLabel}</p>
              <p className="prose-body text-ink mt-3">
                <a href="tel:+61406016666" className="hover:text-hexa-green transition-colors">
                  +61 406 016 666
                </a>
                <br />
                <a
                  href="mailto:info@hexaspace.com.au"
                  className="hover:text-hexa-green transition-colors"
                >
                  info@hexaspace.com.au
                </a>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
