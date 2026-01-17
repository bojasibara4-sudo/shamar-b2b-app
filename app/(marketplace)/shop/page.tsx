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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
              <span className="text-emerald-600">Boutiques</span> Vérifiées
            </h1>
            <p className="text-lg text-slate-500 font-medium">
              Découvrez nos boutiques vérifiées
            </p>
          </div>
        </div>

        {shops.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-slate-200 p-12 text-center shadow-sm">
            <p className="text-slate-500 font-medium">Aucune boutique disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop: any) => (
              <a
                key={shop.id}
                href={`/marketplace/shop/${shop.id}`}
                className="group bg-white rounded-[2rem] border border-slate-200 p-6 hover:shadow-2xl hover:-translate-y-2 transition-all text-left flex flex-col h-full"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mb-4 transition-transform group-hover:scale-110">
                  <span className="text-2xl font-black">{shop.name?.[0]?.toUpperCase() || 'S'}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{shop.name}</h3>
                {shop.description && (
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
                    {shop.description}
                  </p>
                )}
                <div className="mt-auto flex items-center gap-2 text-emerald-600 font-black text-sm group-hover:translate-x-1 transition-transform">
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
