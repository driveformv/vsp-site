import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

// Map Sanity document types to ISR cache tags
const typeToTags: Record<string, string[]> = {
  event: ['event'],
  newsPost: ['newsPost'],
  sponsor: ['sponsor'],
  raceClass: ['raceClass'],
  siteSettings: ['siteSettings'],
  firstTimerGuide: ['firstTimerGuide'],
  navigation: ['navigation'],
};

export async function POST(request: NextRequest) {
  // Verify webhook secret
  const secret = request.headers.get('x-sanity-webhook-secret');
  if (!SANITY_WEBHOOK_SECRET || secret !== SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { _type } = body;

    const tags = typeToTags[_type];
    if (!tags) {
      return NextResponse.json({ message: `No tags for type: ${_type}` }, { status: 200 });
    }

    for (const tag of tags) {
      revalidateTag(tag, { expire: 0 });
    }

    return NextResponse.json({
      revalidated: true,
      tags,
      type: _type,
    });
  } catch (err) {
    return NextResponse.json(
      { message: 'Error revalidating', error: String(err) },
      { status: 500 }
    );
  }
}
