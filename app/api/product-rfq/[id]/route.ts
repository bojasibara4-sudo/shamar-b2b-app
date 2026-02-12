import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/product-rfq/[id] — Détail d'une RFQ (buyer ou seller)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const supabase = await createClient();
  const { data: rfq, error } = await (supabase as any)
    .from('product_rfqs')
    .select(`
      *,
      product:products(id, name, description, price, currency, image_url, seller_id),
      buyer:users!product_rfqs_buyer_id_fkey(id, email, full_name, company_name),
      seller:users!product_rfqs_seller_id_fkey(id, email, full_name, company_name)
    `)
    .eq('id', id)
    .single();

  if (error || !rfq) return NextResponse.json({ error: 'RFQ introuvable' }, { status: 404 });
  if (rfq.buyer_id !== user.id && rfq.seller_id !== user.id) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }
  return NextResponse.json({ rfq });
}

/**
 * PATCH /api/product-rfq/[id] — Vendeur : proposer un devis (quote). Acheteur : accepter/refuser
 * Body: { action: 'quote' | 'accept' | 'reject', quote_price?, quote_message? }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const supabase = await createClient();
  const { data: rfq, error: fetchError } = await (supabase as any)
    .from('product_rfqs')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !rfq) return NextResponse.json({ error: 'RFQ introuvable' }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const action = body.action as string;

  if (rfq.seller_id === user.id && action === 'quote') {
    const quote_price = body.quote_price != null ? Number(body.quote_price) : null;
    const quote_message = body.quote_message ?? null;
    if (quote_price != null && quote_price <= 0) {
      return NextResponse.json({ error: 'Prix invalide' }, { status: 400 });
    }
    const { error: up } = await (supabase as any)
      .from('product_rfqs')
      .update({
        quote_price: quote_price ?? rfq.quote_price,
        quote_message: quote_message ?? rfq.quote_message,
        status: 'quoted',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    if (up) return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 });
    return NextResponse.json({ rfq: { ...rfq, quote_price: quote_price ?? rfq.quote_price, quote_message: quote_message ?? rfq.quote_message, status: 'quoted' } });
  }

  if (rfq.buyer_id === user.id && (action === 'accept' || action === 'reject')) {
    const status = action === 'accept' ? 'accepted' : 'rejected';
    const { error: up } = await (supabase as any)
      .from('product_rfqs')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (up) return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 });
    return NextResponse.json({ rfq: { ...rfq, status } });
  }

  return NextResponse.json({ error: 'Action non autorisée' }, { status: 403 });
}
