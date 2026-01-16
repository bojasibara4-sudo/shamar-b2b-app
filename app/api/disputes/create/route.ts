import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { createDispute } from '@/services/dispute.service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const supabase = await createClient();

  try {
    const body = await request.json();
    const { order_id, reason, description } = body;

    if (!order_id || !reason) {
      return NextResponse.json(
        { error: 'order_id et reason sont requis' },
        { status: 400 }
      );
    }

    // Vérifier que la commande appartient au buyer ou seller
    const { data: order, error: orderError } = await (supabase as any)
      .from('orders')
      .select('id, buyer_id, seller_id')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    const orderData = order as any;
    const isBuyer = orderData.buyer_id === user.id;
    const isSeller = orderData.seller_id === user.id;

    if (!isBuyer && !isSeller) {
      return NextResponse.json(
        { error: 'Vous n\'êtes pas autorisé à créer un litige pour cette commande' },
        { status: 403 }
      );
    }

    const againstUser = isBuyer ? orderData.seller_id : orderData.buyer_id;

    const dispute = await createDispute(
      order_id,
      user.id,
      againstUser,
      reason,
      description
    );

    if (!dispute) {
      return NextResponse.json(
        { error: 'Erreur lors de la création du litige' },
        { status: 500 }
      );
    }

    return NextResponse.json({ dispute }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/disputes/create:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du litige' },
      { status: 500 }
    );
  }
}
