/**
 * POST /api/delivery/confirm-receipt
 * Acheteur confirme réception → livraison delivered + escrow DELIVERED (déblocage)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { confirmDeliveryReceipt } from '@/services/delivery.service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  try {
    const body = await request.json();
    const { delivery_id } = body;
    if (!delivery_id) return NextResponse.json({ error: 'delivery_id requis' }, { status: 400 });

    const result = await confirmDeliveryReceipt(delivery_id, user.id);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error || 'Erreur' },
        { status: result.error === 'Accès refusé' ? 403 : result.error === 'Livraison introuvable' ? 404 : 400 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/delivery/confirm-receipt:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
