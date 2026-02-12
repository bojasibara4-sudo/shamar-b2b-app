import { requireSeller } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { createClient } from '@/lib/supabase/server';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import OrderStatusSelector from '@/components/OrderStatusSelector';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SellerOrdersPage() {
  const user = await requireSeller();

  const supabase = await createClient();
  
  // Récupérer les commandes où le vendeur est le seller_id
  let orders: any[] = [];
  const { data, error } = await (supabase as any)
      .from('orders')
      .select(`
        *,
        order_items:order_items(
          *,
          product:products(id, name, price, currency)
        ),
        buyer:users!orders_buyer_id_fkey(email, full_name, company_name)
      `)
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

  if (!error && data) {
    orders = data;
  }

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-shamar-16">
            <div>
              <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
                Mes <span className="text-primary-600">Commandes</span>
              </h1>
              <p className="text-shamar-body text-gray-500 font-medium">
                Gérez vos commandes et ventes
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-24">
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-shamar-48 font-medium text-shamar-body">Aucune commande</p>
          ) : (
            <div className="space-y-shamar-16">
              {orders.map((order) => {
                const orderItems = order.order_items || [];
                const orderTotal = Number(order.total_amount || 0);

                // Utiliser le statut directement en majuscules (comme dans le schéma Supabase)
                const orderStatus = order.status || 'PENDING';

                return (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-shamar-md p-shamar-24 hover:shadow-shamar-soft transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Link
                            href={`/dashboard/orders/${order.id}`}
                            className="text-shamar-small font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                          >
                            Commande #{order.id.slice(0, 8)}
                          </Link>
                          <Link
                            href={`/dashboard/seller/orders/${order.id}/prepare`}
                            className="text-shamar-caption font-medium text-primary-600 hover:underline"
                          >
                            Préparer expédition
                          </Link>
                          <OrderStatusBadge status={orderStatus.toLowerCase() as any} />
                        </div>
                        <p className="text-shamar-caption text-gray-500 mb-1 font-medium">
                          {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-shamar-caption text-gray-500 font-medium">
                          Acheteur: {order.buyer?.company_name || order.buyer?.full_name || order.buyer?.email || 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-shamar-body font-semibold text-gray-900">
                          {orderTotal.toLocaleString()} {order.currency || 'FCFA'}
                        </p>
                        <div className="mt-2">
                          <OrderStatusSelector 
                            orderId={order.id} 
                            currentStatus={orderStatus} 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-shamar-16 space-y-2 pt-shamar-16 border-t border-gray-100">
                      {orderItems.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-shamar-small"
                        >
                          <span className="text-gray-600 font-medium">
                            {item.product?.name || 'Produit'} × {item.quantity}
                          </span>
                          <span className="text-gray-900 font-semibold">
                            {(Number(item.price) * item.quantity).toLocaleString()} {item.product?.currency || order.currency || 'FCFA'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
