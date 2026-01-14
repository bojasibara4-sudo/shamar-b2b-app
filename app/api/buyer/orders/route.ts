import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET() {
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
    // Récupérer les commandes de l'acheteur avec les items et produits
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items:order_items(
          *,
          product:products(*)
        ),
        seller:users!orders_seller_id_fkey(email, full_name, company_name)
      `)
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des commandes' },
        { status: 500 }
      );
    }

    return NextResponse.json({ orders: orders || [] });
  } catch (error) {
    console.error('Error in GET /api/buyer/orders:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    );
  }
}

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
    const { products: orderProducts } = body;

    if (!Array.isArray(orderProducts) || orderProducts.length === 0) {
      return NextResponse.json(
        { error: 'Au moins un produit est requis' },
        { status: 400 }
      );
    }

    // Valider les produits et calculer le total
    let totalAmount = 0;
    let sellerId: string | null = null;
    let currency = 'FCFA';
    const validatedItems: Array<{ product_id: string; quantity: number; price: number }> = [];

    for (const item of orderProducts) {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', item.productId)
        .single();

      if (productError || !product) {
        return NextResponse.json(
          { error: `Produit ${item.productId} non trouvé` },
          { status: 404 }
        );
      }

      // Vérifier que le produit est actif
      if (product.status !== 'active') {
        return NextResponse.json(
          { error: `Le produit ${product.name} n'est pas disponible` },
          { status: 400 }
        );
      }

      // Utiliser le seller_id du premier produit (pour simplifier, une commande = un vendeur)
      if (!sellerId) {
        sellerId = product.seller_id;
        currency = product.currency || 'FCFA';
      } else if (sellerId !== product.seller_id) {
        return NextResponse.json(
          { error: 'Tous les produits doivent provenir du même vendeur' },
          { status: 400 }
        );
      }

      const quantity = item.quantity || 1;
      const itemPrice = Number(product.price);
      const itemTotal = itemPrice * quantity;
      totalAmount += itemTotal;

      validatedItems.push({
        product_id: product.id,
        quantity,
        price: itemPrice,
      });
    }

    if (!sellerId) {
      return NextResponse.json(
        { error: 'Aucun vendeur trouvé' },
        { status: 400 }
      );
    }

    // Créer la commande
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_id: user.id,
        seller_id: sellerId,
        total_amount: totalAmount,
        currency,
        status: 'PENDING', // Statut en majuscules selon le schéma
        payment_status: 'pending',
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Erreur lors de la création de la commande' },
        { status: 500 }
      );
    }

    // Créer les order_items
    const orderItems = validatedItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Rollback: supprimer la commande créée
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json(
        { error: 'Erreur lors de la création des items de commande' },
        { status: 500 }
      );
    }

    // Récupérer la commande complète avec les items
    const { data: completeOrder, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('id', order.id)
      .single();

    if (fetchError || !completeOrder) {
      return NextResponse.json({ order }, { status: 201 });
    }

    return NextResponse.json({ order: completeOrder }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/buyer/orders:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    );
  }
}

