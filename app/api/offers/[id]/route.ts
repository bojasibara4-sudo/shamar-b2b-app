import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/offers/[id] — Détail d'une offre (buyer ou seller de l'offre)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const supabase = await createClient();
  const { data: offer, error } = await (supabase as any)
    .from('offers')
    .select(`
      *,
      product:products(id, name, description, price, currency, image_url, seller_id),
      buyer:users!offers_buyer_id_fkey(id, email, full_name, company_name),
      seller:users!offers_seller_id_fkey(id, email, full_name, company_name)
    `)
    .eq('id', id)
    .single();

  if (error || !offer) {
    return NextResponse.json({ error: 'Offre introuvable' }, { status: 404 });
  }

  if (offer.buyer_id !== user.id && offer.seller_id !== user.id) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  return NextResponse.json({ offer });
}

/**
 * PATCH /api/offers/[id] — Accepter, refuser ou contre-proposer (seller) ; accepter/refuser contre-offre (buyer)
 * Body: { action: 'accept' | 'reject' | 'counter', price?, quantity?, message? }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const supabase = await createClient();
  const { data: offer, error: fetchError } = await (supabase as any)
    .from('offers')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !offer) {
    return NextResponse.json({ error: 'Offre introuvable' }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const action = body.action as string;

  if (offer.seller_id === user.id) {
    // Vendeur : accept, reject, counter
    if (action === 'accept') {
      const { error: up } = await (supabase as any)
        .from('offers')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', id);
      if (up) return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 });
      return NextResponse.json({ offer: { ...offer, status: 'accepted' } });
    }
    if (action === 'reject') {
      const { error: up } = await (supabase as any)
        .from('offers')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .eq('id', id);
      if (up) return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 });
      return NextResponse.json({ offer: { ...offer, status: 'rejected' } });
    }
    if (action === 'counter') {
      const price = body.price != null ? Number(body.price) : offer.price;
      const quantity = body.quantity != null ? Number(body.quantity) : offer.quantity;
      const message = body.message ?? offer.message;
      if (price <= 0 || quantity <= 0) {
        return NextResponse.json({ error: 'Prix et quantité doivent être positifs' }, { status: 400 });
      }
      const { error: up } = await (supabase as any)
        .from('offers')
        .update({
          price,
          quantity,
          message: message || null,
          status: 'counter_offer',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      if (up) return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 });
      return NextResponse.json({ offer: { ...offer, price, quantity, message, status: 'counter_offer' } });
    }
  }

  if (offer.buyer_id === user.id) {
    // Acheteur : accept ou reject (la contre-offre du vendeur)
    if (action === 'accept') {
      const { error: up } = await (supabase as any)
        .from('offers')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', id);
      if (up) return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 });
      return NextResponse.json({ offer: { ...offer, status: 'accepted' } });
    }
    if (action === 'reject') {
      const { error: up } = await (supabase as any)
        .from('offers')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .eq('id', id);
      if (up) return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 });
      return NextResponse.json({ offer: { ...offer, status: 'rejected' } });
    }
  }

  return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
}
