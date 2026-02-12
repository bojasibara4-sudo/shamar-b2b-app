/**
 * PUT /api/escrow/shipped
 * Vendeur marque comme expédié
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdminLike } from '@/lib/owner-roles';
import { getEscrowByOrderId, markShipped } from '@/services/escrow.service';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'seller' && !isAdminLike(user.role)) {
    return NextResponse.json({ error: 'Seul le vendeur peut marquer comme expédié' }, { status: 403 });
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

    const success = await markShipped(escrow.id, user.id, isAdminLike(user.role));
    if (!success) {
      return NextResponse.json(
        { error: 'Impossible de marquer comme expédié (statut invalide ou non autorisé)' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, status: 'SHIPPED' });
  } catch (error) {
    console.error('Error in PUT /api/escrow/shipped:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
