import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminChinaOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await (supabase as any)
    .from('orders')
    .select('id, total_amount, currency, status, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  const list = orders || [];

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-24">
          <Link href="/admin/china/dashboard" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 font-medium">
            <ArrowLeft size={16} /> Admin Chine
          </Link>
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Supervision commandes</h1>
          <p className="text-shamar-body text-gray-500">Commandes import Sourcing Chine.</p>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden shadow-shamar-soft">
            <table className="w-full text-shamar-small">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-shamar-16 font-semibold text-gray-700">Commande</th>
                  <th className="text-left p-shamar-16 font-semibold text-gray-700">Montant</th>
                  <th className="text-left p-shamar-16 font-semibold text-gray-700">Statut</th>
                  <th className="text-left p-shamar-16 font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {list.map((o: any) => (
                  <tr key={o.id} className="border-b border-gray-100">
                    <td className="p-shamar-16 font-mono text-gray-900">{o.id.slice(0, 8)}</td>
                    <td className="p-shamar-16 text-primary-600 font-semibold">{Number(o.total_amount || 0).toLocaleString()} {o.currency || 'FCFA'}</td>
                    <td className="p-shamar-16"><span className="px-2 py-0.5 rounded-shamar-sm bg-gray-100 text-gray-800">{o.status}</span></td>
                    <td className="p-shamar-16 text-gray-500">{o.created_at ? new Date(o.created_at).toLocaleDateString('fr-FR') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {list.length === 0 && <p className="p-shamar-24 text-center text-gray-500">Aucune commande.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
