import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { getDeliveryById } from '@/services/delivery.service';
import { createClient } from '@/lib/supabase/server';
import ReportIncidentForm from '@/components/logistics/ReportIncidentForm';

export const dynamic = 'force-dynamic';

export default async function ReportIncidentPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  const { id } = await params;

  const delivery = await getDeliveryById(id);
  if (!delivery) notFound();
  if (delivery.buyer_id !== user.id && (!delivery.seller_id || delivery.seller_id !== user.id) && (!delivery.vendor_id || delivery.vendor_id !== user.id)) {
    redirect('/profile/deliveries');
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href={`/profile/deliveries/${id}`} className="inline-flex items-center gap-2 text-white/80 hover:text-brand-vert text-sm mb-6">← Retour livraison</Link>
      <h1 className="text-2xl font-bold text-white">Signaler un incident</h1>
      <p className="text-white/70 text-sm mt-1">Retard, colis perdu, endommagé, mauvais article. Photos et commentaire.</p>
      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6">
        <ReportIncidentForm deliveryId={id} />
      </div>
    </div>
  );
}
