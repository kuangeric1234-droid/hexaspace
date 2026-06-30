import { NextRequest, NextResponse } from 'next/server';
import { rndConfigured, rndSelect } from '@/lib/rnd';

type RndBooking = {
  resourceId?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
};

// Existing (non-cancelled) bookings for a given day, so the calendar greys out
// taken slots. Keyed by the RND space id (same ids /api/book/resources returns).
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date') ?? '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date.' }, { status: 400 });
  }
  if (!rndConfigured()) return NextResponse.json({ bookings: [] });

  try {
    const rows = await rndSelect<RndBooking>(
      'bookings',
      `select=data&data->>date=eq.${date}`
    );
    const bookings = rows
      .map((r) => r.data)
      .filter((b) => b && b.startTime && b.endTime && b.status !== 'Cancelled')
      .map((b) => ({
        resourceId: b.resourceId ?? '',
        date,
        startTime: b.startTime as string,
        endTime: b.endTime as string,
        status: b.status ?? 'Confirmed',
      }));
    return NextResponse.json({ bookings });
  } catch (err) {
    console.error('availability error', err);
    return NextResponse.json({ bookings: [] });
  }
}
