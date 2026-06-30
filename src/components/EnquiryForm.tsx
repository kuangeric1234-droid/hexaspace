'use client';

import { useState } from 'react';

const INTERESTS = [
  'A workspace membership',
  'Private office / suite',
  'Meeting room',
  'Function / event space',
  'Media studio',
  'Podcast studio',
  'A private tour',
  'Something else',
];

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function EnquiryForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/api/enquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }
      setStatus('sent');
      form.reset();
    } catch {
      setError('Network error. Please try again, or email info@hexaspace.com.au.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="border border-ink/15 p-10 md:p-12">
        <p className="eyebrow text-hexa-green">Enquiry received</p>
        <h3 className="font-display font-extralight text-3xl mt-5">Thank you.</h3>
        <p className="prose-body mt-4 max-w-sm">
          We’ve received your enquiry and a member of our team will be in touch
          shortly. For anything urgent, call{' '}
          <a href="tel:+61406016666" className="text-ink hover:text-hexa-green transition-colors">
            +61 406 016 666
          </a>
          .
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="btn-ghost mt-8"
          type="button"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7" noValidate>
      <div className="grid gap-7 sm:grid-cols-2">
        <Field label="Name" name="name" autoComplete="name" required />
        <Field label="Business (optional)" name="businessName" autoComplete="organization" />
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
      </div>

      <label className="block">
        <span className="eyebrow">I’m interested in</span>
        <select
          name="interest"
          defaultValue=""
          className="mt-3 w-full border-b border-ink/20 bg-transparent py-3 font-body text-[15px] text-ink focus:border-ink focus:outline-none transition-colors"
        >
          <option value="" disabled>
            Select an option
          </option>
          {INTERESTS.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="eyebrow">Message</span>
        <textarea
          name="message"
          rows={3}
          placeholder="Tell us a little about what you’re after…"
          className="mt-3 w-full resize-none border-b border-ink/20 bg-transparent py-3 font-body text-[15px] text-ink placeholder:text-muted/60 focus:border-ink focus:outline-none transition-colors"
        />
      </label>

      {/* Honeypot — hidden from humans */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden
      />

      {status === 'error' && (
        <p className="font-body text-[14px] text-red-700">{error}</p>
      )}

      <div className="flex flex-wrap items-center gap-5 pt-1">
        <button type="submit" disabled={status === 'sending'} className="btn disabled:opacity-50">
          {status === 'sending' ? 'Sending…' : 'Send enquiry'}
        </button>
        <p className="prose-body text-[12px]">
          Or email{' '}
          <a href="mailto:info@hexaspace.com.au" className="text-ink hover:text-hexa-green transition-colors">
            info@hexaspace.com.au
          </a>
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow">
        {label}
        {required && <span className="text-hexa-green"> *</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        className="mt-3 w-full border-b border-ink/20 bg-transparent py-3 font-body text-[15px] text-ink focus:border-ink focus:outline-none transition-colors"
      />
    </label>
  );
}
