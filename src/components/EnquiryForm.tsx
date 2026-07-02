'use client';

import { useState } from 'react';
import { ENQUIRY_GROUPS, normaliseInterest } from '@/data/enquiry';
import { useLocale } from '@/i18n/LocaleProvider';
import { BOOKING } from '@/i18n/dictionaries/booking';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function EnquiryForm({
  defaultInterest = '',
  onSent,
}: {
  /** Pre-select "I'm interested in" (e.g. opened from the Private Office page). */
  defaultInterest?: string;
  onSent?: () => void;
}) {
  const locale = useLocale();
  const t = BOOKING[locale].enquiryForm;
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
        setError(json.error || t.errGeneric);
        setStatus('error');
        return;
      }
      setStatus('sent');
      form.reset();
      onSent?.();
    } catch {
      setError(t.errNetwork);
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="py-2">
        <p className="eyebrow text-hexa-green">{t.sentKicker}</p>
        <h3 className="font-display font-extralight text-3xl mt-5">{t.sentTitle}</h3>
        <p className="prose-body mt-4 max-w-sm">
          {t.sentBody1}
          <a href="tel:+61406016666" className="text-ink hover:text-hexa-green transition-colors">
            +61 406 016 666
          </a>
          {t.sentBody2}
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="btn-ghost mt-8"
          type="button"
        >
          {t.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7" noValidate>
      <div className="grid gap-7 sm:grid-cols-2">
        <Field label={t.name} name="name" autoComplete="name" required />
        <Field label={t.businessOpt} name="businessName" autoComplete="organization" />
        <Field label={t.email} name="email" type="email" autoComplete="email" required />
        <Field label={t.phone} name="phone" type="tel" autoComplete="tel" />
      </div>

      <label className="block">
        <span className="eyebrow">{t.enquiringAbout}</span>
        <select
          name="interest"
          defaultValue={normaliseInterest(defaultInterest)}
          className="mt-3 w-full border-b border-ink/20 bg-transparent py-3 font-body text-[15px] text-ink focus:border-ink focus:outline-none transition-colors"
        >
          <option value="" disabled>
            {t.selectOption}
          </option>
          {/* Localised labels only — the submitted `value` stays in English. */}
          {ENQUIRY_GROUPS.map((group) => (
            <optgroup key={group.label} label={t.groupLabels[group.label] ?? group.label}>
              {group.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {t.optionLabels[o.value] ?? o.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="eyebrow">{t.message}</span>
        <textarea
          name="message"
          rows={3}
          placeholder={t.messagePh}
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
          {status === 'sending' ? t.sending : t.send}
        </button>
        <p className="prose-body text-[12px]">
          {t.orEmail}{' '}
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
