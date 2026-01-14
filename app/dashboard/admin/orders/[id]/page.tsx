import { requireAdmin } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { ordersDB, usersDB } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import OrderStatusSelector from '@/components/OrderStatusSelector';

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  requireAdmin();
  const order = ordersDB.getById(params.id);

  if (!order) {
    notFound();
  }

  const allUsers = usersDB.getAll();
  const userMap = new Map(allUsers.map((u) => [u.id, u.email]));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Commande #{order.id}
            </h1>
            <p className="mt-2 text-gray-600">
              Gestion de la commande
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
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {order.total.toFixed(2)} €
            </p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Modifier le statut
          </h2>
          <OrderStatusSelector orderId={order.id} currentStatus={order.status} />
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Acheteur</p>
              <p className="font-semibold text-gray-900">
                {userMap.get(order.buyerId) || order.buyerId}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date de création</p>
              <p className="font-semibold text-gray-900">
                {new Date(order.createdAt).toLocaleString('fr-FR')}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Produits</h2>
          <div className="space-y-4">
            {order.products.map((product) => (
              <div
                key={product.productId}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    Quantité: {product.quantity} × {product.price.toFixed(2)} €
                  </p>
                </div>
                <p className="font-bold text-gray-900">
                  {(product.price * product.quantity).toFixed(2)} €
                </p>
              </div>
            ))}
          </div>
        </div>

        {order.statusHistory.length > 0 && (
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Historique
            </h2>
            <div className="space-y-2">
              {order.statusHistory.map((history, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <OrderStatusBadge status={history.status} />
                  <span className="text-sm text-gray-500">
                    {new Date(history.changedAt).toLocaleString('fr-FR')}
                    {history.note && ` - ${history.note}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

