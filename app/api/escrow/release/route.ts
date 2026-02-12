/**
 * POST /api/escrow/release
 * Débloque les fonds au vendeur (admin ou automatique après DELIVERED)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdminLike } from '@/lib/owner-roles';
import { getEscrowByOrderId, releaseEscrow } from '@/services/escrow.service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
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

    // Seul admin ou le vendeur (après DELIVERED) peut déclencher le release
    if (!isAdminLike(user.role) && escrow.seller_id !== user.id) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const success = await releaseEscrow(escrow.id);
    if (!success) {
      return NextResponse.json(
        { error: 'Impossible de débloquer les fonds (statut invalide)' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, status: 'RELEASED' });
  } catch (error) {
    console.error('Error in POST /api/escrow/release:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
