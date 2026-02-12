import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/product-reviews?product_id=xxx — Liste des avis d'un produit (public)
 */
export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get('product_id');
    if (!productId) {
      return NextResponse.json({ error: 'product_id requis' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: reviews, error } = await (supabase as any)
      .from('product_reviews')
      .select(`
        id,
        product_id,
        buyer_id,
        rating,
        comment,
        status,
        created_at
      `)
      .eq('product_id', productId)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching product reviews:', error);
      return NextResponse.json({ error: 'Erreur lors de la récupération des avis' }, { status: 500 });
    }

    const list = reviews || [];
    const avg = list.length
      ? list.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / list.length
      : 0;
    const counts = [1, 2, 3, 4, 5].map((star) => list.filter((r: { rating: number }) => r.rating === star).length);

    return NextResponse.json({
      reviews: list,
      average: Math.round(avg * 10) / 10,
      total: list.length,
      distribution: { 1: counts[0], 2: counts[1], 3: counts[2], 4: counts[3], 5: counts[4] },
    });
  } catch (err) {
    console.error('GET /api/product-reviews:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
