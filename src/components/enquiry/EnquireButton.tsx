'use client';

import { useEnquiry } from './EnquiryProvider';

type Props = {
  /** Pre-selects "I'm enquiring about" in the modal — e.g. "Private Office". */
  interest?: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * Drop-in replacement for the old `<Link href="/#enquire">` CTAs. Opens the
 * global enquiry modal (optionally pre-filled with what they're enquiring about)
 * instead of scrolling to a single form. Renders as a plain button, so it can be
 * styled with the same `btn` / `btn-ghost` classes the links used.
 */
export default function EnquireButton({ interest, className, children }: Props) {
  const { open } = useEnquiry();
  return (
    <button type="button" onClick={() => open(interest)} className={className}>
      {children}
    </button>
  );
}
