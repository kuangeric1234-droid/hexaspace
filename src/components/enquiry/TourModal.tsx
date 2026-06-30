'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { timeLabel, ymd } from '@/lib/booking';

// Tour slots: 9:00am–5:00pm, every 30 minutes.
const TIMES = (() => {
  const out: string[] = [];
  for (let d = 9; d <= 17; d += 0.5) {
    const h = Math.floor(d);
    const m = (d % 1) * 60;
    out.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  }
  return out;
})();

const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** The next `n` weekdays (Mon–Fri), starting tomorrow. */
function nextWeekdays(n: number): Date[] {
  const out: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  while (out.length < n) {
    const day = d.getDay();
    if (day >= 1 && day <= 5) out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function TourModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const days = useMemo(() => nextWeekdays(15), []);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    date: '',
    time: '10:00',
    message: '',
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    // default the date to the first available weekday
    setForm((f) => (f.date ? f : { ...f, date: days[0] ? ymd(days[0]) : '' }));
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, days]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return setError('Please enter your name.');
    if (!form.email.trim()) return setError('Please enter your email.');
    if (!form.date) return setError('Please choose a day.');
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/tour', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }
      setStatus('sent');
    } catch {
      setError('Network error. Please try again, or email info@hexaspace.com.au.');
      setStatus('error');
    }
  }

  if (!open) return null;

  const dayLabel = (d: Date) => `${WD[d.getDay()]}, ${d.getDate()} ${MO[d.getMonth()]}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Book a private tour"
      className="fixed inset-0 z-[100] flex items-stretch justify-center overflow-y-auto p-0 sm:items-center sm:p-6"
    >
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-fade" />

      <div ref={panelRef} tabIndex={-1} className="relative w-full max-w-xl bg-paper shadow-2xl outline-none sm:my-auto animate-rise">
        <div className="flex items-start justify-between gap-6 border-b border-ink/10 px-7 py-6 md:px-10 md:py-7">
          <div>
            <p className="eyebrow text-hexa-green">Visit · Box Hill</p>
            <h2 className="font-display font-extralight text-3xl mt-2">Book a private tour</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="-mr-2 -mt-1 p-2 text-muted hover:text-ink transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M4 4 L16 16 M16 4 L4 16" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </button>
        </div>

        <div className="px-7 py-7 md:px-10 md:py-9">
          {status === 'sent' ? (
            <div>
              <p className="eyebrow text-hexa-green">Tour booked</p>
              <h3 className="font-display font-extralight text-3xl mt-4">See you soon.</h3>
              <p className="prose-body mt-4 max-w-sm">
                Your tour is booked for{' '}
                <strong>
                  {(() => {
                    const d = new Date(form.date + 'T00:00:00');
                    return `${WD[d.getDay()]}, ${d.getDate()} ${MO[d.getMonth()]}`;
                  })()}{' '}
                  at {timeLabel(form.time)}
                </strong>
                . We’ve sent the details to {form.email} and our team will confirm shortly.
              </p>
              <button onClick={onClose} type="button" className="btn mt-8">Done</button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6" noValidate>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Name" required value={form.name} onChange={set('name')} autoComplete="name" />
                <Field label="Business (optional)" value={form.business} onChange={set('business')} autoComplete="organization" />
                <Field label="Email" type="email" required value={form.email} onChange={set('email')} autoComplete="email" />
                <Field label="Phone" type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="eyebrow">Preferred day <span className="text-hexa-green">*</span></span>
                  <select value={form.date} onChange={set('date')} className={selectCls}>
                    {days.map((d) => (
                      <option key={ymd(d)} value={ymd(d)}>{dayLabel(d)}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="eyebrow">Preferred time <span className="text-hexa-green">*</span></span>
                  <select value={form.time} onChange={set('time')} className={selectCls}>
                    {TIMES.map((t) => (
                      <option key={t} value={t}>{timeLabel(t)}</option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="prose-body text-[12px] -mt-1">Tours run weekdays, 9:00 am – 5:00 pm.</p>

              <label className="block">
                <span className="eyebrow">Anything we should know? (optional)</span>
                <textarea value={form.message} onChange={set('message')} rows={2} placeholder="What you’re looking for, team size…" className={`${selectCls} resize-none`} />
              </label>

              {status === 'error' && <p className="font-body text-[14px] text-red-700">{error}</p>}

              <div className="flex flex-wrap items-center gap-5 pt-1">
                <button type="submit" disabled={status === 'sending'} className="btn disabled:opacity-50">
                  {status === 'sending' ? 'Booking…' : 'Book my tour'}
                </button>
                <p className="prose-body text-[12px]">
                  Or call{' '}
                  <a href="tel:+61406016666" className="text-ink hover:text-hexa-green transition-colors">+61 406 016 666</a>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const selectCls =
  'mt-3 w-full border-b border-ink/20 bg-transparent py-3 font-body text-[15px] text-ink focus:border-ink focus:outline-none transition-colors';

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
      <input type={type} value={value} onChange={onChange} required={required} autoComplete={autoComplete} className={selectCls} />
    </label>
  );
}
