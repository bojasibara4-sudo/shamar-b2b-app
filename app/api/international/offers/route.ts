import { NextRequest, NextResponse } from 'next/server';
import { getInternationalOffers } from '@/services/international.service';

export const dynamic = 'force-dynamic';

/** GET - Liste des offres (catalogue public) */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      country: searchParams.get('country') ?? undefined,
      product: searchParams.get('product') ?? undefined,
      minMoq: searchParams.get('minMoq') ? Number(searchParams.get('minMoq')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      incoterm: searchParams.get('incoterm') ?? undefined,
      maxLeadTime: searchParams.get('maxLeadTime') ? Number(searchParams.get('maxLeadTime')) : undefined,
      certification: searchParams.get('certification') ?? undefined,
    };
    const offers = await getInternationalOffers(filters);
    return NextResponse.json({ offers });
  } catch (error) {
    console.error('GET /api/international/offers:', error);
    return NextResponse.json({ error: 'Erreur', offers: [] }, { status: 500 });
  }
}
