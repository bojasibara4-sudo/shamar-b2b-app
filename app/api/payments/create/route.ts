import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { createStripePayment } from '@/services/payment.service';
import { isVendorVerified } from '@/lib/vendor-utils';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'buyer') {
    return NextResponse.json(
      { error: 'Accès refusé. Seuls les acheteurs peuvent effectuer des paiements.' },
      { status: 403 }
    );
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
    const { order_id } = body;

    if (!order_id) {
      return NextResponse.json(
        { error: 'order_id est requis' },
        { status: 400 }
      );
    }

    // Vérifier que la commande appartient au buyer
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, buyer_id, seller_id, total_amount, currency, status, payment_status')
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
        { error: 'Vous n\'êtes pas autorisé à payer cette commande' },
        { status: 403 }
      );
    }

    // Vérifier que le vendeur est vérifié
    const vendorVerified = await isVendorVerified(order.seller_id);
    if (!vendorVerified) {
      return NextResponse.json(
        { error: 'Le vendeur n\'est pas vérifié' },
        { status: 403 }
      );
    }

    // Vérifier que la commande n'est pas déjà payée
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id, status')
      .eq('order_id', order_id)
      .eq('status', 'paid')
      .single();

    if (existingPayment) {
      return NextResponse.json(
        { error: 'Cette commande a déjà été payée' },
        { status: 400 }
      );
    }

    // Vérifier que la commande est en statut PENDING
    if (order.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Seules les commandes en attente peuvent être payées' },
        { status: 400 }
      );
    }

    // Créer le paiement Stripe
    const result = await createStripePayment(
      order.id,
      user.id,
      order.seller_id,
      Number(order.total_amount),
      order.currency || 'FCFA'
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Erreur lors de la création du paiement' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        payment: result.payment,
        stripeSessionId: result.stripeSessionId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/payments/create:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}
