import { requireBuyer } from '@/lib/auth-guard';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BuyerReviewsPage() {
  await requireBuyer();
  const supabase = await createClient();

  const { data } = await supabase.auth.getSession();
  const userId = data?.session?.user?.id;
  if (!userId) {
    return (
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
          <p className="text-gray-500 text-shamar-body">Non connecté.</p>
        </div>
      </div>
    );
  }

  const { data: orderReviews } = await (supabase as any)
    .from('reviews')
    .select(`
      id,
      order_id,
      vendor_id,
      rating,
      comment,
      created_at,
      order:orders!reviews_order_id_fkey(id, total_amount)
    `)
    .eq('buyer_id', userId)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  let productReviews: any[] = [];
  try {
    const { data } = await (supabase as any)
      .from('product_reviews')
      .select('id, product_id, rating, comment, created_at')
      .eq('buyer_id', userId)
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    productReviews = data || [];
  } catch {
    // table product_reviews peut être absente avant migration
  }

  const list = [
    ...(orderReviews || []).map((r: any) => ({ ...r, type: 'order' as const })),
    ...(productReviews || []).map((r: any) => ({ ...r, type: 'product' as const })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <Link href="/dashboard/buyer" className="text-shamar-small font-medium text-primary-600 hover:underline">
              ← Tableau de bord
            </Link>
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight mt-2 mb-2">
              Avis <span className="text-primary-600">donnés</span>
            </h1>
            <p className="text-shamar-body text-gray-500 font-medium">
              Historique de vos avis (commandes et produits)
            </p>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-32">
            {list.length > 0 ? (
              <ul className="space-y-0 divide-y divide-gray-200">
                {list.map((r: any) => (
                  <li key={r.id} className="py-shamar-24 first:pt-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex text-primary-500">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star key={n} size={16} className={n <= (r.rating || 0) ? 'fill-current' : 'opacity-30'} />
                        ))}
                      </div>
                      <span className="text-gray-400 text-shamar-small font-medium">
                        {r.type === 'order' ? 'Avis commande' : 'Avis produit'}
                      </span>
                      {r.type === 'product' && r.product_id && (
                        <Link href={`/products/${r.product_id}`} className="text-shamar-small text-primary-600 hover:underline font-medium">
                          Voir le produit
                        </Link>
                      )}
                    </div>
                    {r.comment && <p className="text-gray-600 text-shamar-small mt-1">{r.comment}</p>}
                    <p className="text-gray-400 text-shamar-caption mt-1 font-medium">{new Date(r.created_at).toLocaleDateString('fr-FR')}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-shamar-48">
                <Star className="mx-auto h-12 w-12 text-gray-300 mb-shamar-16" />
                <p className="text-gray-500 font-medium text-shamar-body">Vous n&apos;avez pas encore laissé d&apos;avis.</p>
                <Link href="/products" className="mt-shamar-16 inline-block text-primary-600 font-semibold hover:underline text-shamar-body">
                  Parcourir le catalogue
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
