import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import EnquireButton from '@/components/enquiry/EnquireButton';
import { getLocale } from '@/i18n/server';
import { HOME } from '@/i18n/dictionaries/home';

// Non-copy metadata for the three feature rows; copy comes from the dictionary.
const SPACE_META = [
  { interest: 'Meeting Rooms', bookHref: '/book', img: '/photos/meeting-room.jpg' },
  { interest: 'The Function Space', img: '/photos/event-space.jpg' },
  { interest: 'Media Studios', bookHref: '/book?tab=studio', img: '/photos/media-1.jpg' },
];

export default async function Spaces() {
  const locale = await getLocale();
  const t = HOME[locale].spaces;

  return (
    <section id="spaces" className="bg-bone py-24 md:py-36">
      <div className="container-page">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h-section mt-6">{t.title}</h2>
        </Reveal>
      </div>

      <div className="mt-20 space-y-px">
        {t.items.map((s, i) => {
          const meta = SPACE_META[i];
          const flip = i % 2 === 1;
          return (
            <Reveal key={s.name}>
              <div className="container-page">
                <div
                  className={`grid items-center gap-10 md:gap-16 md:grid-cols-2 py-12 border-t border-ink/10 ${
                    flip ? 'md:[&>*:first-child]:order-2' : ''
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={meta.img}
                      alt={s.name}
                      fill
                      sizes="(max-width:768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className={flip ? 'md:pr-10' : 'md:pl-10'}>
                    <div className="flex items-center gap-4">
                      <span className="font-heading uppercase tracking-label text-[11px] text-hexa-green">
                        {s.detail}
                      </span>
                    </div>
                    <h3 className="font-display font-extralight text-[clamp(2rem,4vw,3.4rem)] mt-4">
                      {s.name}
                    </h3>
                    <p className="prose-body mt-5 max-w-md">{s.copy}</p>
                    {meta.bookHref ? (
                      <Link href={meta.bookHref} className="btn-ghost mt-7">
                        {t.checkAvailability}
                      </Link>
                    ) : (
                      <EnquireButton interest={meta.interest} className="btn-ghost mt-7">
                        {t.enquire}
                      </EnquireButton>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
