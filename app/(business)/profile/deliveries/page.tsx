import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { getBuyerDeliveries, type Delivery } from '@/services/delivery.service';
import { Truck } from 'lucide-react';

export const dynamic = 'force-dynamic';

const statusLabel: { [key: string]: string } = {
  pending: 'En attente',
  shipped: 'Expédié',
  delivered: 'Livré',
};

export default async function ProfileDeliveriesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  const deliveries: Delivery[] = await getBuyerDeliveries(user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        href="/profile"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6"
      >
        ← Retour Pour moi
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Mes livraisons
      </h1>

      <p className="text-gray-500 mb-6">
        Tous les colis liés à vos commandes.
      </p>

      <div className="space-y-4">
        {deliveries.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Truck size={28} className="mx-auto text-gray-400 mb-3" />
            <p className="font-medium text-gray-700">Aucune livraison</p>
          </div>
        ) : (
          deliveries.map((delivery) => {
            return (
              <Link
                key={delivery.id}
                href={`/profile/deliveries/${delivery.id}`}
                className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Commande {delivery.order_id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(delivery.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {statusLabel[delivery.status] || delivery.status}
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
