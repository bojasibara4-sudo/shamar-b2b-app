import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function B2BPage() {
  const supabase = await createClient();
  
  // Récupérer les boutiques B2B vérifiées
  const { data: shops } = await (supabase as any)
    .from('shops')
    .select('*')
    .eq('is_verified', true)
    .eq('status', 'verified')
    .limit(20);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Marketplace B2B
        </h1>
        <p className="text-gray-600">
          Découvrez nos boutiques professionnelles vérifiées
        </p>
      </div>

      {shops && shops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shops.map((shop: any) => (
            <a
              key={shop.id}
              href={`/marketplace/shop/${shop.id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">{shop.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {shop.description}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                  Vérifié
                </span>
                {shop.category && (
                  <span className="text-xs text-gray-500">{shop.category}</span>
                )}
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune boutique disponible pour le moment</p>
        </div>
      )}
    </div>
  );
}
