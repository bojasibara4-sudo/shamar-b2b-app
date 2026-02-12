import { createClient } from '@/lib/supabase/server';

export default async function B2BScreen() {
  const supabase = await createClient();

  const { data: shops } = await (supabase as any)
    .from('shops')
    .select('*')
    .eq('is_verified', true)
    .eq('status', 'verified')
    .limit(20);

  return (
    <div className="min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-shamar-16">
            <div>
              <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
                Marketplace <span className="text-primary-600">B2B</span>
              </h1>
              <p className="text-shamar-body text-gray-500 font-medium">
                Découvrez nos boutiques professionnelles vérifiées
              </p>
            </div>
          </div>

          {shops && shops.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-shamar-24">
              {shops.map((shop: any) => (
                <a
                  key={shop.id}
                  href={`/shop/${shop.id}`}
                  className="group bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 hover:shadow-shamar-medium hover:border-primary-600/30 transition-all text-left flex flex-col h-full shadow-shamar-soft"
                >
                  <div className="w-16 h-16 rounded-shamar-md bg-primary-600 flex items-center justify-center text-gray-0 mb-shamar-16 transition-transform group-hover:scale-105">
                    <span className="text-shamar-h2">{shop.name?.[0]?.toUpperCase() || 'S'}</span>
                  </div>
                  <h3 className="text-shamar-h3 text-gray-900 mb-2">{shop.name}</h3>
                  <p className="text-gray-500 text-shamar-small mb-shamar-16 line-clamp-2 leading-relaxed flex-1">
                    {shop.description}
                  </p>
                  <div className="flex items-center gap-2 mt-shamar-16">
                    <span className="text-shamar-caption bg-success-500/20 text-gray-800 px-3 py-1 rounded-shamar-sm font-medium">
                      Vérifié
                    </span>
                    {shop.category && (
                      <span className="text-shamar-caption text-gray-400 font-medium">{shop.category}</span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-shamar-48 bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft">
              <p className="text-gray-500 font-medium text-shamar-body">Aucune boutique disponible pour le moment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

