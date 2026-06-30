'use client';

import { useEffect, useRef } from 'react';
import EnquiryForm from '@/components/EnquiryForm';

type Props = {
  open: boolean;
  interest: string;
  onClose: () => void;
};

export default function EnquiryModal({ open, interest, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock body scroll + close on Escape while open.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    // Move focus into the panel for keyboard users.
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Make an enquiry"
      className="fixed inset-0 z-[100] flex items-stretch justify-center overflow-y-auto p-0 sm:items-center sm:p-6"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close enquiry"
        onClick={onClose}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-fade"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative w-full max-w-xl bg-paper shadow-2xl outline-none
                   sm:my-auto animate-rise"
      >
        <div className="flex items-start justify-between gap-6 border-b border-ink/10 px-7 py-6 md:px-10 md:py-7">
          <div>
            <p className="eyebrow text-hexa-green">Hexa Space</p>
            <h2 className="font-display font-extralight text-3xl mt-2">Make an enquiry</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 -mt-1 p-2 text-muted hover:text-ink transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M4 4 L16 16 M16 4 L4 16" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </button>
        </div>

        <div className="px-7 py-7 md:px-10 md:py-9">
          <EnquiryForm defaultInterest={interest} />
        </div>
      </div>
    </div>
  );
}
