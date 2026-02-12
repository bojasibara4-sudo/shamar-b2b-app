import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'seller') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const supabase = await createClient();

  try {
    const { data: products, error } = await (supabase as any)
      .from('products')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching seller products:', error);
      return NextResponse.json({ products: [] });
    }

    return NextResponse.json({ products: products || [] });
  } catch (error) {
    console.error('Error in GET /api/seller/products:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'seller') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const supabase = await createClient();

  try {
    const body = await request.json();
    const { name, description, price, category, currency, image_url, shop_id, specifications, price_tiers, min_order_quantity } = body;

    if (!name || !description || price === undefined) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { error: 'Le prix doit être un nombre positif' },
        { status: 400 }
      );
    }

    // Récupérer la boutique du seller (obligatoire pour créer un produit)
    let finalShopId = shop_id;
    
    if (!finalShopId) {
      // Si shop_id n'est pas fourni, récupérer la première boutique active du seller
      const { data: shops, error: shopsError } = await (supabase as any)
        .from('shops')
        .select('id')
        .eq('seller_id', user.id)
        .in('status', ['draft', 'pending', 'verified'])
        .limit(1)
        .single();

      if (shopsError || !shops) {
        return NextResponse.json(
          { error: 'Vous devez créer une boutique avant de pouvoir ajouter des produits. Veuillez créer une boutique d\'abord.' },
          { status: 400 }
        );
      }

      finalShopId = shops.id;
    } else {
      // Vérifier que la boutique appartient bien au seller
      const { data: shop, error: shopError } = await (supabase as any)
        .from('shops')
        .select('id, seller_id')
        .eq('id', finalShopId)
        .eq('seller_id', user.id)
        .single();

      if (shopError || !shop) {
        return NextResponse.json(
          { error: 'Boutique non trouvée ou vous n\'avez pas accès à cette boutique' },
          { status: 403 }
        );
      }
    }

    // Créer le produit avec shop_id obligatoire
    const { data: product, error } = await (supabase as any)
      .from('products')
      .insert({
        name,
        description,
        price: Number(price),
        seller_id: user.id,
        shop_id: finalShopId,
        category: category || 'other',
        currency: currency || 'FCFA',
        image_url: image_url || null,
        status: 'active',
        specifications: specifications && typeof specifications === 'object' ? specifications : {},
        price_tiers: Array.isArray(price_tiers) ? price_tiers : [],
        min_order_quantity: typeof min_order_quantity === 'number' && min_order_quantity >= 1 ? min_order_quantity : 1,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la création du produit' },
        { status: 500 }
      );
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/seller/products:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création' },
      { status: 500 }
    );
  }
}

