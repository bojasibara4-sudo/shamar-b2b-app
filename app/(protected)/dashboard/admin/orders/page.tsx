import { requireAdmin } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { ordersDB, usersDB } from '@/lib/mock-data';
import OrderListClient from '@/components/orders/OrderListClient';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  await requireAdmin();

  const orders = ordersDB.getAll();
  const allUsers = usersDB.getAll();
  const userMap = new Map(allUsers.map((u) => [u.id, u.email]));

  // Convertir les commandes au format attendu par OrderListClient
  const formattedOrders = orders.map(order => ({
    id: order.id,
    productName: order.products.map(p => p.name).join(', ') || 'Commande',
    quantity: order.products.reduce((sum, p) => sum + p.quantity, 0),
    totalAmount: order.total,
    status: order.status.toLowerCase() as 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled',
    date: new Date(order.createdAt).toLocaleDateString('fr-FR'),
    sellerName: order.products[0]?.sellerId ? userMap.get(order.products[0].sellerId) : undefined,
    buyerName: userMap.get(order.buyerId),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                Gestion des <span className="text-orange-600">Commandes</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium">
                Gérez toutes les commandes de la plateforme
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <OrderListClient orders={formattedOrders} basePath="/dashboard/admin/orders" />
      </div>
    </div>
  );
}

