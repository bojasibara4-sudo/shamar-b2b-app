import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Ship } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ChinaShipmentsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const supabase = await createClient();
  const { data: deliveries } = await (supabase as any)
    .from('deliveries')
    .select('id, order_id, status, tracking_code, carrier_name, created_at')
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  const list = deliveries || [];

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32">
          <div>
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Expéditions</h1>
            <p className="text-shamar-body text-gray-500 mt-1">Liste des expéditions et suivi.</p>
          </div>

          {list.length > 0 ? (
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden shadow-shamar-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-shamar-small">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-shamar-16 font-semibold text-gray-700">Commande</th>
                      <th className="text-left p-shamar-16 font-semibold text-gray-700">Suivi</th>
                      <th className="text-left p-shamar-16 font-semibold text-gray-700">Transporteur</th>
                      <th className="text-left p-shamar-16 font-semibold text-gray-700">Statut</th>
                      <th className="text-right p-shamar-16 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((d: any) => (
                      <tr key={d.id} className="border-b border-gray-100">
                        <td className="p-shamar-16 font-mono text-gray-900">{d.order_id?.slice(0, 8)}</td>
                        <td className="p-shamar-16">{d.tracking_code || '—'}</td>
                        <td className="p-shamar-16">{d.carrier_name || '—'}</td>
                        <td className="p-shamar-16">
                          <span className="px-2 py-0.5 rounded-shamar-sm bg-gray-100 text-gray-800">{d.status}</span>
                        </td>
                        <td className="p-shamar-16 text-right">
                          <Link href={`/china/shipment/${d.id}`} className="text-primary-600 font-medium hover:underline">
                            Voir
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-48 text-center shadow-shamar-soft">
              <Ship className="h-16 w-16 text-gray-300 mx-auto mb-shamar-16" />
              <p className="text-gray-500 font-medium">Aucune expédition.</p>
              <Link href="/china/orders" className="inline-block mt-shamar-24 text-primary-600 font-semibold hover:underline">
                Mes commandes
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
