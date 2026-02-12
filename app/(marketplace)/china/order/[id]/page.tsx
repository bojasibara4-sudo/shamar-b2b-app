import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ArrowLeft, Package, FileText, Truck, DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';

const STEPS = ['production', 'ready', 'shipped', 'customs', 'delivered'];

export default async function ChinaOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const { id } = await params;
  const supabase = await createClient();
  const { data: order } = await (supabase as any)
    .from('orders')
    .select('id, total_amount, currency, status, created_at')
    .eq('id', id)
    .eq('buyer_id', user.id)
    .single();

  if (!order) notFound();

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32">
          <Link href="/china/orders" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 font-medium">
            <ArrowLeft size={16} /> Retour aux commandes
          </Link>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Commande {id.slice(0, 8)}</h1>
            <p className="text-shamar-body text-gray-500 mt-1">Résumé, contrat, facture proforma, timeline, paiement escrow.</p>
            <div className="mt-shamar-24 flex flex-wrap gap-shamar-24">
              <span className="font-semibold text-gray-900">Montant : <span className="text-primary-600">{Number(order.total_amount || 0).toLocaleString()} {order.currency || 'FCFA'}</span></span>
              <span className="text-gray-600">Statut : <span className="font-medium">{order.status}</span></span>
            </div>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <h2 className="text-shamar-h3 text-gray-900 mb-shamar-16">Timeline</h2>
            <ul className="space-y-shamar-12">
              {STEPS.map((step, i) => (
                <li key={step} className="flex items-center gap-shamar-16">
                  <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-shamar-small font-medium">{i + 1}</span>
                  <span className="capitalize text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
            <p className="text-shamar-small text-gray-500 mt-shamar-16">Contrat PDF, facture proforma et statuts réels à connecter aux données livraison.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-shamar-24">
            <Link
              href={`/china/shipment/${id}`}
              className="flex items-center gap-shamar-16 p-shamar-24 rounded-shamar-md border border-gray-200 bg-gray-0 shadow-shamar-soft hover:border-primary-600/30"
            >
              <Truck className="h-10 w-10 text-primary-600 shrink-0" />
              <span className="font-semibold text-gray-900">Logistique / Tracking</span>
            </Link>
            <Link
              href={`/china/escrow/${id}`}
              className="flex items-center gap-shamar-16 p-shamar-24 rounded-shamar-md border border-gray-200 bg-gray-0 shadow-shamar-soft hover:border-primary-600/30"
            >
              <DollarSign className="h-10 w-10 text-primary-600 shrink-0" />
              <span className="font-semibold text-gray-900">Paiement escrow</span>
            </Link>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
            <h2 className="text-shamar-h3 text-gray-900 mb-shamar-16 flex items-center gap-2">
              <FileText size={22} /> Documents
            </h2>
            <Link href={`/china/documents?order=${id}`} className="text-primary-600 font-semibold hover:underline">
              Voir les documents (facture, BL, packing list)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
