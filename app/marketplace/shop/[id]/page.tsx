import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Store, Package, Star, Mail, Phone } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ShopDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  // Récupérer la boutique avec les infos du vendeur et les produits
  const { data: shop, error: shopError } = await (supabase as any)
    .from('shops')
    .select(`
      *,
      vendor:users!shops_vendor_id_fkey(id, email, full_name, company_name, phone)
    `)
    .eq('id', params.id)
    .single();

  if (shopError || !shop) {
    notFound();
  }

  // Récupérer les produits de la boutique
  const { data: products } = await (supabase as any)
    .from('products')
    .select('*')
    .eq('seller_id', shop.vendor_id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/marketplace/shop"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Retour aux boutiques
        </Link>
      </div>

      {/* En-tête boutique */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Store className="h-12 w-12 text-emerald-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{shop.name}</h1>
              {shop.status === 'verified' && (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                  Vérifiée
                </span>
              )}
            </div>
            {shop.description && (
              <p className="text-gray-700 mb-4">{shop.description}</p>
            )}
            {shop.vendor && (
              <div className="flex items-center gap-6 text-sm text-gray-600">
                {shop.vendor.company_name && (
                  <div className="flex items-center gap-2">
                    <Store size={16} />
                    <span>{shop.vendor.company_name}</span>
                  </div>
                )}
                {shop.vendor.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <span>{shop.vendor.email}</span>
                  </div>
                )}
                {shop.vendor.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    <span>{shop.vendor.phone}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Produits de la boutique */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Package className="h-6 w-6" />
          Produits ({products?.length || 0})
        </h2>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <Link
                key={product.id}
                href={`/marketplace/products/${product.id}`}
                className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200"
              >
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                )}
                <p className="text-emerald-600 font-bold">
                  {Number(product.price || 0).toLocaleString()} {product.currency || 'FCFA'}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun produit disponible dans cette boutique</p>
          </div>
        )}
      </div>
    </div>
  );
}
