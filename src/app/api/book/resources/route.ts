import { NextResponse } from 'next/server';
import { getBookableResources } from '@/lib/rnd';

// Live bookable rooms + studios (from the RND `spaces` table when configured,
// else the static fallback list). The calendar uses these ids end-to-end.
export async function GET() {
  const resources = await getBookableResources();
  return NextResponse.json({ resources });
}
