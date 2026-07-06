import { NextRequest, NextResponse } from 'next/server';
import { confirmPaidSession, StripeSessionLike } from '@/lib/createBooking';
import { stripeConfigured, stripeFetch } from '@/lib/stripe';

/**
 * POST /api/book/confirm — called when the guest lands back on /book with a
 * ?session_id from Stripe. Verifies the session is paid with Stripe directly
 * (never trusts the URL) and writes the booking. Idempotent per session — the
 * webhook may have already written it, in which case that booking is returned.
 */
export async function POST(req: NextRequest) {
  if (!stripeConfigured()) {
    return NextResponse.json({ error: 'Payments are not configured.' }, { status: 501 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : '';
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    return NextResponse.json({ error: 'Invalid session.' }, { status: 400 });
  }

  const r = await stripeFetch(`/checkout/sessions/${sessionId}`);
  if (!r.ok) {
    return NextResponse.json({ error: 'Payment session not found.' }, { status: 404 });
  }
  const session = r.json as unknown as StripeSessionLike;

  if (session.payment_status !== 'paid') {
    return NextResponse.json(
      { error: 'Payment not completed. If you were charged, please contact info@hexaspace.com.au.' },
      { status: 402 }
    );
  }

  try {
    const result = await confirmPaidSession(session);
    if (!result) {
      return NextResponse.json({ error: 'This payment is not a website booking.' }, { status: 400 });
    }
    return NextResponse.json({
      booking: result.booking,
      paid: true,
      amount: (session.amount_total ?? 0) / 100,
    });
  } catch (err) {
    console.error('confirm-booking error', err);
    return NextResponse.json(
      {
        error:
          'Your payment was received but we couldn’t finish saving the booking — our team has your details and will confirm shortly. Reference: ' +
          sessionId.slice(-8),
      },
      { status: 502 }
    );
  }
}
