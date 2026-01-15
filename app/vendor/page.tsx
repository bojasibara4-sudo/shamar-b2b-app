import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { Package, ShoppingCart, TrendingUp, Store } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function VendorPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'seller') {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Espace vendeur</h1>
        <p className="mt-2 text-gray-600">
          Gérez vos produits, commandes et statistiques
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/dashboard/seller/products"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <Package className="h-8 w-8 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Mes produits</h3>
          <p className="text-sm text-gray-600 mt-2">Gérer mes produits</p>
        </Link>

        <Link
          href="/dashboard/seller/orders"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Mes commandes</h3>
          <p className="text-sm text-gray-600 mt-2">Voir mes ventes</p>
        </Link>

        <Link
          href="/dashboard/seller/analytics"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Analytiques</h3>
          <p className="text-sm text-gray-600 mt-2">Statistiques de vente</p>
        </Link>

        <Link
          href="/dashboard/seller/onboarding"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <Store className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Ma boutique</h3>
          <p className="text-sm text-gray-600 mt-2">Gérer ma boutique</p>
        </Link>
      </div>
    </div>
  );
}
