import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { createReview } from '@/services/review.service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'buyer') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Configuration Supabase manquante' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { order_id, rating, comment } = body;

    if (!order_id || !rating) {
      return NextResponse.json(
        { error: 'order_id et rating sont requis' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'La note doit être entre 1 et 5' },
        { status: 400 }
      );
    }

    // Vérifier que la commande appartient au buyer
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, buyer_id, seller_id, status')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    if (order.buyer_id !== user.id) {
      return NextResponse.json(
        { error: 'Vous n\'êtes pas autorisé à noter cette commande' },
        { status: 403 }
      );
    }

    // Vérifier que la commande est livrée
    if (order.status !== 'DELIVERED') {
      return NextResponse.json(
        { error: 'Seules les commandes livrées peuvent être notées' },
        { status: 400 }
      );
    }

    const review = await createReview(
      order_id,
      user.id,
      order.seller_id,
      rating,
      comment
    );

    if (!review) {
      return NextResponse.json(
        { error: 'Erreur lors de la création de l\'avis. Un avis existe peut-être déjà pour cette commande.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/reviews/create:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'avis' },
      { status: 500 }
    );
  }
}
