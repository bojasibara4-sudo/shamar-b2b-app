import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  paid: 'Payé',
  processing: 'En production',
  confirmed: 'Confirmé',
  shipped: 'Expédié',
  delivered: 'Livré',
  cancelled: 'Annulé',
};

export default async function ChinaOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const supabase = await createClient();
  const { data: orders } = await (supabase as any)
    .from('orders')
    .select('id, total_amount, currency, status, created_at')
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100);

  const list = orders || [];

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32">
          <div>
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Commandes import</h1>
            <p className="text-shamar-body text-gray-500 mt-1">Fournisseur, montant, statut, incoterm, escrow.</p>
          </div>

          {list.length > 0 ? (
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden shadow-shamar-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-shamar-small">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-shamar-16 font-semibold text-gray-700">Commande</th>
                      <th className="text-left p-shamar-16 font-semibold text-gray-700">Montant</th>
                      <th className="text-left p-shamar-16 font-semibold text-gray-700">Statut</th>
                      <th className="text-left p-shamar-16 font-semibold text-gray-700">Date</th>
                      <th className="text-right p-shamar-16 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((o: any) => (
                      <tr key={o.id} className="border-b border-gray-100">
                        <td className="p-shamar-16 font-medium text-gray-900">{o.id.slice(0, 8)}</td>
                        <td className="p-shamar-16 text-primary-600 font-semibold">
                          {Number(o.total_amount || 0).toLocaleString()} {o.currency || 'FCFA'}
                        </td>
                        <td className="p-shamar-16">
                          <span className="px-2 py-0.5 rounded-shamar-sm bg-gray-100 text-gray-800">
                            {STATUS_LABELS[o.status] || o.status}
                          </span>
                        </td>
                        <td className="p-shamar-16 text-gray-500">
                          {o.created_at ? new Date(o.created_at).toLocaleDateString('fr-FR') : '—'}
                        </td>
                        <td className="p-shamar-16 text-right">
                          <Link href={`/china/order/${o.id}`} className="text-primary-600 font-medium hover:underline">
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
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-shamar-16" />
              <p className="text-gray-500 font-medium">Aucune commande.</p>
              <Link href="/china/rfqs" className="inline-block mt-shamar-24 text-primary-600 font-semibold hover:underline">
                Créer une demande de devis
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
