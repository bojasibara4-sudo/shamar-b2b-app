import { requireAdmin } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { getOrdersForAdmin } from '@/services/order.service';
import OrderListClient from '@/components/orders/OrderListClient';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  await requireAdmin();

  const orders = await getOrdersForAdmin();
  const orderItems = (o: any) => o.order_items || [];
  const productName = (o: any) =>
    orderItems(o)
      .map((i: any) => i.product?.name)
      .filter(Boolean)
      .join(', ') || 'Commande';
  const quantity = (o: any) =>
    orderItems(o).reduce((sum: number, i: any) => sum + (Number(i.quantity) || 0), 0);

  const formattedOrders = orders.map((order: any) => ({
    id: order.id,
    productName: productName(order),
    quantity: quantity(order),
    totalAmount: Number(order.total_amount ?? 0),
    status: (order.status || 'pending').toString().toLowerCase() as
      | 'pending'
      | 'confirmed'
      | 'shipped'
      | 'completed'
      | 'cancelled',
    date: order.created_at
      ? new Date(order.created_at).toLocaleDateString('fr-FR')
      : '',
    sellerName: order.seller?.email ?? order.seller?.full_name ?? undefined,
    buyerName: order.buyer?.email ?? order.buyer?.full_name ?? undefined,
  }));

  return (
    <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-shamar-16">
            <div>
              <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
                Gestion des <span className="text-primary-600">Commandes</span>
              </h1>
              <p className="text-shamar-body text-gray-500 font-medium">
                Gérez toutes les commandes de la plateforme
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <OrderListClient orders={formattedOrders} basePath="/dashboard/orders" />
      </div>
    </div>
  );
}

