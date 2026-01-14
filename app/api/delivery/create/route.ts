import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { createDelivery } from '@/services/delivery.service';
import { isVendorVerified } from '@/lib/vendor-utils';

export async function POST(request: NextRequest) {
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
    // Vérifier que le vendeur est vérifié
    const vendorVerified = await isVendorVerified(user.id);
    if (!vendorVerified) {
      return NextResponse.json(
        { error: 'Vous devez être vérifié pour créer une livraison' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { order_id, method, shipping_address } = body;

    if (!order_id || !method) {
      return NextResponse.json(
        { error: 'order_id et method sont requis' },
        { status: 400 }
      );
    }

    // Vérifier que la commande appartient au vendeur
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, buyer_id, seller_id, currency')
      .eq('id', order_id)
      .eq('seller_id', user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier qu'une livraison n'existe pas déjà
    const { data: existing } = await supabase
      .from('deliveries')
      .select('id')
      .eq('order_id', order_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Une livraison existe déjà pour cette commande' },
        { status: 400 }
      );
    }

    const delivery = await createDelivery(
      order_id,
      user.id,
      order.buyer_id,
      method as 'standard' | 'express' | 'pickup',
      shipping_address,
      order.currency || 'FCFA'
    );

    if (!delivery) {
      return NextResponse.json(
        { error: 'Erreur lors de la création de la livraison' },
        { status: 500 }
      );
    }

    return NextResponse.json({ delivery }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/delivery/create:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la livraison' },
      { status: 500 }
    );
  }
}
