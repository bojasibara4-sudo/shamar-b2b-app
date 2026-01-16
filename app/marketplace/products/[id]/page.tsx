import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, DollarSign, ShoppingCart } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const user = await getCurrentUser();

  // Récupérer le produit avec les infos du vendeur
  const { data: product, error } = await (supabase as any)
    .from('products')
    .select(`
      *,
      seller:users!products_seller_id_fkey(id, email, full_name, company_name, phone),
      shop:shops(id, name, status)
    `)
    .eq('id', params.id)
    .eq('is_active', true)
    .single();

  if (error || !product) {
    notFound();
  }

  const price = Number(product.price || 0);
  const currency = product.currency || 'FCFA';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/marketplace/products"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Retour au catalogue
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-auto rounded-lg"
            />
          ) : (
            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <Package className="h-24 w-24 text-gray-400" />
            </div>
          )}
        </div>

        {/* Détails */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-lg text-emerald-600 font-bold mb-4">
              {price.toLocaleString()} {currency}
            </p>
            {product.category && (
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {product.category}
              </span>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{product.description || 'Aucune description'}</p>
          </div>

          {product.seller && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="font-semibold text-gray-900 mb-2">Vendeur</h2>
              <p className="text-gray-900">{product.seller.company_name || product.seller.full_name || product.seller.email}</p>
              {product.seller.phone && (
                <p className="text-sm text-gray-600 mt-1">{product.seller.phone}</p>
              )}
              {product.shop && (
                <Link
                  href={`/marketplace/shop/${product.shop.id}`}
                  className="text-sm text-emerald-600 hover:underline mt-2 inline-block"
                >
                  Voir la boutique →
                </Link>
              )}
            </div>
          )}

          {user && user.role === 'buyer' && (
            <div className="flex gap-4">
              <button className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                <ShoppingCart size={20} />
                Ajouter au panier
              </button>
              <Link
                href={`/marketplace/shop/${product.seller?.id || ''}`}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Contacter le vendeur
              </Link>
            </div>
          )}

          {!user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <Link href="/auth/login" className="font-semibold underline">
                  Connectez-vous
                </Link>{' '}
                pour ajouter ce produit à votre panier ou contacter le vendeur.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
