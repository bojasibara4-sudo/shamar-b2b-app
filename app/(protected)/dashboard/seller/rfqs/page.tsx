import { requireSeller } from '@/lib/auth-guard';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  quoted: 'Devis envoyé',
  accepted: 'Accepté',
  rejected: 'Refusé',
};

export default async function SellerRfqsPage() {
  await requireSeller();
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;
  if (!userId) {
    return (
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 py-shamar-24">
          <p className="text-gray-500 text-shamar-body">Non connecté.</p>
        </div>
      </div>
    );
  }

  const { data: rfqs } = await (supabase as any)
    .from('product_rfqs')
    .select(`
      id,
      product_id,
      quantity,
      status,
      quote_price,
      created_at,
      product:products(name, currency),
      buyer:users!product_rfqs_buyer_id_fkey(company_name, full_name, email)
    `)
    .eq('seller_id', userId)
    .order('created_at', { ascending: false });

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <Link href="/dashboard/seller" className="text-shamar-small font-medium text-primary-600 hover:underline">
            ← Tableau de bord
          </Link>
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight mt-2 mb-2">
            Demandes de devis (RFQ)
          </h1>
          <p className="text-shamar-body text-gray-500 font-medium">
            Répondez aux demandes des acheteurs
          </p>
        </div>

        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-24">
          {rfqs && rfqs.length > 0 ? (
            <ul className="space-y-0 divide-y divide-gray-200">
              {rfqs.map((r: any) => (
                <li key={r.id}>
                  <Link
                    href={`/rfq/${r.id}`}
                    className="block py-shamar-16 px-shamar-16 rounded-shamar-md border border-transparent hover:bg-gray-50 transition-colors first:pt-0"
                  >
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="font-medium text-gray-900 text-shamar-body">{r.product?.name || 'Produit'}</span>
                      <span className="px-3 py-1 rounded-shamar-sm text-shamar-small font-semibold bg-gray-100 text-gray-700">
                        {STATUS_LABELS[r.status] || r.status}
                      </span>
                    </div>
                    <p className="text-shamar-small text-gray-500 mt-1">
                      Qté : {r.quantity}
                      {r.quote_price != null && ` • Devis : ${Number(r.quote_price).toLocaleString()} ${r.product?.currency || 'FCFA'}`}
                      {' • '}{r.buyer?.company_name || r.buyer?.full_name || r.buyer?.email}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-shamar-48">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-shamar-16" />
              <p className="text-gray-500 font-medium text-shamar-body">Aucune demande de devis pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
