import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminLogisticsOperationsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') redirect('/admin/login');

  const supabase = await createClient();
  const { data: deliveries } = await (supabase as any)
    .from('deliveries')
    .select('id, order_id, status, tracking_code, carrier_name, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  const list = deliveries || [];

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-24">
          <Link href="/admin/logistics" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 font-medium">← Logistique</Link>
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Opérations</h1>
          <p className="text-shamar-body text-gray-500">Liste des expéditions.</p>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden shadow-shamar-soft">
            <table className="w-full text-shamar-small">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-shamar-16 font-semibold text-gray-700">Commande</th>
                  <th className="text-left p-shamar-16 font-semibold text-gray-700">Suivi</th>
                  <th className="text-left p-shamar-16 font-semibold text-gray-700">Transporteur</th>
                  <th className="text-left p-shamar-16 font-semibold text-gray-700">Statut</th>
                  <th className="text-left p-shamar-16 font-semibold text-gray-700">Créé</th>
                </tr>
              </thead>
              <tbody>
                {list.map((d: any) => (
                  <tr key={d.id} className="border-b border-gray-100">
                    <td className="p-shamar-16 font-mono text-xs text-gray-900">{d.order_id?.slice(0, 8)}</td>
                    <td className="p-shamar-16">{d.tracking_code || '—'}</td>
                    <td className="p-shamar-16">{d.carrier_name || '—'}</td>
                    <td className="p-shamar-16"><span className="px-2 py-0.5 rounded-shamar-sm bg-gray-100 text-gray-800 text-shamar-caption">{d.status}</span></td>
                    <td className="p-shamar-16 text-gray-500">{d.created_at ? new Date(d.created_at).toLocaleDateString('fr-FR') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {list.length === 0 && <p className="p-shamar-24 text-center text-gray-500 text-shamar-body">Aucune livraison.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
