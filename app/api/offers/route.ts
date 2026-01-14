import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/offers
 * Récupère les offres selon le rôle de l'utilisateur
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase non configuré' },
        { status: 503 }
      );
    }

    const cookieStore = await cookies();
    const userCookie = cookieStore.get('shamar_user');
    if (!userCookie) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const user = JSON.parse(Buffer.from(userCookie.value, 'base64').toString());
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const role = user.role;

    let query = supabase
      .from('offers')
      .select(`
        *,
        product:products(*),
        buyer:users!offers_buyer_id_fkey(id, email, full_name, company_name),
        seller:users!offers_seller_id_fkey(id, email, full_name, company_name)
      `);

    // Filtrage selon le rôle
    if (role === 'buyer') {
      query = query.eq('buyer_id', user.id);
    } else if (role === 'seller') {
      query = query.eq('seller_id', user.id);
    }
    // Admin voit tout (pas de filtre)

    if (status) {
      query = query.eq('status', status);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des offres' },
        { status: 500 }
      );
    }

    return NextResponse.json({ offers: data || [] });
  } catch (error) {
    console.error('GET /api/offers error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/offers
 * Crée une nouvelle offre (buyer uniquement)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase non configuré' },
        { status: 503 }
      );
    }

    const cookieStore = await cookies();
    const userCookie = cookieStore.get('shamar_user');
    if (!userCookie) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const user = JSON.parse(Buffer.from(userCookie.value, 'base64').toString());
    if (user.role !== 'buyer') {
      return NextResponse.json(
        { error: 'Seuls les acheteurs peuvent créer des offres' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { product_id, price, quantity, currency, message, expires_at } = body;

    if (!product_id || !price || !quantity) {
      return NextResponse.json(
        { error: 'product_id, price et quantity sont requis' },
        { status: 400 }
      );
    }

    // Récupération du produit pour obtenir le seller_id
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('seller_id')
      .eq('id', product_id)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .insert({
        product_id,
        buyer_id: user.id,
        seller_id: product.seller_id,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        currency: currency || 'FCFA',
        message: message || null,
        expires_at: expires_at || null,
        status: 'pending',
      })
      .select()
      .single();

    if (offerError) {
      console.error('Supabase error:', offerError);
      return NextResponse.json(
        { error: 'Erreur lors de la création de l\'offre' },
        { status: 500 }
      );
    }

    return NextResponse.json({ offer }, { status: 201 });
  } catch (error) {
    console.error('POST /api/offers error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

