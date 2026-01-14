import { requireBuyer } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import PayButton from '@/components/PayButton';

export default async function BuyerOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = requireBuyer();
  
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    notFound();
  }

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items:order_items(
        *,
        product:products(id, name, description, price, currency)
      ),
      seller:users!orders_seller_id_fkey(email, full_name, company_name),
      payments:payments(
        id,
        status,
        amount,
        provider,
        transaction_id,
        created_at
      )
    `)
    .eq('id', params.id)
    .eq('buyer_id', user.id)
    .single();

  if (error || !order) {
    notFound();
  }

  const successfulPayment = order.payments?.find((p: any) => p.status === 'SUCCESS');
  const isPaid = !!successfulPayment;
  const canPay = order.status === 'PENDING' && !isPaid;

  // Convertir le statut pour l'affichage
  const statusMap: Record<string, string> = {
    'PENDING': 'PENDING',
    'CONFIRMED': 'CONFIRMED',
    'PROCESSING': 'PROCESSING',
    'SHIPPED': 'SHIPPED',
    'DELIVERED': 'DELIVERED',
    'CANCELLED': 'CANCELLED',
  };
  const displayStatus = statusMap[order.status] || 'PENDING';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Commande #{order.id}
            </h1>
            <p className="mt-2 text-gray-600">
              Détails de votre commande
            </p>
          </div>
          <LogoutButton />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Statut</p>
            <div className="mt-1">
              <OrderStatusBadge status={displayStatus.toLowerCase()} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {Number(order.total_amount || 0).toLocaleString()} {order.currency || 'FCFA'}
            </p>
            {canPay && (
              <div className="mt-3">
                <PayButton
                  orderId={order.id}
                  amount={Number(order.total_amount || 0)}
                  currency={order.currency || 'FCFA'}
                  isPaid={isPaid}
                />
              </div>
            )}
            {isPaid && (
              <div className="mt-3">
                <PayButton
                  orderId={order.id}
                  amount={Number(order.total_amount || 0)}
                  currency={order.currency || 'FCFA'}
                  isPaid={true}
                />
              </div>
            )}
          </div>
        </div>

        {isPaid && successfulPayment && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-green-800">Paiement effectué</p>
            <p className="text-xs text-green-600 mt-1">
              Transaction ID: {successfulPayment.transaction_id || 'N/A'}
            </p>
            <p className="text-xs text-green-600">
              Date: {new Date(successfulPayment.created_at).toLocaleString('fr-FR')}
            </p>
          </div>
        )}

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Produits</h2>
          <div className="space-y-4">
            {order.order_items?.map((item: any) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-900">{item.product?.name || 'Produit'}</p>
                  <p className="text-sm text-gray-500">
                    Quantité: {item.quantity} × {Number(item.price).toLocaleString()} {item.product?.currency || order.currency || 'FCFA'}
                  </p>
                </div>
                <p className="font-bold text-gray-900">
                  {(Number(item.price) * item.quantity).toLocaleString()} {item.product?.currency || order.currency || 'FCFA'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Vendeur:</span>
              <span className="text-gray-900 font-medium">
                {order.seller?.company_name || order.seller?.full_name || order.seller?.email || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date de commande:</span>
              <span className="text-gray-900 font-medium">
                {new Date(order.created_at).toLocaleString('fr-FR')}
              </span>
            </div>
            {order.updated_at && (
              <div className="flex justify-between">
                <span className="text-gray-500">Dernière mise à jour:</span>
                <span className="text-gray-900 font-medium">
                  {new Date(order.updated_at).toLocaleString('fr-FR')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

