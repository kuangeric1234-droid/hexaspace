import { NextRequest, NextResponse } from 'next/server';
import { confirmPaidSession, StripeSessionLike } from '@/lib/createBooking';
import { verifyStripeSignature } from '@/lib/stripe';

/**
 * POST /api/book/stripe-webhook — Stripe's server-to-server confirmation.
 * Safety net for guests who pay but never make it back to the site (closed
 * tab, dropped connection): checkout.session.completed writes the booking.
 * Idempotent with /api/book/confirm via stripeSessionId.
 *
 * Configure in the Stripe dashboard: endpoint https://<site>/api/book/stripe-webhook
 * with the checkout.session.completed event; put its signing secret in
 * STRIPE_WEBHOOK_SECRET on the website deployment.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: 'Webhook not configured.' }, { status: 501 });

  const raw = await req.text();
  if (!verifyStripeSignature(raw, req.headers.get('stripe-signature'), secret)) {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  let event: { type?: string; data?: { object?: unknown } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data?.object as StripeSessionLike;
      // Ignores non-website sessions (returns null) — e.g. RND invoice payments
      // if this endpoint ever receives them.
      await confirmPaidSession(session);
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    // Non-2xx makes Stripe retry — which we want if the RND write failed.
    console.error('stripe-webhook error', err);
    return NextResponse.json({ error: 'Processing failed.' }, { status: 500 });
  }
}
