import { requireSeller } from '@/lib/auth-guard';
import { AuthGuard } from '@/components/AuthGuard';
import { getVendorDeliveries } from '@/services/delivery.service';
import Link from 'next/link';
import { Truck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SellerDeliveriesPage() {
  const user = await requireSeller();

  const deliveries = await getVendorDeliveries(user.id);

  return (
    <AuthGuard requiredRole="seller">
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <div className="flex items-center gap-shamar-16 mb-2">
              <div className="p-3 bg-primary-100 rounded-shamar-md">
                <Truck className="text-primary-600" size={32} />
              </div>
              <div>
                <h1 className="text-shamar-h1 text-gray-900 tracking-tight">
                  Livraisons <span className="text-primary-600">à effectuer</span>
                </h1>
                <p className="text-shamar-body text-gray-500 font-medium mt-1">
                  Gérez les livraisons de vos commandes
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-32">
            <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-shamar-16">Liste des livraisons</h2>
            {deliveries.length === 0 ? (
              <div className="text-center py-shamar-48">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-shamar-24">
                  <Truck className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium text-shamar-body">Aucune livraison en attente.</p>
                <p className="text-gray-500 text-shamar-small mt-2">Dès qu&apos;une commande sera validée, elle s&apos;affichera ici.</p>
              </div>
            ) : (
              <div className="space-y-0 divide-y divide-gray-200">
                {deliveries.map((d) => (
                  <Link
                    key={d.id}
                    href="/dashboard/seller/orders"
                    className="block py-shamar-16 px-shamar-16 rounded-shamar-md border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors first:pt-0"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 text-shamar-body">Commande #{d.order_id?.slice(0, 8)}</span>
                      <span className={`px-3 py-1 rounded-shamar-sm text-shamar-small font-semibold ${
                        d.status === 'delivered' ? 'bg-success-500/20 text-emerald-700' :
                        d.status === 'shipped' ? 'bg-primary-100 text-primary-700' :
                        'bg-warning-500/20 text-amber-700'
                      }`}>
                        {d.status === 'delivered' ? 'Livré' : d.status === 'shipped' ? 'Expédié' : 'En attente'}
                      </span>
                    </div>
                    {d.tracking_code && (
                      <p className="text-shamar-small text-gray-500 mt-1">Suivi : {d.tracking_code}</p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </AuthGuard>
  );
}
