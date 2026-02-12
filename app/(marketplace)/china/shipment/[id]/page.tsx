import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ArrowLeft, Ship, MapPin, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ChinaShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const { id } = await params;
  const supabase = await createClient();
  const { data: delivery } = await (supabase as any)
    .from('deliveries')
    .select('id, order_id, status, tracking_code, carrier_name, created_at')
    .eq('id', id)
    .eq('buyer_id', user.id)
    .single();

  if (!delivery) notFound();

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32">
          <Link href="/china/shipments" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 font-medium">
            <ArrowLeft size={16} /> Retour aux expéditions
          </Link>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight flex items-center gap-2">
              <Ship size={28} className="text-primary-600" /> Expédition {id.slice(0, 8)}
            </h1>
            <p className="text-shamar-body text-gray-500 mt-1">Tracking, transporteur, numéro conteneur, ETA, statut, photos, confirmer réception.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-shamar-24">
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <h2 className="text-shamar-body font-semibold text-gray-900 mb-shamar-16">Informations</h2>
              <dl className="space-y-shamar-12 text-shamar-small">
                <div><dt className="text-gray-500">Commande</dt><dd className="font-medium text-gray-900">{delivery.order_id?.slice(0, 8)}</dd></div>
                <div><dt className="text-gray-500">Transporteur</dt><dd className="font-medium text-gray-900">{delivery.carrier_name || '—'}</dd></div>
                <div><dt className="text-gray-500">Numéro de suivi</dt><dd className="font-mono text-gray-900">{delivery.tracking_code || '—'}</dd></div>
                <div><dt className="text-gray-500">Statut</dt><dd><span className="px-2 py-0.5 rounded-shamar-sm bg-gray-100 text-gray-800">{delivery.status}</span></dd></div>
              </dl>
            </div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <h2 className="text-shamar-body font-semibold text-gray-900 mb-shamar-16">Tracking</h2>
              <p className="text-shamar-small text-gray-500 mb-shamar-16">Numéro conteneur, ETA et étapes à connecter à l’API transporteur.</p>
              <Link href={`/international/tracking/${delivery.order_id}`} className="text-primary-600 font-semibold hover:underline">
                Suivi international →
              </Link>
            </div>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
            <p className="text-shamar-small text-gray-500 mb-shamar-16">Photos de preuve et bouton « Confirmer réception » à brancher.</p>
            <Link href={`/china/incidents/create?shipment=${delivery.id}`} className="text-warning-500 font-semibold hover:underline">
              Signaler un problème
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
