import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import OpenDisputeForm from '@/components/disputes/OpenDisputeForm';

export const dynamic = 'force-dynamic';

const REASONS = [
  { value: 'Produit non reçu', label: 'Produit non reçu' },
  { value: 'Mauvaise qualité', label: 'Mauvaise qualité' },
  { value: 'Produit différent', label: 'Produit différent de la description' },
  { value: 'Endommagé', label: 'Produit endommagé' },
  { value: 'Fraude', label: 'Fraude' },
  { value: 'Autre', label: 'Autre' },
];

export default async function NewDisputePage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const { order_id } = await searchParams;
  if (!order_id) redirect('/disputes');

  const supabase = await createClient();
  const { data: order, error } = await (supabase as any)
    .from('orders')
    .select('id, total_amount, currency, buyer_id, seller_id, status')
    .eq('id', order_id)
    .single();

  if (error || !order) redirect('/disputes');
  if (order.buyer_id !== user.id && order.seller_id !== user.id && user.role !== 'admin') redirect('/disputes');

  const { data: existing } = await (supabase as any)
    .from('disputes')
    .select('id')
    .eq('order_id', order_id)
    .eq('status', 'open')
    .maybeSingle();
  if (existing) redirect(`/disputes/${existing.id}`);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 py-shamar-24">
      <Link href={`/dashboard/orders/${order_id}`} className="text-shamar-small font-medium text-gray-500 hover:text-primary-600 mb-shamar-24 inline-block">
        ← Retour à la commande
      </Link>
      <h1 className="text-shamar-h1 text-gray-900 mb-2">Ouvrir un litige</h1>
      <p className="text-shamar-body text-gray-500 mb-shamar-32">Commande #{order_id.slice(0, 8)} — {Number(order.total_amount).toLocaleString()} {order.currency}</p>
      <OpenDisputeForm orderId={order_id} reasons={REASONS} maxAmount={Number(order.total_amount)} currency={order.currency || 'FCFA'} />
      </div>
    </div>
  );
}
