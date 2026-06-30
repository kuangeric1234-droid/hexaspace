// Shared helpers + types for the public booking calendar and its API routes.

export type AvailabilityBooking = {
  /** website resource id (slug) — server translates RND space ids back to this */
  resourceId: string;
  date: string; // yyyy-MM-dd
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status: string;
};

export type CreateBookingInput = {
  resourceId: string;
  date: string;
  startTime: string;
  endTime: string;
  title?: string;
  description?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
};

export type CreateBookingResult = {
  reference: string;
  resourceName: string;
  date: string;
  startTime: string;
  endTime: string;
};

// ── time helpers (mirror the RND portal calendar) ────────────────────────────

/** "13:30" → 13.5 */
export function toDec(t: string): number {
  const [h, m] = (t || '0:0').split(':').map(Number);
  return h + m / 60;
}

/** 13.5 → "13:30" */
export function fromDec(d: number): string {
  const h = Math.floor(d);
  const m = Math.round((d % 1) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** hour number → "1 pm" */
export function hourLabel(h: number): string {
  return `${h % 12 || 12} ${h >= 12 ? 'pm' : 'am'}`;
}

/** "13:30" → "1:30 pm" */
export function timeLabel(t: string): string {
  if (!t) return '';
  let [h, m] = t.split(':').map(Number);
  const ap = h >= 12 ? 'pm' : 'am';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')} ${ap}`;
}

export function overlaps(aS: string, aE: string, bS: string, bE: string): boolean {
  return toDec(aS) < toDec(bE) && toDec(bS) < toDec(aE);
}

/** local yyyy-MM-dd (avoids UTC off-by-one from toISOString). */
export function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Date → "Tuesday, 1 July 2026" */
export function longDate(d: Date): string {
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "2026-07-01" → "Wed, 1 Jul 2026" (display only) */
export function shortDate(dateStr: string): string {
  const [y, m, day] = dateStr.split('-').map(Number);
  const d = new Date(y, m - 1, day);
  return `${DAYS[d.getDay()].slice(0, 3)}, ${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${y}`;
}
