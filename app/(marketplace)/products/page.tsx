import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const supabase = await createClient();
  
  const { data: products } = await (supabase as any)
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
              Catalogue <span className="text-emerald-600">Produits</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium">
              Découvrez tous nos produits disponibles
            </p>
          </div>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <a
                key={product.id}
                href={`/marketplace/products/${product.id}`}
                className="group bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col h-full"
              >
                <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-4xl font-black text-white opacity-80">{product.name?.[0]?.toUpperCase() || 'P'}</span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-black text-slate-900 mb-2">{product.name}</h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
                    <span className="text-emerald-600 font-black text-lg">
                      {product.price} {product.currency || 'FCFA'}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-[2rem] border border-slate-200">
            <p className="text-slate-500 font-medium">Aucun produit disponible pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
}
