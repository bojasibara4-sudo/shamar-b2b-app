import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import MarketplaceHomeClient from '@/components/marketplace/MarketplaceHomeClient';

const CATEGORIES = [
  { slug: 'fruits', label: 'Fruits' },
  { slug: 'legumes', label: 'Légumes' },
  { slug: 'cereales', label: 'Céréales' },
  { slug: 'semences', label: 'Semences' },
  { slug: 'other', label: 'Autres' },
];

export default async function MarketplaceScreen() {
  const supabase = await createClient();
  const { data: products } = await (supabase as any)
    .from('products')
    .select('id, name, description, price, currency, category, image_url')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(24);

  return (
    <div className="min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-shamar-16">
            <div>
              <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
                Marketplace <span className="text-primary-600">B2B / B2C</span>
              </h1>
              <p className="text-shamar-body text-gray-500 font-medium">
                Recherchez des produits, parcourez les catégories
              </p>
            </div>
          </div>

          <MarketplaceHomeClient categories={CATEGORIES} />

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-shamar-24">
            {(products || []).map((product: any) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden hover:shadow-shamar-medium hover:border-primary-600/30 transition-all flex flex-col h-full shadow-shamar-soft"
              >
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-shamar-h1 text-gray-400">
                      {product.name?.[0]?.toUpperCase() || 'P'}
                    </span>
                  )}
                </div>
                <div className="p-shamar-24 flex-1 flex flex-col">
                  <h3 className="text-shamar-h3 text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-500 text-shamar-small mb-shamar-16 line-clamp-2 flex-1">
                    {product.description}
                  </p>
                  <div className="mt-auto pt-shamar-16 border-t border-gray-200">
                    <span className="text-primary-600 font-semibold text-shamar-body">
                      {Number(product.price || 0).toLocaleString()} {product.currency || 'FCFA'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </section>
          {(!products || products.length === 0) && (
            <div className="text-center py-shamar-48 bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft">
              <p className="text-gray-500 font-medium text-shamar-body">Aucun produit pour le moment.</p>
              <Link href="/products" className="mt-shamar-16 inline-block text-primary-600 font-semibold hover:underline text-shamar-body">
                Voir le catalogue
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

