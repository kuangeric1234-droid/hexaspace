import Link from 'next/link';
import EnquireButton from '@/components/enquiry/EnquireButton';
import TourButton from '@/components/enquiry/TourButton';
import { getLocale } from '@/i18n/server';
import { COMMON } from '@/i18n/dictionaries/common';

type Props = {
  eyebrow?: string;
  title?: React.ReactNode;
  body?: string;
  primaryLabel?: string;
  /** Pre-selects what they're enquiring about in the modal (e.g. "Private Office"). */
  interest?: string;
  /** When set, the primary action links here (e.g. /book) instead of opening the enquiry modal. */
  href?: string;
  /** When true, the primary action opens the private-tour booking modal. */
  tour?: boolean;
};

export default async function CTASection({
  eyebrow,
  title,
  body,
  primaryLabel,
  interest,
  href,
  tour,
}: Props) {
  const locale = await getLocale();
  const t = COMMON[locale].cta;

  const resolvedEyebrow = eyebrow ?? t.eyebrow;
  const resolvedTitle = title ?? (
    <>
      {t.title} <span className="italic">{t.titleItalic}</span>
    </>
  );
  const resolvedBody = body ?? t.body;
  const resolvedPrimary = primaryLabel ?? t.primaryLabel;

  return (
    <section className="bg-ink text-paper py-24 md:py-32">
      <div className="container-page text-center max-w-3xl mx-auto">
        <p className="eyebrow text-paper/50">{resolvedEyebrow}</p>
        <h2 className="h-display mt-6">{resolvedTitle}</h2>
        <p className="lead text-paper/80 mt-7 mx-auto max-w-xl">{resolvedBody}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {href ? (
            <Link href={href} className="btn btn-light">
              {resolvedPrimary}
            </Link>
          ) : tour ? (
            <TourButton className="btn btn-light">{resolvedPrimary}</TourButton>
          ) : (
            <EnquireButton interest={interest} className="btn btn-light">
              {resolvedPrimary}
            </EnquireButton>
          )}
          <Link href="tel:+61406016666" className="btn btn-light border-paper/30">
            +61 406 016 666
          </Link>
        </div>
      </div>
    </section>
  );
}
