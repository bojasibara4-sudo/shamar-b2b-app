import { requireSeller } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import OrderStatusSelector from '@/components/OrderStatusSelector';

export const dynamic = 'force-dynamic';

export default async function SellerOrdersPage() {
  const user = await requireSeller();

  const supabase = createSupabaseServerClient();
  
  // Récupérer les commandes où le vendeur est le seller_id
  let orders: any[] = [];
  if (supabase) {
    const { data, error } = await supabase
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
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Commandes</h1>
            <p className="mt-2 text-gray-600">Gérez vos commandes et ventes</p>
          </div>
          <LogoutButton />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {orders.length === 0 ? (
          <p className="text-gray-600">Aucune commande</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const orderItems = order.order_items || [];
              const orderTotal = Number(order.total_amount || 0);

              // Utiliser le statut directement en majuscules (comme dans le schéma Supabase)
              const orderStatus = order.status || 'PENDING';

              return (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-sm font-semibold text-gray-900">
                          Commande #{order.id.slice(0, 8)}
                        </p>
                        <OrderStatusBadge status={orderStatus.toLowerCase() as any} />
                      </div>
                      <p className="text-xs text-gray-500 mb-1">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-xs text-gray-500">
                        Acheteur: {order.buyer?.company_name || order.buyer?.full_name || order.buyer?.email || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
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
                  <div className="mt-3 space-y-1 pt-3 border-t border-gray-100">
                    {orderItems.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-600">
                          {item.product?.name || 'Produit'} × {item.quantity}
                        </span>
                        <span className="text-gray-900 font-medium">
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
  );
}
