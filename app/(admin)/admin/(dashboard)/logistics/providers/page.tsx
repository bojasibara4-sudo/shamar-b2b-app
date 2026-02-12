import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminLogisticsProvidersPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') redirect('/admin/login');

  const supabase = await createClient();
  const { data: providers } = await (supabase as any)
    .from('logistics_providers')
    .select('*')
    .order('name');

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-24">
          <Link href="/admin/logistics" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 font-medium">← Logistique</Link>
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Transporteurs</h1>
          <p className="text-shamar-body text-gray-500">Ajouter transporteur, tarifs, SLA, régions couvertes. (Édition à brancher.)</p>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden shadow-shamar-soft">
            <table className="w-full text-shamar-small">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-shamar-16 font-semibold text-gray-700">Nom</th>
                  <th className="text-left p-shamar-16 font-semibold text-gray-700">Slug</th>
                  <th className="text-left p-shamar-16 font-semibold text-gray-700">Prix base</th>
                  <th className="text-left p-shamar-16 font-semibold text-gray-700">Délai (j)</th>
                  <th className="text-left p-shamar-16 font-semibold text-gray-700">Note</th>
                  <th className="text-left p-shamar-16 font-semibold text-gray-700">Actif</th>
                </tr>
              </thead>
              <tbody>
                {(providers || []).map((p: any) => (
                  <tr key={p.id} className="border-b border-gray-100">
                    <td className="p-shamar-16 font-medium text-gray-900">{p.name}</td>
                    <td className="p-shamar-16 text-gray-600">{p.slug || '—'}</td>
                    <td className="p-shamar-16">{p.base_price != null ? `${Number(p.base_price).toLocaleString()} ${p.currency || 'FCFA'}` : '—'}</td>
                    <td className="p-shamar-16">{p.avg_days ?? '—'}</td>
                    <td className="p-shamar-16">{p.quality_rating ?? '—'}</td>
                    <td className="p-shamar-16">{p.is_active ? 'Oui' : 'Non'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!providers || providers.length === 0) && (
              <p className="p-shamar-24 text-center text-gray-500 text-shamar-body">Aucun transporteur. Exécutez le script SUPABASE-LOGISTIQUE-COMPLET.sql pour en créer.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
