import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'seller') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Configuration Supabase manquante' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Le statut est requis' },
        { status: 400 }
      );
    }

    // Statuts valides selon le schéma Supabase
    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      );
    }

    // Vérifier que la commande appartient bien au vendeur
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, seller_id')
      .eq('id', params.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    if (order.seller_id !== user.id) {
      return NextResponse.json(
        { error: 'Vous n\'êtes pas autorisé à modifier cette commande' },
        { status: 403 }
      );
    }

    // Mettre à jour le statut
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError || !updatedOrder) {
      console.error('Error updating order status:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du statut' },
        { status: 500 }
      );
    }

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error('Error in PUT /api/seller/orders/[id]/status:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}
