import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

/**
 * Commandes reçues — sous « Pour moi » / Ma boutique (spec: /shop/orders)
 * Hub vers dashboard vendeur commandes.
 */
export default async function ProfileShopOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  if (user.role !== 'seller' && user.role !== 'admin') redirect('/profile/shop');

  return (
    <div className="max-w-shamar-container mx-auto px-4 py-shamar-24">
      <Link href="/profile/shop" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 mb-shamar-24">← Ma boutique</Link>
      <h1 className="text-shamar-h2 text-gray-900">Commandes reçues</h1>
      <p className="text-shamar-body text-gray-500 mt-1">Gérer les commandes de votre boutique.</p>

      <div className="mt-shamar-24 bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
        <div className="flex items-center gap-3 mb-shamar-16">
          <Package size={24} className="text-primary-600" />
          <div>
            <p className="font-semibold text-gray-900 text-shamar-body">Dashboard commandes vendeur</p>
            <p className="text-gray-500 text-shamar-small">Voir et gérer toutes vos commandes, statuts, expéditions.</p>
          </div>
        </div>
        <Link
          href="/dashboard/seller/orders"
          className="inline-flex items-center gap-2 px-shamar-16 py-2 bg-primary-600 text-gray-0 rounded-shamar-md font-medium text-shamar-small hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Ouvrir mes commandes →
        </Link>
      </div>
    </div>
  );
}
