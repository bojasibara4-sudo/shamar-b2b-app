import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { Truck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LogisticsProvidersPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const supabase = await createClient();
  let providers: { id: string; name: string; slug: string; description: string; base_price: number; currency: string; avg_days: number; quality_rating: number }[] = [];
  try {
    const { data } = await (supabase as any)
      .from('logistics_providers')
      .select('id, name, slug, description, base_price, currency, avg_days, quality_rating')
      .eq('is_active', true)
      .order('name');
    providers = data || [];
  } catch {
    providers = [];
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/profile/deliveries" className="inline-flex items-center gap-2 text-white/80 hover:text-brand-vert text-sm mb-6">← Livraisons</Link>
      <h1 className="text-2xl font-bold text-white">Transporteurs partenaires</h1>
      <p className="text-white/70 text-sm mt-1">Prix, délai, couverture, note qualité. Choix lors de la préparation d&apos;expédition.</p>

      <div className="mt-6 space-y-4">
        {providers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <Truck size={40} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">Aucun transporteur configuré.</p>
            <p className="text-slate-500 text-sm mt-1">Les transporteurs sont gérés par l&apos;administration.</p>
          </div>
        ) : (
          providers.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-slate-900">{p.name}</p>
                  {p.description && <p className="text-slate-600 text-sm mt-0.5">{p.description}</p>}
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-500">
                    <span>{Number(p.base_price || 0).toLocaleString('fr-FR')} {p.currency}</span>
                    {p.avg_days != null && <span>~{p.avg_days} jours</span>}
                    {p.quality_rating != null && <span>Note {Number(p.quality_rating)}/5</span>}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
