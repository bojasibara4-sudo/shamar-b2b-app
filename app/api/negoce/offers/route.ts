import { NextRequest, NextResponse } from 'next/server';
import { getNegoceOffers } from '@/services/negoce.service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      type: searchParams.get('type') ?? undefined,
      country: searchParams.get('country') ?? undefined,
      product: searchParams.get('product') ?? undefined,
      minMoq: searchParams.get('minMoq') ? Number(searchParams.get('minMoq')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      incoterm: searchParams.get('incoterm') ?? undefined,
      certification: searchParams.get('certification') ?? undefined,
    };
    const offers = await getNegoceOffers(filters);
    return NextResponse.json({ offers });
  } catch (error) {
    console.error('GET /api/negoce/offers:', error);
    return NextResponse.json({ error: 'Erreur', offers: [] }, { status: 500 });
  }
}
