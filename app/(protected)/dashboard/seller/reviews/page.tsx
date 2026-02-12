import { requireSeller } from '@/lib/auth-guard';
import { AuthGuard } from '@/components/AuthGuard';
import { createClient } from '@/lib/supabase/server';
import { Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SellerReviewsPage() {
  const user = await requireSeller();

  const supabase = await createClient();
  const { data: reviews } = await (supabase as any)
    .from('reviews')
    .select(`
      *,
      order:orders!reviews_order_id_fkey(id),
      buyer:users!reviews_buyer_id_fkey(full_name, company_name)
    `)
    .eq('vendor_id', user.id)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  return (
    <AuthGuard requiredRole="seller">
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <div className="flex items-center gap-shamar-16 mb-2">
              <div className="p-3 bg-primary-100 rounded-shamar-md">
                <Star className="text-primary-600" size={32} />
              </div>
              <div>
                <h1 className="text-shamar-h1 text-gray-900 tracking-tight">
                  Avis <span className="text-primary-600">reçus</span>
                </h1>
                <p className="text-shamar-body text-gray-500 font-medium mt-1">
                  Les avis laissés par vos acheteurs
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-32">
            <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-shamar-16">Avis reçus</h2>
            {(!reviews || reviews.length === 0) ? (
              <div className="text-center py-shamar-48">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-shamar-24">
                  <Star className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium text-shamar-body">Aucun avis pour le moment.</p>
                <p className="text-gray-500 text-shamar-small mt-2">Invitez vos clients à laisser un commentaire après achat.</p>
              </div>
            ) : (
              <div className="space-y-0 divide-y divide-gray-200">
                {(reviews || []).map((r: any) => (
                  <div key={r.id} className="py-shamar-16 first:pt-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex text-primary-500">
                        {[1,2,3,4,5].map((n) => (
                          <Star key={n} size={16} className={n <= (r.rating || 0) ? 'fill-current' : 'opacity-30'} />
                        ))}
                      </div>
                      <span className="text-gray-500 text-shamar-small">Acheteur</span>
                    </div>
                    {r.comment && <p className="text-gray-600 text-shamar-small">{r.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </AuthGuard>
  );
}
