import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ShopsPage() {
  const supabase = await createClient();
  
  const { data: shops = [], error } = await (supabase as any)
    .from('shops')
    .select('*')
    .eq('status', 'verified')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Boutiques</h1>
        <p className="mt-2 text-gray-600">Découvrez nos boutiques vérifiées</p>
      </div>

      {shops.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-600">Aucune boutique disponible pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop: any) => (
            <div key={shop.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900">{shop.name}</h3>
              {shop.description && (
                <p className="text-gray-600 mt-2">{shop.description}</p>
              )}
              <a
                href={`/shop/${shop.id}`}
                className="mt-4 inline-block text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Voir la boutique →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
