import { NextRequest, NextResponse } from 'next/server';
import { rndConfigured, rndSelect } from '@/lib/rnd';

// Does a member already exist for this email? Drives the "welcome back / log in"
// prompt in the booking flow. Case-insensitive match on the members table.
export async function POST(req: NextRequest) {
  let email = '';
  try {
    email = String((await req.json())?.email ?? '').trim();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (!email) return NextResponse.json({ exists: false });
  if (!rndConfigured()) return NextResponse.json({ exists: false });

  try {
    const rows = await rndSelect(
      'members',
      `select=id&data->>email=ilike.${encodeURIComponent(email)}`
    );
    return NextResponse.json({ exists: rows.length > 0 });
  } catch (err) {
    console.error('check-account error', err);
    return NextResponse.json({ exists: false });
  }
}
