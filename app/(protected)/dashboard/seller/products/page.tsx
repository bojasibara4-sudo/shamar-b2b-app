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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                Mes <span className="text-indigo-600">Produits</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium">
                Gérez vos produits et catalogues
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-black text-slate-900 mb-4">
              Créer un produit
            </h2>
            <ProductFormClient />
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-black text-slate-900 mb-4">
              Mes produits ({products.length})
            </h2>
            {products.length === 0 ? (
              <p className="text-slate-500 text-center py-12 font-medium">Aucun produit</p>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="border border-slate-200 rounded-[1.5rem] p-4 hover:shadow-lg transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-black text-slate-900 text-lg">
                          {product.name}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1 font-medium line-clamp-2">
                          {product.description}
                        </p>
                        <p className="text-xl font-black text-slate-900 mt-2">
                          {Number(product.price || 0).toLocaleString()} {product.currency || 'FCFA'}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                          Statut: <span className={`font-black ${product.status === 'active' ? 'text-emerald-600' : 'text-slate-600'}`}>
                            {product.status === 'active' ? 'Actif' : 'Inactif'}
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Link
                          href={`/dashboard/seller/products/${product.id}`}
                          className="px-4 py-2 bg-slate-900 text-white text-sm rounded-xl font-black hover:bg-slate-800 transition-all"
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
  );
}
