import { requireSeller } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import ProductFormClient from '@/components/ProductFormClient';
import DeleteProductButton from '@/components/DeleteProductButton';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SellerProductsPage() {
  const user = await requireSeller();

  const supabase = await createSupabaseServerClient();
  let products: any[] = [];

  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      products = data;
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Produits</h1>
            <p className="mt-2 text-gray-600">Gérez vos produits et catalogues</p>
          </div>
          <LogoutButton />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Créer un produit
          </h2>
          <ProductFormClient />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Mes produits ({products.length})
          </h2>
          {products.length === 0 ? (
            <p className="text-gray-600">Aucun produit</p>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {product.description}
                      </p>
                      <p className="text-lg font-bold text-gray-900 mt-2">
                        {Number(product.price || 0).toLocaleString()} {product.currency || 'FCFA'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Statut: <span className={`font-semibold ${product.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                          {product.status === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link
                        href={`/dashboard/seller/products/${product.id}`}
                        className="px-3 py-1 bg-black text-white text-sm rounded hover:opacity-90"
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
  );
}
