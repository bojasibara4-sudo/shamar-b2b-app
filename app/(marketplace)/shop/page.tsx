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
    <div className="max-w-shamar-container mx-auto px-4 sm:px-6 py-shamar-24 lg:py-shamar-40">
      <div className="space-y-shamar-24">
        <header>
          <h1 className="text-shamar-h1 text-gray-900">
            Boutiques vérifiées
          </h1>
          <p className="text-shamar-body text-gray-500 mt-1">
            Découvrez nos boutiques vérifiées
          </p>
        </header>

        {shops.length === 0 ? (
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-48 text-center shadow-shamar-soft">
            <p className="text-shamar-body text-gray-500">Aucune boutique disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-shamar-24">
            {shops.map((shop: any) => (
              <a
                key={shop.id}
                href={`/shop/${shop.id}`}
                className="group bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-16 shadow-shamar-soft hover:shadow-shamar-medium focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:ring-offset-2 focus:ring-offset-gray-50 transition-all duration-200 text-left flex flex-col h-full"
              >
                <div className="w-14 h-14 rounded-shamar-md bg-primary-600 flex items-center justify-center text-white mb-shamar-16">
                  <span className="text-shamar-h3 text-gray-0">{shop.name?.[0]?.toUpperCase() || 'S'}</span>
                </div>
                <h3 className="text-shamar-h4 text-gray-900 mb-2">{shop.name}</h3>
                {shop.description && (
                  <p className="text-shamar-body text-gray-500 line-clamp-2 flex-1">
                    {shop.description}
                  </p>
                )}
                <div className="mt-shamar-16 text-shamar-small font-medium text-primary-600 group-hover:underline">
                  Voir la boutique →
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
