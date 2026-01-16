import { requireSeller } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import SellerDashboardClient from '@/components/seller/SellerDashboardClient';

export const dynamic = 'force-dynamic';

export default async function SellerDashboardPage() {
  const user = await requireSeller();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tableau de bord Vendeur
            </h1>
            <p className="mt-2 text-gray-600">
              Bienvenue, <span className="font-semibold">{user.email}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Gérez vos produits, commandes et ventes
            </p>
          </div>
          <LogoutButton />
        </div>
      </div>

      <SellerDashboardClient />
    </div>
  );
}

