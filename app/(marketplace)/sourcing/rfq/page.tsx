import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

/**
 * /sourcing/rfq — Gestion RFQ. Liste avec statuts.
 */
export default async function SourcingRfqListPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const rfqs = user
    ? await (supabase as any).from('product_rfqs').select('id, created_at, status').eq('buyer_id', user.id).order('created_at', { ascending: false }).limit(20)
    : [];

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <Link href="/sourcing" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 text-shamar-small mb-shamar-24">
        <ArrowLeft size={16} /> Retour au hub Sourcing
      </Link>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-shamar-16">
        <h1 className="text-shamar-h2 text-gray-900">Demandes de devis (RFQ)</h1>
        <Link href="/sourcing/rfq/new" className="inline-flex items-center gap-2 px-shamar-16 py-2 bg-primary-600 text-white font-medium rounded-shamar-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
          <Plus size={18} /> Nouvelle demande
        </Link>
      </div>
      <p className="mt-1 text-shamar-body text-gray-500">Statuts : envoyé, réponses reçues, négociation, accepté, expiré.</p>

      <ul className="mt-shamar-32 space-y-shamar-12">
        {Array.isArray(rfqs) && rfqs.length > 0 ? (
          rfqs.map((r: { id: string; created_at: string; status?: string }) => (
            <li key={r.id}>
              <Link href={`/sourcing/negotiations/${r.id}`} className="block p-shamar-16 rounded-shamar-md border border-gray-200 hover:bg-gray-50 hover:border-primary-600/30 bg-gray-0 shadow-shamar-soft">
                <span className="font-medium text-gray-900 text-shamar-body">RFQ {r.id.slice(0, 8)}</span>
                <span className="text-gray-500 text-shamar-small ml-2">— {r.status || 'envoyé'}</span>
              </Link>
            </li>
          ))
        ) : (
          <li className="p-shamar-24 rounded-shamar-md border border-gray-200 bg-gray-0 text-gray-600 shadow-shamar-soft">
            Aucune demande de devis. <Link href="/sourcing/rfq/new" className="text-primary-600 font-medium hover:underline">Créer une demande</Link> ou <Link href="/rfq" className="text-primary-600 font-medium hover:underline">voir les RFQ produit</Link>.
          </li>
        )}
      </ul>
      </div>
    </div>
  );
}
