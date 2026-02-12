import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

const TYPE_LABELS: Record<string, string> = {
  delay: 'Retard',
  lost: 'Perdu',
  damaged: 'Endommagé',
  wrong_item: 'Mauvais article',
  other: 'Autre',
};

export default async function AdminChinaIncidentsPage() {
  const supabase = await createClient();
  const { data: incidents } = await (supabase as any)
    .from('delivery_incidents')
    .select('id, delivery_id, type, status, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  const list = incidents || [];

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-24">
          <Link href="/admin/china/dashboard" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 font-medium">
            <ArrowLeft size={16} /> Admin Chine
          </Link>
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight flex items-center gap-2">
            <AlertTriangle size={28} className="text-warning-500" /> Incidents / Litiges
          </h1>
          <p className="text-shamar-body text-gray-500">Tickets livraison, escalade, arbitrage.</p>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden shadow-shamar-soft">
            <table className="w-full text-shamar-small">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-shamar-16 font-semibold text-gray-700">Livraison</th>
                  <th className="text-left p-shamar-16 font-semibold text-gray-700">Type</th>
                  <th className="text-left p-shamar-16 font-semibold text-gray-700">Statut</th>
                  <th className="text-left p-shamar-16 font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {list.map((i: any) => (
                  <tr key={i.id} className="border-b border-gray-100">
                    <td className="p-shamar-16 font-mono text-gray-900">{i.delivery_id?.slice(0, 8)}</td>
                    <td className="p-shamar-16">{TYPE_LABELS[i.type] || i.type}</td>
                    <td className="p-shamar-16">
                      <span className={`px-2 py-0.5 rounded-shamar-sm ${i.status === 'open' ? 'bg-warning-500/20 text-gray-800' : 'bg-gray-100 text-gray-800'}`}>
                        {i.status}
                      </span>
                    </td>
                    <td className="p-shamar-16 text-gray-500">{i.created_at ? new Date(i.created_at).toLocaleDateString('fr-FR') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {list.length === 0 && <p className="p-shamar-24 text-center text-gray-500">Aucun incident.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
