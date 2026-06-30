'use client';

import { useEnquiry } from './EnquiryProvider';

type Props = {
  className?: string;
  children: React.ReactNode;
};

/** Opens the private-tour booking modal (date/time → creates a Tour Booked lead in the RND). */
export default function TourButton({ className, children }: Props) {
  const { openTour } = useEnquiry();
  return (
    <button type="button" onClick={openTour} className={className}>
      {children}
    </button>
  );
}
