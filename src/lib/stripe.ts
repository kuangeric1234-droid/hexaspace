// ─────────────────────────────────────────────────────────────────────────────
// Stripe REST helpers for the website — form-encoded fetch, no SDK, mirroring
// the RND app's api/_stripe.js so both sides talk to the same Stripe account.
//
// Env (same account as the RND app):
//   STRIPE_SECRET_KEY       sk_live_… / sk_test_…
//   STRIPE_WEBHOOK_SECRET   whsec_… for THIS site's /api/book/stripe-webhook
//
// Online payments are additionally gated by the RND setting
// Settings → Integrations → Stripe → "Enable online payments"
// (settings.stripe.paymentsEnabled) so the team controls go-live in one place.
// ─────────────────────────────────────────────────────────────────────────────
import crypto from 'crypto';
import { rndConfigured, rndSelect } from './rnd';

const API = 'https://api.stripe.com/v1';

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

// Stripe's form encoding: nested objects become bracketed keys.
function flatten(
  params: Record<string, unknown>,
  prefix = '',
  out = new URLSearchParams()
): URLSearchParams {
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === 'object' && !Array.isArray(v)) {
      flatten(v as Record<string, unknown>, key, out);
    } else if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (typeof item === 'object' && item !== null) {
          flatten(item as Record<string, unknown>, `${key}[${i}]`, out);
        } else {
          out.append(`${key}[${i}]`, String(item));
        }
      });
    } else {
      out.append(key, String(v));
    }
  }
  return out;
}

export async function stripeFetch(
  path: string,
  params: Record<string, unknown> | null = null,
  method: string = params ? 'POST' : 'GET'
): Promise<{ ok: boolean; json: Record<string, unknown> & { error?: { message?: string } } }> {
  const key = process.env.STRIPE_SECRET_KEY;
  const r = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params ? flatten(params) : undefined,
    cache: 'no-store',
  });
  const json = await r.json().catch(() => ({}));
  return { ok: r.ok, json };
}

/**
 * The RND admin's master switch for online payments
 * (Settings → Integrations → Stripe). Fail closed on errors.
 */
export async function paymentsEnabled(): Promise<boolean> {
  if (!stripeConfigured()) return false;
  if (!rndConfigured()) return false;
  try {
    const rows = await rndSelect<{ stripe?: { paymentsEnabled?: boolean } }>(
      'settings',
      'select=data&id=eq.global'
    );
    return rows[0]?.data?.stripe?.paymentsEnabled === true;
  } catch {
    return false;
  }
}

// Stripe-Signature: t=<ts>,v1=<hmac>[,v1=…] — HMAC-SHA256 of `${t}.${payload}`.
// Same verification as the RND app's webhook.
export function verifyStripeSignature(
  payload: string,
  header: string | null,
  secret: string,
  toleranceSec = 300
): boolean {
  const parts = Object.fromEntries(
    String(header ?? '')
      .split(',')
      .map((kv) => kv.split('=').map((s) => s.trim()))
      .filter((p) => p.length === 2)
  );
  const t = Number(parts.t);
  if (!t || Math.abs(Date.now() / 1000 - t) > toleranceSec) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${parts.t}.${payload}`).digest('hex');
  const candidates = String(header)
    .split(',')
    .filter((s) => s.trim().startsWith('v1='))
    .map((s) => s.trim().slice(3));
  return candidates.some((sig) => {
    try {
      return crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'));
    } catch {
      return false;
    }
  });
}

export const GST_RATE = 0.1;

/** Ex-GST fee → the inc-GST amount actually charged, in whole cents. */
export function incGstCents(feeExGst: number): number {
  return Math.round(feeExGst * (1 + GST_RATE) * 100);
}
