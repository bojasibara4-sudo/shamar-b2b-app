import { NextRequest, NextResponse } from 'next/server';
import { getNegoceOffer } from '@/services/negoce.service';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const offer = await getNegoceOffer(id);
    if (!offer) return NextResponse.json({ error: 'Offre introuvable' }, { status: 404 });
    return NextResponse.json({ offer });
  } catch (error) {
    console.error('GET /api/negoce/offers/[id]:', error);
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}
