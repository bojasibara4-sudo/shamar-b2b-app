import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { Heart, Package, Repeat } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProfileFavoritesPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  let favorites: any[] = [];
  if (user.role === 'buyer' || user.role === 'admin') {
    const supabase = await createClient();
    try {
      const { data } = await (supabase as any)
        .from('favorites')
        .select('*, product:products(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      favorites = data || [];
    } catch {
      favorites = [];
    }
  }

  return (
    <div className="max-w-shamar-container mx-auto px-4 py-shamar-24">
      <Link href="/profile" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 mb-shamar-24">← Retour Pour moi</Link>
      <h1 className="text-shamar-h2 text-gray-900">Favoris</h1>
      <p className="text-shamar-body text-gray-500 mt-1">Produits sauvegardés.</p>

      {user.role !== 'buyer' && user.role !== 'admin' ? (
        <div className="mt-shamar-24 bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 text-center shadow-shamar-soft">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-shamar-16">
            <Heart size={28} className="text-gray-400" />
          </div>
          <p className="text-gray-700 font-medium text-shamar-body">Favoris en mode Acheteur</p>
          <p className="text-gray-500 text-shamar-small mt-1">Les favoris sont disponibles lorsque vous utilisez le site en mode Acheteur.</p>
          <Link href="/profile/roles" className="inline-flex items-center gap-2 mt-shamar-16 text-primary-600 font-medium hover:underline text-shamar-body">
            <Repeat size={16} /> Gérer mes rôles
          </Link>
        </div>
      ) : favorites.length === 0 ? (
        <div className="mt-shamar-24 bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 text-center shadow-shamar-soft">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-shamar-16">
            <Heart size={28} className="text-gray-400" />
          </div>
          <p className="text-gray-700 font-medium text-shamar-body">Aucun favori</p>
          <p className="text-gray-500 text-shamar-small mt-1">Explorez le catalogue pour ajouter des produits à vos favoris.</p>
          <Link href="/products" className="inline-flex items-center gap-2 mt-shamar-16 text-primary-600 font-medium hover:underline text-shamar-body">
            Explorer le catalogue →
          </Link>
        </div>
      ) : (
        <div className="mt-shamar-24 grid grid-cols-1 sm:grid-cols-2 gap-shamar-16">
          {favorites.map((fav: any) => {
            const product = fav.product || fav;
            return (
              <Link
                key={fav.id || product.id}
                href={`/products/${product.id}`}
                className="block bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden hover:border-primary-600/50 transition-colors shadow-shamar-soft"
              >
                <div className="h-32 bg-gray-100 flex items-center justify-center">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <div className="p-shamar-16">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 text-shamar-body">{product.name}</h3>
                  <p className="text-primary-600 font-bold mt-1 text-shamar-small">{product.price?.toLocaleString?.()} {product.currency || 'FCFA'}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
