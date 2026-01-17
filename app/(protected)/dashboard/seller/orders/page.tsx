import { requireSeller } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { createClient } from '@/lib/supabase/server';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import OrderStatusSelector from '@/components/OrderStatusSelector';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                Mes <span className="text-indigo-600">Commandes</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium">
                Gérez vos commandes et ventes
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
          {orders.length === 0 ? (
            <p className="text-slate-500 text-center py-12 font-medium">Aucune commande</p>
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
                    className="border border-slate-200 rounded-[1.5rem] p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-sm font-black text-slate-900">
                            Commande #{order.id.slice(0, 8)}
                          </p>
                          <OrderStatusBadge status={orderStatus.toLowerCase() as any} />
                        </div>
                        <p className="text-xs text-slate-500 mb-1 font-medium">
                          {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          Acheteur: {order.buyer?.company_name || order.buyer?.full_name || order.buyer?.email || 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-slate-900">
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
                    <div className="mt-4 space-y-2 pt-4 border-t border-slate-100">
                      {orderItems.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-slate-600 font-medium">
                            {item.product?.name || 'Produit'} × {item.quantity}
                          </span>
                          <span className="text-slate-900 font-black">
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
  );
}
