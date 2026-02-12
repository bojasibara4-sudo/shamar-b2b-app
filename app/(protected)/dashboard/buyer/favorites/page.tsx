import { requireBuyer } from '@/lib/auth-guard';
import { AuthGuard } from '@/components/AuthGuard';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Heart, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BuyerFavoritesPage() {
  const user = await requireBuyer();
  const supabase = await createClient();

  // Récupérer les favoris si la table existe
  let favorites: any[] = [];
  try {
    const { data } = await (supabase as any)
      .from('favorites')
      .select('*, product:products(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    favorites = data || [];
  } catch {
    // Table favorites peut ne pas exister
  }

  return (
    <AuthGuard requiredRole="buyer">
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <div className="flex items-center gap-shamar-16 mb-2">
              <div className="p-3 bg-primary-100 rounded-shamar-md">
                <Heart className="text-primary-600" size={32} />
              </div>
              <div>
                <h1 className="text-shamar-h1 text-gray-900 tracking-tight">
                  Mes <span className="text-primary-600">favoris</span>
                </h1>
                <p className="text-shamar-body text-gray-500 font-medium mt-1">
                  Produits sauvegardés
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-32">
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-shamar-24">
                {favorites.map((fav: any) => {
                  const product = fav.product || fav;
                  return (
                    <Link
                      key={fav.id || product.id}
                      href={`/products/${product.id}`}
                      className="block bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden hover:shadow-shamar-soft hover:border-gray-300 transition-all"
                    >
                      <div className="h-36 bg-gray-100 flex items-center justify-center">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                      <div className="p-shamar-16">
                        <h3 className="font-semibold text-gray-900 text-shamar-body line-clamp-2">{product.name}</h3>
                        <p className="text-primary-600 font-semibold mt-2 text-shamar-body">{product.price?.toLocaleString()} {product.currency || 'FCFA'}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-shamar-48">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-shamar-24">
                  <Heart className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium text-shamar-body">Aucun favori pour le moment.</p>
                <p className="text-gray-500 text-shamar-small mt-2">Explorez le catalogue pour ajouter des coups de cœur.</p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 mt-shamar-24 text-primary-600 font-semibold hover:underline"
                >
                  Explorer le catalogue →
                </Link>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </AuthGuard>
  );
}
