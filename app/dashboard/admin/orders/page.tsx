import { requireAdmin } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { ordersDB, usersDB } from '@/lib/mock-data';
import OrderListClient from '@/components/orders/OrderListClient';

export default async function AdminOrdersPage() {
  requireAdmin();

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
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion des Commandes
            </h1>
            <p className="mt-2 text-gray-600">
              Gérez toutes les commandes de la plateforme
            </p>
          </div>
          <LogoutButton />
        </div>
      </div>

      <OrderListClient orders={formattedOrders} />
    </div>
  );
}

