import { NextRequest, NextResponse } from 'next/server';

// Forwards website enquiries to the Hexa Space admin dashboard's public intake
// endpoint (creates a lead in Supabase + notifies admin). Server-to-server, so no
// CORS and the endpoint URL stays off the client. Tagged source:'hexaspace'.
// Target: admin.hexaspace.com.au (the management dashboard). Override per-env with
// HEXASPACE_ADMIN_ENDPOINT (e.g. a Vercel preview URL while staging).
const ENDPOINT =
  process.env.HEXASPACE_ADMIN_ENDPOINT ||
  'https://admin.hexaspace.com.au/api/form-submit';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const name = str(body.name);
  const email = str(body.email);
  const phone = str(body.phone);
  const businessName = str(body.businessName);
  const interest = str(body.interest);
  const message = str(body.message);
  const website = str(body.website); // honeypot

  // Bot honeypot — pretend success.
  if (website) return NextResponse.json({ success: true });

  if (!email && !phone) {
    return NextResponse.json(
      { error: 'Please provide an email or phone number.' },
      { status: 400 }
    );
  }

  const notes = [interest ? `Interested in: ${interest}` : '', message]
    .filter(Boolean)
    .join('\n\n');

  try {
    const r = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        phone,
        businessName,
        message: notes,
        source: 'hexaspace',
      }),
    });

    if (!r.ok) {
      const detail = await r.text().catch(() => '');
      console.error('HexaHub form-submit failed', r.status, detail);
      return NextResponse.json(
        { error: 'Sorry — we couldn’t send your enquiry. Please email info@hexaspace.com.au.' },
        { status: 502 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('enquire proxy error', err);
    return NextResponse.json(
      { error: 'Sorry — we couldn’t send your enquiry. Please email info@hexaspace.com.au.' },
      { status: 502 }
    );
  }
}

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}
