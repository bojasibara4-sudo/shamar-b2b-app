import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Plus, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

const STATUS_LABELS: Record<string, string> = {
  sent: 'Ouvert',
  pending: 'En attente',
  offers: 'Offres reçues',
  negotiated: 'Négocié',
  accepted: 'Accepté',
  converted: 'Converti',
  expired: 'Expiré',
};

export default async function ChinaRfqsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const supabase = await createClient();
  const { data: rfqs } = await (supabase as any)
    .from('product_rfqs')
    .select('id, created_at, status')
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  const list = rfqs || [];

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-shamar-16">
            <div>
              <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Mes demandes de devis</h1>
              <p className="text-shamar-body text-gray-500 mt-1">Statut : ouvert, offres reçues, négocié, converti.</p>
            </div>
            <Link
              href="/china/rfq/create"
              className="inline-flex items-center gap-2 px-shamar-24 py-shamar-12 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700"
            >
              <Plus size={20} /> Nouvelle demande
            </Link>
          </div>

          {list.length > 0 ? (
            <ul className="space-y-shamar-12">
              {list.map((r: any) => (
                <li key={r.id}>
                  <Link
                    href={`/china/rfq/${r.id}`}
                    className="block p-shamar-24 rounded-shamar-md border border-gray-200 bg-gray-0 shadow-shamar-soft hover:border-primary-600/30 hover:shadow-shamar-medium transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-shamar-16">
                      <div className="flex items-center gap-shamar-16">
                        <div className="w-10 h-10 rounded-shamar-md bg-primary-100 text-primary-600 flex items-center justify-center">
                          <FileText size={20} />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">RFQ {r.id.slice(0, 8)}</span>
                          <span className="text-shamar-small text-gray-500 ml-2">
                            — {STATUS_LABELS[r.status] || r.status || 'Ouvert'}
                          </span>
                        </div>
                      </div>
                      <span className="text-shamar-small text-gray-500">
                        {r.created_at ? new Date(r.created_at).toLocaleDateString('fr-FR') : '—'}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-48 text-center shadow-shamar-soft">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-shamar-16" />
              <p className="text-gray-500 font-medium">Aucune demande de devis.</p>
              <Link href="/china/rfq/create" className="inline-block mt-shamar-24 text-primary-600 font-semibold hover:underline">
                Créer une demande
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
