import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/offers/[id]
 * Récupère une offre spécifique
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServerClient();
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

    const { data, error } = await supabase
      .from('offers')
      .select(`
        *,
        product:products(*),
        buyer:users!offers_buyer_id_fkey(id, email, full_name, company_name),
        seller:users!offers_seller_id_fkey(id, email, full_name, company_name)
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Offre non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ offer: data });
  } catch (error) {
    console.error('GET /api/offers/[id] error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/offers/[id]
 * Met à jour une offre (statut, etc.)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServerClient();
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
    const body = await request.json();
    const { status, price, quantity, message } = body;

    // Vérification que l'utilisateur peut modifier cette offre
    const { data: existingOffer, error: fetchError } = await supabase
      .from('offers')
      .select('buyer_id, seller_id')
      .eq('id', params.id)
      .single();

    if (fetchError || !existingOffer) {
      return NextResponse.json(
        { error: 'Offre non trouvée' },
        { status: 404 }
      );
    }

    if (
      user.role !== 'admin' &&
      existingOffer.buyer_id !== user.id &&
      existingOffer.seller_id !== user.id
    ) {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (quantity !== undefined) updateData.quantity = parseInt(quantity);
    if (message !== undefined) updateData.message = message;

    const { data, error } = await supabase
      .from('offers')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      );
    }

    return NextResponse.json({ offer: data });
  } catch (error) {
    console.error('PUT /api/offers/[id] error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

