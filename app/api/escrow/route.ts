/**
 * GET /api/escrow?order_id=xxx
 * Récupère l'escrow d'une commande
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdminLike } from '@/lib/owner-roles';
import { getEscrowByOrderId } from '@/services/escrow.service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const orderId = request.nextUrl.searchParams.get('order_id');
  if (!orderId) {
    return NextResponse.json({ error: 'order_id requis' }, { status: 400 });
  }

  const escrow = await getEscrowByOrderId(orderId);
  if (!escrow) {
    return NextResponse.json({ error: 'Escrow non trouvé' }, { status: 404 });
  }

  if (escrow.buyer_id !== user.id && escrow.seller_id !== user.id && !isAdminLike(user.role)) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  return NextResponse.json({ escrow });
}
