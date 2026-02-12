import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { getDeliveryByOrderId } from '@/services/delivery.service';
import PrepareShipmentForm from '@/components/logistics/PrepareShipmentForm';

export const dynamic = 'force-dynamic';

export default async function SellerPrepareOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  if (user.role !== 'seller' && user.role !== 'admin') redirect('/dashboard');
  const { id: orderId } = await params;

  const supabase = await createClient();
  const { data: order, error } = await (supabase as any)
    .from('orders')
    .select('id, buyer_id, seller_id, total_amount, currency, status, order_items:order_items(*, product:products(name))')
    .eq('id', orderId)
    .single();

  if (error || !order || order.seller_id !== user.id) notFound();

  const delivery = await getDeliveryByOrderId(orderId);
  let providers: { id: string; name: string; slug: string; base_price: number; avg_days: number; quality_rating: number }[] = [];
  try {
    const { data } = await (supabase as any).from('logistics_providers').select('id, name, slug, base_price, avg_days, quality_rating').eq('is_active', true);
    providers = data || [];
  } catch {
    providers = [];
  }

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 py-shamar-24">
        <div className="space-y-shamar-24">
          <Link href="/dashboard/seller/orders" className="inline-flex items-center gap-2 text-shamar-small font-medium text-gray-500 hover:text-primary-600 mb-shamar-16">← Commandes</Link>
          <h1 className="text-shamar-h2 text-gray-900">Préparer l&apos;expédition</h1>
          <p className="text-shamar-body text-gray-500">Commande #{orderId.slice(0, 8)} — Imprimer facture, étiquette, choisir transporteur, marquer expédié.</p>
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
            <PrepareShipmentForm orderId={orderId} delivery={delivery} providers={providers} />
          </div>
        </div>
      </div>
    </div>
  );
}
