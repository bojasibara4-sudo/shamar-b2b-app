import { requireBuyer } from '@/lib/auth-guard';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BuyerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireBuyer();

  const supabase = await createClient();
  const { data: order, error } = await (supabase as any)
    .from('orders')
    .select(`
      *,
      order_items:order_items(*, product:products(name, price, image_url)),
      seller:users!orders_seller_id_fkey(email, full_name, company_name)
    `)
    .eq('id', id)
    .eq('buyer_id', user.id)
    .single();

  if (error || !order) notFound();

  const items = order.order_items || [];
  const total = Number(order.total_amount || 0);
  const currency = order.currency || 'FCFA';

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <Link
              href="/dashboard/buyer/orders"
              className="inline-flex items-center gap-2 text-shamar-body font-medium text-gray-500 hover:text-primary-600 mb-shamar-24 transition-colors"
            >
              <ArrowLeft size={20} />
              Retour aux commandes
            </Link>
            <div className="flex flex-wrap items-center justify-between gap-shamar-16">
              <div>
                <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
                  Commande <span className="text-primary-600">#{order.id?.slice(0, 8)}</span>
                </h1>
                <span className={`inline-block px-3 py-1 rounded-shamar-sm text-shamar-small font-semibold ${
                  order.status === 'DELIVERED' ? 'bg-success-500/20 text-gray-800' :
                  order.status === 'CANCELLED' ? 'bg-danger-500/20 text-red-800' :
                  'bg-warning-500/20 text-amber-700'
                }`}>
                  {order.status || '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-32">
            <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-shamar-16 border-l-4 border-primary-600 pl-shamar-16">Articles</h2>
            <div className="space-y-0 divide-y divide-gray-200">
              {items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center py-shamar-16 first:pt-0">
                  <span className="font-medium text-gray-700 text-shamar-body">
                    {item.product?.name || 'Produit'} <span className="text-gray-500 text-shamar-small">× {item.quantity}</span>
                  </span>
                  <span className="font-semibold text-primary-600 text-shamar-body">
                    {Number(item.price || 0) * Number(item.quantity || 0)} {currency}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-shamar-24 mt-shamar-24 border-t-2 border-gray-200 flex justify-between text-shamar-h2 font-semibold text-gray-900">
              <span>Total</span>
              <span className="text-primary-600">{total.toLocaleString()} {currency}</span>
            </div>
            {order.seller && (
              <div className="pt-shamar-16 mt-shamar-16 border-t border-gray-200 flex items-center gap-2 text-shamar-small font-medium text-gray-500">
                <span>Vendeur :</span>
                <span className="text-gray-900">{order.seller.company_name || order.seller.full_name || order.seller.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
