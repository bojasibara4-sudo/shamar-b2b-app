import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { getDeliveryById } from '@/services/delivery.service';
import ConfirmReceiptButton from '@/components/profile/ConfirmReceiptButton';
import { Truck, MapPin, FileText, AlertTriangle, MessageCircle, CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

const TIMELINE_STEPS = [
  { key: 'paid', label: 'Payé' },
  { key: 'prepared', label: 'Préparé' },
  { key: 'shipped', label: 'Expédié' },
  { key: 'transit', label: 'En transit' },
  { key: 'hub', label: 'Arrivé hub local' },
  { key: 'out_for_delivery', label: 'En livraison' },
  { key: 'delivered', label: 'Livré' },
];

function timelineDone(status: string): number {
  if (status === 'delivered') return TIMELINE_STEPS.length;
  if (status === 'shipped') return 4;
  if (status === 'pending') return 2;
  return 2;
}

export default async function ProfileDeliveryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  const { id } = await params;

  const delivery = await getDeliveryById(id);
  if (!delivery) notFound();
  if (delivery.buyer_id !== user.id && delivery.seller_id !== user.id && delivery.vendor_id !== user.id && user.role !== 'admin') {
    redirect('/profile/deliveries');
  }

  const supabase = await createClient();
  const { data: order } = await (supabase as any)
    .from('orders')
    .select('id, seller_id, buyer:users!orders_buyer_id_fkey(full_name), seller:users!orders_seller_id_fkey(full_name), order_items:order_items(product:products(name))')
    .eq('id', delivery.order_id)
    .single();

  const doneCount = timelineDone(delivery.status);

  return (
    <div className="max-w-shamar-container mx-auto px-4 py-shamar-24">
      <Link href="/profile/deliveries" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 mb-shamar-24">← Retour livraisons</Link>

      {/* Bloc 1 — Infos colis */}
      <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 mb-shamar-24 shadow-shamar-soft">
        <h1 className="text-shamar-h3 text-gray-900 mb-shamar-16 flex items-center gap-2">
          <Truck size={22} /> Colis
        </h1>
        <dl className="space-y-2 text-shamar-small">
          <div><dt className="text-gray-500">Commande</dt><dd><Link href={`/profile/orders/${delivery.order_id}`} className="text-primary-600 font-medium">#{delivery.order_id.slice(0, 8)}</Link></dd></div>
          {order?.seller?.full_name && <div><dt className="text-gray-500">Vendeur</dt><dd className="font-medium">{order.seller.full_name}</dd></div>}
          {delivery.carrier_name && <div><dt className="text-gray-500">Transporteur</dt><dd>{delivery.carrier_name}</dd></div>}
          {delivery.tracking_code && <div><dt className="text-gray-500">N° suivi</dt><dd className="font-mono">{delivery.tracking_code}</dd></div>}
          {delivery.tracking_url && <div><dd><a href={delivery.tracking_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 font-medium">Suivre le colis →</a></dd></div>}
          {delivery.shipping_address && <div><dt className="text-gray-500">Adresse</dt><dd className="flex items-start gap-1"><MapPin size={14} className="shrink-0 mt-0.5" />{delivery.shipping_address}</dd></div>}
        </dl>
      </div>

      {/* Bloc 2 — Timeline */}
      <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 mb-shamar-24 shadow-shamar-soft">
        <h2 className="font-bold text-gray-900 mb-shamar-16 text-shamar-body">Statuts</h2>
        <ul className="space-y-2">
          {TIMELINE_STEPS.map((step, i) => {
            const done = i < doneCount;
            return (
              <li key={step.key} className="flex items-center gap-3">
                {done ? <CheckCircle size={18} className="text-success-500 shrink-0" /> : <span className="w-[18px] h-[18px] rounded-full border-2 border-gray-200 shrink-0" />}
                <span className={done ? 'text-gray-800 font-medium text-shamar-small' : 'text-gray-400 text-shamar-small'}>{step.label}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bloc 3 — Preuves */}
      <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 mb-shamar-24 shadow-shamar-soft">
        <h2 className="font-bold text-gray-900 mb-shamar-16 flex items-center gap-2 text-shamar-body"><FileText size={18} /> Preuves</h2>
        <div className="space-y-2 text-shamar-small text-gray-600">
          {delivery.proof_photo_url ? <p><a href={delivery.proof_photo_url} target="_blank" rel="noopener noreferrer" className="text-primary-600">Photo colis</a></p> : <p className="text-gray-400">Aucune photo.</p>}
          {delivery.proof_signature_url ? <p><a href={delivery.proof_signature_url} target="_blank" rel="noopener noreferrer" className="text-primary-600">Signature</a></p> : null}
          {delivery.proof_qr_scan_at ? <p>Scan QR : {new Date(delivery.proof_qr_scan_at).toLocaleString('fr-FR')}</p> : null}
        </div>
      </div>

      {/* Bloc 4 — Actions */}
      <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 mb-shamar-24 shadow-shamar-soft">
        <h2 className="font-bold text-gray-900 mb-shamar-16 text-shamar-body">Actions</h2>
        <div className="flex flex-wrap gap-shamar-12">
          {delivery.status !== 'delivered' && delivery.buyer_id === user.id && (
            <ConfirmReceiptButton deliveryId={delivery.id} />
          )}
          <Link href={`/deliveries/${delivery.id}/report`} className="inline-flex items-center gap-2 px-shamar-16 py-2 bg-warning-500/20 text-warning-700 rounded-shamar-md font-medium text-shamar-small hover:bg-warning-500/30">
            <AlertTriangle size={18} /> Signaler problème
          </Link>
          <Link href={`/disputes/new?order_id=${delivery.order_id}`} className="inline-flex items-center gap-2 px-shamar-16 py-2 bg-gray-100 text-gray-700 rounded-shamar-md font-medium text-shamar-small hover:bg-gray-200">
            Ouvrir litige
          </Link>
          <Link href="/messages" className="inline-flex items-center gap-2 px-shamar-16 py-2 bg-gray-100 text-gray-700 rounded-shamar-md font-medium text-shamar-small hover:bg-gray-200">
            <MessageCircle size={18} /> Contacter vendeur
          </Link>
        </div>
        <p className="text-gray-500 text-shamar-caption mt-3">Confirmer réception déclenche le déblocage de l&apos;escrow (paiement au vendeur).</p>
      </div>

      <Link href={`/profile/orders/${delivery.order_id}`} className="text-shamar-small text-gray-500 hover:text-primary-600">Voir la commande →</Link>
    </div>
  );
}
