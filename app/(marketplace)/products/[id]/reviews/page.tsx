import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductReviewsClient from '@/components/marketplace/ProductReviewsClient';

export const dynamic = 'force-dynamic';

export default async function ProductReviewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await (supabase as any)
    .from('products')
    .select('id, name')
    .eq('id', id)
    .single();

  if (!product) notFound();

  const { data: reviews } = await (supabase as any)
    .from('product_reviews')
    .select('id, product_id, buyer_id, rating, comment, created_at')
    .eq('product_id', id)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  const list = reviews || [];
  const average = list.length
    ? Math.round((list.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / list.length) * 10) / 10
    : 0;
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  list.forEach((r: { rating: number }) => {
    if (r.rating >= 1 && r.rating <= 5) distribution[r.rating as 1|2|3|4|5]++;
  });

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <Link href={`/products/${id}`} className="text-shamar-small font-medium text-gray-500 hover:text-primary-600">
            ← Retour au produit
          </Link>
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight">
            Avis — {product.name}
          </h1>
          <ProductReviewsClient
            productId={id}
            initialReviews={list}
            initialAverage={average}
            initialTotal={list.length}
            distribution={distribution}
          />
        </div>
      </div>
    </div>
  );
}
