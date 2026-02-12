/**
 * PUT /api/escrow/delivered
 * Acheteur confirme réception
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getEscrowByOrderId, markDelivered } from '@/services/escrow.service';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { order_id } = body;

    if (!order_id) {
      return NextResponse.json({ error: 'order_id requis' }, { status: 400 });
    }

    const escrow = await getEscrowByOrderId(order_id);
    if (!escrow) {
      return NextResponse.json({ error: 'Escrow non trouvé' }, { status: 404 });
    }

    const success = await markDelivered(escrow.id, user.id);
    if (!success) {
      return NextResponse.json(
        { error: 'Impossible de confirmer la livraison (statut invalide ou non autorisé)' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, status: 'DELIVERED' });
  } catch (error) {
    console.error('Error in PUT /api/escrow/delivered:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
