'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import type { BookableResource } from '@/data/bookable';
import { DAY_START, DAY_END } from '@/data/bookable';
import {
  AvailabilityBooking,
  CreateBookingResult,
  fromDec,
  overlaps,
  timeLabel,
  toDec,
} from '@/lib/booking';
import { useLocale } from '@/i18n/LocaleProvider';
import { BOOKING } from '@/i18n/dictionaries/booking';

const MEMBERS_URL = 'https://portal.hexaspace.com.au';
const ALL_DAY_DISCOUNT = 0.3; // 30% off all-day public bookings

// Selectable half-hourly times across operating hours.
const TIME_OPTIONS = (() => {
  const out: string[] = [];
  for (let d = DAY_START; d <= DAY_END; d += 0.5) out.push(fromDec(d));
  return out;
})();

type Props = {
  resource: BookableResource;
  date: string;
  startTime: string;
  endTime: string;
  allDay?: boolean;
  existing: AvailabilityBooking[];
  onClose: () => void;
  onBooked: (b: { resourceId: string; date: string; startTime: string; endTime: string }) => void;
};

export default function BookingFlow({
  resource,
  date,
  startTime,
  endTime,
  allDay = false,
  existing,
  onClose,
  onBooked,
}: Props) {
  const locale = useLocale();
  const t = BOOKING[locale].flow;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    date,
    startTime,
    endTime,
    title: '',
    description: '',
    name: '',
    email: '',
    phone: '',
    company: '',
  });
  const [accountState, setAccountState] = useState<'new' | 'existing'>('new');
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<CreateBookingResult | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const dur = Math.max(0, toDec(form.endTime) - toDec(form.startTime));
  const gross = resource.rate != null ? resource.rate * dur : null;
  const total =
    gross != null && allDay ? Math.round(gross * (1 - ALL_DAY_DISCOUNT) * 100) / 100 : gross;

  const clash = useMemo(
    () =>
      existing.some(
        (b) =>
          b.resourceId === resource.id &&
          b.date === form.date &&
          b.status !== 'Cancelled' &&
          overlaps(form.startTime, form.endTime, b.startTime, b.endTime)
      ),
    [existing, resource.id, form.date, form.startTime, form.endTime]
  );

  function next() {
    setError('');
    if (step === 0) {
      if (dur <= 0) return setError(t.errEndAfterStart);
      if (clash) return setError(t.errOverlap);
      return setStep(1);
    }
    if (step === 1) return submitDetails();
    if (step === 2) return total != null && total > 0 ? pay() : reserve();
  }

  /**
   * Paid path: ask the server for a Stripe Checkout session and redirect.
   * When payments aren't live (no key / RND toggle off / POA) the server
   * answers { fallback: true } and we reserve unpaid exactly as before.
   */
  async function pay() {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/book/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: resource.id,
          date: form.date,
          startTime: form.startTime,
          endTime: form.endTime,
          allDay,
          title: form.title,
          description: form.description,
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || t.errGeneric);
        setSubmitting(false);
        return;
      }
      if (json.url) {
        setRedirecting(true);
        window.location.assign(json.url as string);
        return; // keep the button disabled while the browser navigates
      }
      // fallback: online payment unavailable — unpaid reserve
      setSubmitting(false);
      await reserve();
    } catch {
      setError(t.errNetwork);
      setSubmitting(false);
    }
  }

  async function submitDetails() {
    if (!form.name.trim()) return setError(t.errName);
    if (!form.email.trim()) return setError(t.errEmail);
    setChecking(true);
    setError('');
    try {
      const res = await fetch('/api/book/check-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim() }),
      });
      const json = await res.json().catch(() => ({}));
      setAccountState(json.exists ? 'existing' : 'new');
    } catch {
      setAccountState('new');
    } finally {
      setChecking(false);
      setStep(2);
    }
  }

  async function reserve() {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: resource.id,
          date: form.date,
          startTime: form.startTime,
          endTime: form.endTime,
          allDay,
          title: form.title,
          description: form.description,
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || t.errGeneric);
        setSubmitting(false);
        return;
      }
      setResult(json.booking as CreateBookingResult);
      onBooked({ resourceId: resource.id, date: form.date, startTime: form.startTime, endTime: form.endTime });
      setStep(3);
    } catch {
      setError(t.errNetwork);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.aria}
      className="fixed inset-0 z-[100] overflow-y-auto bg-paper"
    >
      {/* Top bar with stepper */}
      <div className="sticky top-0 z-10 bg-paper/95 backdrop-blur border-b border-ink/10">
        <div className="container-page flex items-center justify-between h-16">
          <span className="font-heading uppercase tracking-[0.2em] text-sm">{t.newBooking}</span>
          <button type="button" onClick={onClose} aria-label={t.close} className="p-2 text-muted hover:text-ink transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M4 4 L16 16 M16 4 L4 16" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </button>
        </div>
        <div className="container-page pb-5">
          <Stepper step={step} />
        </div>
      </div>

      <div className="container-page py-10 md:py-14">
        {step === 0 && (
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12 max-w-5xl mx-auto">
            {/* Setup */}
            <div className="border border-ink/10 p-7 md:p-9">
              <h2 className="font-display font-extralight text-2xl">{t.setupTitle}</h2>
              <div className="mt-7 space-y-6">
                <div className="grid gap-5 sm:grid-cols-3">
                  <Labeled label={t.date}>
                    <input type="date" value={form.date} onChange={set('date')} className={inputCls} />
                  </Labeled>
                  {allDay ? (
                    <div className="sm:col-span-2">
                      <span className="eyebrow">{t.session}</span>
                      <div className={`${inputCls} flex items-center justify-between`}>
                        <span>{t.allDay} · {timeLabel('09:00')} – {timeLabel('17:00')}</span>
                        <span className="font-heading uppercase tracking-nav text-[10px] text-hexa-green">{t.thirtyOff}</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Labeled label={t.from}>
                        <select value={form.startTime} onChange={set('startTime')} className={inputCls}>
                          {TIME_OPTIONS.map((tm) => (
                            <option key={tm} value={tm}>{timeLabel(tm)}</option>
                          ))}
                        </select>
                      </Labeled>
                      <Labeled label={t.to}>
                        <select value={form.endTime} onChange={set('endTime')} className={inputCls}>
                          {TIME_OPTIONS.map((tm) => (
                            <option key={tm} value={tm}>{timeLabel(tm)}</option>
                          ))}
                        </select>
                      </Labeled>
                    </>
                  )}
                </div>
                <Labeled label={t.titleOpt}>
                  <input value={form.title} onChange={set('title')} placeholder={t.titlePh} className={inputCls} />
                </Labeled>
                <Labeled label={t.descOpt}>
                  <textarea value={form.description} onChange={set('description')} rows={3} placeholder={t.descPh} className={`${inputCls} resize-none`} />
                </Labeled>
              </div>
            </div>

            {/* Summary */}
            <Summary resource={resource} form={form} dur={dur} gross={gross} total={total} allDay={allDay} />
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12 max-w-5xl mx-auto">
            <div className="border border-ink/10 p-7 md:p-9">
              <h2 className="font-display font-extralight text-2xl">{t.detailsTitle}</h2>
              <p className="prose-body mt-2 text-[13px]">
                {t.detailsNote}
              </p>
              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <Labeled label={t.fullName} required>
                  <input value={form.name} onChange={set('name')} autoComplete="name" className={inputCls} />
                </Labeled>
                <Labeled label={t.email} required>
                  <input type="email" value={form.email} onChange={set('email')} autoComplete="email" className={inputCls} />
                </Labeled>
                <Labeled label={t.phone}>
                  <input type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" className={inputCls} />
                </Labeled>
                <Labeled label={t.companyOpt}>
                  <input value={form.company} onChange={set('company')} autoComplete="organization" className={inputCls} />
                </Labeled>
              </div>
            </div>
            <Summary resource={resource} form={form} dur={dur} gross={gross} total={total} allDay={allDay} />
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12 max-w-5xl mx-auto">
            <div className="space-y-6">
              {accountState === 'existing' && (
                <div className="border border-hexa-green/40 bg-hexa-green/5 p-6">
                  <p className="eyebrow text-hexa-green">{t.welcomeBack}</p>
                  <p className="prose-body mt-2 text-ink text-[14px]">
                    <strong>{form.email}</strong>
                    {t.existingBody}
                  </p>
                  <a href={MEMBERS_URL} className="btn-ghost mt-4" target="_blank" rel="noreferrer">
                    {t.loginPortal}
                  </a>
                </div>
              )}

              <div className="border border-ink/10 p-7 md:p-9">
                <h2 className="font-display font-extralight text-2xl">{t.paymentTitle}</h2>
                {total != null && total > 0 ? (
                  <>
                    <div className="mt-3 inline-flex items-center gap-2 font-heading uppercase tracking-nav text-[10px] text-hexa-green">
                      <Lock /> {t.securePaymentLive}
                    </div>
                    <p className="prose-body mt-4 text-[14px]">{t.payIntro}</p>

                    {/* Amount breakdown — the charge is inc. GST */}
                    <div className="mt-6 border border-ink/10 bg-bone/40 p-5 space-y-3">
                      <Row label={t.subtotal} value={`A$${total.toFixed(2)}`} />
                      <Row label={t.gstLine} value={`A$${(total * 0.1).toFixed(2)}`} />
                      <div className="border-t border-ink/10 pt-3 flex items-baseline justify-between">
                        <span className="eyebrow">{t.totalCharged}</span>
                        <span className="font-display font-extralight text-2xl">
                          A${(total * 1.1).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-3 inline-flex items-center gap-2 font-heading uppercase tracking-nav text-[10px] text-hexa-green">
                      <Lock /> {t.securePayment}
                    </div>
                    <p className="prose-body mt-4 text-[14px]">
                      {t.paymentBody1}<strong>{t.paymentReserve}</strong>
                      {t.paymentBody2}
                      {t.theSession}
                      {t.paymentBody3}
                    </p>
                  </>
                )}
              </div>
            </div>
            <Summary resource={resource} form={form} dur={dur} gross={gross} total={total} allDay={allDay} showPolicy />
          </div>
        )}

        {step === 3 && result && (
          <div className="max-w-xl mx-auto text-center py-10">
            <div className="mx-auto w-14 h-14 rounded-full bg-hexa-green/10 flex items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
                <path d="M6 13.5 L11 18 L20 8" stroke="#7F8B2F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="eyebrow text-hexa-green mt-6">{t.reservedKicker}</p>
            <h2 className="h-display text-[clamp(2rem,5vw,3.2rem)] mt-4">{t.reservedTitle}</h2>
            <p className="prose-body mt-5 max-w-sm mx-auto">
              {t.reservedBody1}<strong>{result.resourceName}</strong>
              {t.reservedBody2}<strong>{form.email}</strong>
              {t.reservedBody3}<strong>{result.reference}</strong>
              {t.reservedBody4}
            </p>
            <div className="mt-7 inline-block border border-ink/10 px-6 py-4 text-left">
              <p className="eyebrow">{t.when}</p>
              <p className="font-display font-extralight text-xl mt-1">
                {t.formatLongDate(new Date(result.date + 'T00:00:00'))}
              </p>
              <p className="prose-body text-[14px] mt-1">
                {timeLabel(result.startTime)} – {timeLabel(result.endTime)}
              </p>
            </div>
            <div className="mt-9">
              <button type="button" onClick={onClose} className="btn">{t.done}</button>
            </div>
          </div>
        )}

        {/* Footer actions */}
        {step < 3 && (
          <div className="max-w-5xl mx-auto mt-8 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => (step === 0 ? onClose() : setStep((s) => s - 1))}
              className="btn-ghost"
            >
              {step === 0 ? t.cancel : t.back}
            </button>
            <div className="flex items-center gap-5">
              {error && <p className="font-body text-[13px] text-red-700 max-w-xs text-right">{error}</p>}
              <button
                type="button"
                onClick={next}
                disabled={checking || submitting}
                className="btn disabled:opacity-50"
              >
                {step === 0 && t.continue}
                {step === 1 && (checking ? t.checkingBtn : t.continue)}
                {step === 2 &&
                  (total != null && total > 0
                    ? redirecting
                      ? t.redirecting
                      : submitting
                        ? t.checkingBtn
                        : t.payNow
                    : submitting
                      ? t.reserving
                      : t.reserveBooking)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const inputCls =
  'mt-2 w-full border border-ink/15 bg-bone/40 px-3 py-2.5 font-body text-[15px] text-ink focus:border-ink focus:outline-none transition-colors';

function Labeled({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow">
        {label}
        {required && <span className="text-hexa-green"> *</span>}
      </span>
      {children}
    </label>
  );
}

function Summary({
  resource,
  form,
  dur,
  gross,
  total,
  allDay,
  showPolicy,
}: {
  resource: BookableResource;
  form: { date: string; startTime: string; endTime: string };
  dur: number;
  gross: number | null;
  total: number | null;
  allDay?: boolean;
  showPolicy?: boolean;
}) {
  const locale = useLocale();
  const t = BOOKING[locale].flow;
  const saved = allDay && gross != null && total != null ? gross - total : 0;
  return (
    <aside className="border border-ink/10 p-7 md:p-8 self-start">
      <h3 className="font-display font-extralight text-2xl">{t.summaryTitle}</h3>
      <div className="relative mt-5 aspect-[4/3] overflow-hidden">
        <Image src={resource.image} alt={resource.name} fill sizes="320px" className="object-cover" />
      </div>
      <div className="mt-5 space-y-4 text-[14px]">
        <Row label={t.space} value={resource.name} />
        <Row label={t.date} value={t.formatLongDate(new Date(form.date + 'T00:00:00'))} />
        <Row label={t.time} value={`${timeLabel(form.startTime)} – ${timeLabel(form.endTime)}`} />
        <Row label={t.duration} value={allDay ? t.allDayValue : dur > 0 ? t.hours(dur) : '—'} />
        {allDay && gross != null && (
          <>
            <Row label={t.rate} value={`A$${gross.toFixed(2)}`} />
            <div className="flex items-start justify-between gap-4">
              <span className="eyebrow shrink-0 text-hexa-green">{t.allDayDiscount}</span>
              <span className="font-body text-hexa-green text-right">{t.discountValue(saved.toFixed(2))}</span>
            </div>
          </>
        )}
        <div className="border-t border-ink/10 pt-4 flex items-baseline justify-between">
          <span className="eyebrow">{t.total}</span>
          <span className="font-display font-extralight text-2xl">
            {total != null ? `A$${total.toFixed(2)}` : t.poa}
            {total != null && <span className="font-body text-xs text-muted ml-1">{t.gst}</span>}
          </span>
        </div>
      </div>

      {showPolicy && (
        <div className="mt-6 border-t border-ink/10 pt-5">
          <p className="eyebrow">{t.policyTitle}</p>
          <ul className="mt-3 space-y-1.5 prose-body text-[13px]">
            <li>{t.policy1}</li>
            <li>{t.policy2}</li>
          </ul>
        </div>
      )}
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="eyebrow shrink-0">{label}</span>
      <span className="font-body text-ink text-right">{value}</span>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  const locale = useLocale();
  const steps = BOOKING[locale].flow.steps;
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {steps.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={label} className="flex items-center gap-2 sm:gap-4 flex-1 last:flex-none">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full font-heading text-[11px] ${
                  active ? 'bg-ink text-paper' : done ? 'bg-hexa-green text-paper' : 'bg-ink/10 text-muted'
                }`}
              >
                {done ? '✓' : i + 1}
              </span>
              <span className={`font-heading uppercase tracking-nav text-[10px] ${active ? 'text-ink' : 'text-muted'} hidden sm:inline`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && <span className="h-px flex-1 bg-ink/10 hidden sm:block" />}
          </div>
        );
      })}
    </div>
  );
}

function Lock() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="3" y="6" width="8" height="6" stroke="currentColor" strokeWidth="1.1" />
      <path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}
