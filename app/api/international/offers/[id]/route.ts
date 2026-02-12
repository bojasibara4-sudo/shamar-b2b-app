import { NextRequest, NextResponse } from 'next/server';
import { getInternationalOffer } from '@/services/international.service';

export const dynamic = 'force-dynamic';

/** GET - Offre par ID */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const offer = await getInternationalOffer(id);
    if (!offer) {
      return NextResponse.json({ error: 'Offre introuvable' }, { status: 404 });
    }
    return NextResponse.json({ offer });
  } catch (error) {
    console.error('GET /api/international/offers/[id]:', error);
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}
