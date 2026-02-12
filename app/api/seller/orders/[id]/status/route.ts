import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { updateOrderStatus } from '@/services/order.service';

export const dynamic = 'force-dynamic';

/**
 * PUT /api/seller/orders/[id]/status — Met à jour le statut d'une commande (vendeur, ses commandes uniquement)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }
  if (user.role !== 'seller') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const { id: orderId } = await params;
  if (!orderId) {
    return NextResponse.json({ error: 'order_id requis' }, { status: 400 });
  }

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body JSON invalide' }, { status: 400 });
  }
  const status = body.status;
  if (!status) {
    return NextResponse.json({ error: 'status requis' }, { status: 400 });
  }

  const result = await updateOrderStatus(orderId, status, user.id, user.role);
  if (!result.success) {
    const code =
      result.error === 'Commande non trouvée'
        ? 404
        : result.error === 'Accès refusé'
          ? 403
          : 400;
    return NextResponse.json({ error: result.error }, { status: code });
  }
  return NextResponse.json({ success: true });
}
