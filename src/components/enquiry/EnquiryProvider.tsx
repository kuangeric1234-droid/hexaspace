'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import EnquiryModal from './EnquiryModal';
import TourModal from './TourModal';

type EnquiryContextValue = {
  /** Open the enquiry modal, optionally pre-selecting what they're enquiring about. */
  open: (interest?: string) => void;
  /** Open the private-tour booking modal. */
  openTour: () => void;
  close: () => void;
};

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function useEnquiry(): EnquiryContextValue {
  const ctx = useContext(EnquiryContext);
  if (!ctx) {
    throw new Error('useEnquiry must be used within <EnquiryProvider>');
  }
  return ctx;
}

export default function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [interest, setInterest] = useState<string>('');
  const [tourOpen, setTourOpen] = useState(false);

  const open = useCallback((nextInterest?: string) => {
    setInterest(nextInterest ?? '');
    setIsOpen(true);
  }, []);

  const openTour = useCallback(() => setTourOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setTourOpen(false);
  }, []);

  const value = useMemo(() => ({ open, openTour, close }), [open, openTour, close]);

  return (
    <EnquiryContext.Provider value={value}>
      {children}
      <EnquiryModal open={isOpen} interest={interest} onClose={close} />
      <TourModal open={tourOpen} onClose={close} />
    </EnquiryContext.Provider>
  );
}
