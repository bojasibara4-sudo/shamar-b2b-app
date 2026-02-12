import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/product-rfq?product_id=xxx — Liste des RFQ pour un produit (seller) ou pour le buyer
 * GET /api/product-rfq?buyer=1 — Mes RFQ (buyer)
 * GET /api/product-rfq?seller=1 — RFQ reçues (seller)
 */
export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('product_id');
  const buyer = searchParams.get('buyer');
  const seller = searchParams.get('seller');

  let query = (supabase as any)
    .from('product_rfqs')
    .select(`
      *,
      product:products(id, name, price, currency, image_url),
      buyer:users!product_rfqs_buyer_id_fkey(id, email, full_name, company_name),
      seller:users!product_rfqs_seller_id_fkey(id, email, full_name, company_name)
    `)
    .order('created_at', { ascending: false });

  if (productId) query = query.eq('product_id', productId);
  if (buyer) query = query.eq('buyer_id', user.id);
  if (seller) query = query.eq('seller_id', user.id);

  const { data, error } = await query;
  if (error) {
    console.error('GET product-rfq:', error);
    return NextResponse.json({ error: 'Erreur', rfqs: [] }, { status: 500 });
  }
  return NextResponse.json({ rfqs: data || [] });
}

/**
 * POST /api/product-rfq — Créer une demande de devis (buyer)
 * Body: { product_id, quantity, specifications?, message? }
 */
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  if (user.role !== 'buyer') return NextResponse.json({ error: 'Réservé aux acheteurs' }, { status: 403 });

  const supabase = await createClient();
  const body = await request.json().catch(() => ({}));
  const { product_id, quantity, specifications, message } = body;

  if (!product_id || !quantity || quantity < 1) {
    return NextResponse.json({ error: 'product_id et quantity requis' }, { status: 400 });
  }

  const { data: product } = await (supabase as any)
    .from('products')
    .select('seller_id')
    .eq('id', product_id)
    .single();

  if (!product) return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });

  const { data: rfq, error } = await (supabase as any)
    .from('product_rfqs')
    .insert({
      product_id,
      buyer_id: user.id,
      seller_id: product.seller_id,
      quantity: Number(quantity),
      specifications: specifications && typeof specifications === 'object' ? specifications : {},
      message: message || null,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('POST product-rfq:', error);
    return NextResponse.json({ error: 'Erreur création RFQ' }, { status: 500 });
  }
  return NextResponse.json({ rfq }, { status: 201 });
}
