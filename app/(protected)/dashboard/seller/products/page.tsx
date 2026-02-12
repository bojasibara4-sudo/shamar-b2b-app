import { requireSeller } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { createClient } from '@/lib/supabase/server';
import ProductFormClient from '@/components/ProductFormClient';
import DeleteProductButton from '@/components/DeleteProductButton';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SellerProductsPage() {
  const user = await requireSeller();

  const supabase = await createClient();
  let products: any[] = [];

  const { data, error } = await (supabase as any)
      .from('products')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      products = data;
    }

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-shamar-16">
            <div>
              <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
                Mes <span className="text-primary-600">Produits</span>
              </h1>
              <p className="text-shamar-body text-gray-500 font-medium">
                Gérez vos produits et catalogues
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-shamar-24">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-24">
            <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-shamar-16">
              Créer un produit
            </h2>
            <ProductFormClient />
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-24">
            <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-shamar-16">
              Mes produits ({products.length})
            </h2>
            {products.length === 0 ? (
              <p className="text-gray-500 text-center py-shamar-48 font-medium text-shamar-body">Aucun produit</p>
            ) : (
              <div className="space-y-shamar-16">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-shamar-md p-shamar-16 hover:shadow-shamar-soft transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-shamar-body">
                          {product.name}
                        </h3>
                        <p className="text-shamar-small text-gray-600 mt-1 font-medium line-clamp-2">
                          {product.description}
                        </p>
                        <p className="text-shamar-body font-semibold text-gray-900 mt-2">
                          {Number(product.price || 0).toLocaleString()} {product.currency || 'FCFA'}
                        </p>
                        <p className="text-shamar-caption text-gray-500 mt-1 font-medium">
                          Statut: <span className={`font-semibold ${product.status === 'active' ? 'text-success-500' : 'text-gray-600'}`}>
                            {product.status === 'active' ? 'Actif' : 'Inactif'}
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Link
                          href={`/dashboard/seller/products/${product.id}`}
                          className="px-shamar-16 py-2 bg-primary-600 text-white text-shamar-small rounded-shamar-md font-semibold hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                          Modifier
                        </Link>
                        <DeleteProductButton
                          productId={product.id}
                          productName={product.name}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
