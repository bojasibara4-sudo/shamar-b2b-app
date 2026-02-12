import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const supabase = await createClient();
  const { data: order, error } = await (supabase as any)
    .from('orders')
    .select(`
      *,
      order_items:order_items(*, product:products(id, name, price, currency)),
      buyer:users!orders_buyer_id_fkey(email, full_name, company_name),
      seller:users!orders_seller_id_fkey(email, full_name, company_name)
    `)
    .eq('id', id)
    .single();

  if (error || !order) {
    notFound();
  }

  const isBuyer = order.buyer_id === user.id;
  const isSeller = order.seller_id === user.id;
  if (!isBuyer && !isSeller && user.role !== 'admin') {
    notFound();
  }

  const items = order.order_items || [];
  const total = Number(order.total_amount || 0);
  const currency = order.currency || 'FCFA';

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-2 text-shamar-body font-medium text-gray-500 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft size={20} /> Retour aux commandes
          </Link>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-32">
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
              Commande <span className="text-primary-600">#{order.id?.slice(0, 8) || id}</span>
            </h1>
            <p className="text-shamar-body text-gray-500 font-medium mb-shamar-24">
              {new Date(order.created_at).toLocaleDateString('fr-FR')} — Statut :{' '}
              <span className="font-semibold text-gray-900">{order.status}</span>
            </p>

            <div className="space-y-shamar-16 border-t border-gray-200 pt-shamar-24">
              {items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex justify-between text-shamar-body"
                >
                  <span className="text-gray-700 font-medium">
                    {item.product?.name || 'Produit'} × {item.quantity}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {Number(item.price || 0) * (item.quantity || 0)} {currency}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-shamar-24 pt-shamar-24 border-t-2 border-gray-200 flex justify-between text-shamar-h2 font-semibold text-gray-900">
              <span>Total</span>
              <span>{total.toLocaleString()} {currency}</span>
            </div>

            <div className="mt-shamar-24 pt-shamar-24 border-t border-gray-200 flex flex-wrap gap-shamar-16">
              <Link
                href={`/payments/escrow/order/${id}`}
                className="inline-flex items-center gap-2 px-shamar-16 py-2 rounded-shamar-md bg-warning-500/20 text-amber-800 font-semibold text-shamar-small hover:bg-warning-500/30 transition-colors"
              >
                Statut escrow
              </Link>
              {isBuyer && (
                <Link
                  href={`/payments/confirm/${id}`}
                  className="inline-flex items-center gap-2 px-shamar-16 py-2 rounded-shamar-md bg-primary-600 text-gray-0 font-semibold text-shamar-small hover:bg-primary-700 transition-colors"
                >
                  Confirmer réception
                </Link>
              )}
              <Link
                href={`/disputes/new?order_id=${id}`}
                className="inline-flex items-center gap-2 px-shamar-16 py-2 rounded-shamar-md bg-danger-500/20 text-red-800 font-semibold text-shamar-small hover:bg-danger-500/30 transition-colors"
              >
                Ouvrir un litige
              </Link>
              <Link
                href={`/payments/invoice/${id}`}
                className="inline-flex items-center gap-2 px-shamar-16 py-2 rounded-shamar-md border border-gray-200 font-semibold text-shamar-small text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Facture / Reçu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
