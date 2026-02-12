import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/product-reviews/create — Créer un avis sur un produit (acheteur)
 */
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }
  if (user.role !== 'buyer') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { product_id, order_id, rating, comment } = body;

    if (!product_id || !rating) {
      return NextResponse.json(
        { error: 'product_id et rating sont requis' },
        { status: 400 }
      );
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'La note doit être entre 1 et 5' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: product } = await (supabase as any)
      .from('products')
      .select('id, seller_id')
      .eq('id', product_id)
      .single();

    if (!product) {
      return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });
    }

    const { error: insertError } = await (supabase as any)
      .from('product_reviews')
      .insert({
        product_id,
        order_id: order_id || null,
        buyer_id: user.id,
        rating: Number(rating),
        comment: comment || null,
        status: 'published',
      });

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'Vous avez déjà laissé un avis sur ce produit' },
          { status: 400 }
        );
      }
      console.error('Error creating product review:', insertError);
      return NextResponse.json(
        { error: 'Erreur lors de la création de l\'avis' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('POST /api/product-reviews/create:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
