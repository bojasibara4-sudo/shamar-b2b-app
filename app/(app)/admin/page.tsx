import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { Users, Package, DollarSign, Settings } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  if (user.role !== 'admin') {
    redirect('/app/dashboard');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
        <p className="mt-2 text-gray-600">
          Gérer la plateforme et les utilisateurs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/dashboard/admin/users"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Utilisateurs</h3>
          <p className="text-sm text-gray-600 mt-2">Gérer les utilisateurs</p>
        </Link>

        <Link
          href="/dashboard/admin/orders"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <Package className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Commandes</h3>
          <p className="text-sm text-gray-600 mt-2">Toutes les commandes</p>
        </Link>

        <Link
          href="/dashboard/admin/commissions"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Commissions</h3>
          <p className="text-sm text-gray-600 mt-2">Gérer les commissions</p>
        </Link>

        <Link
          href="/dashboard/admin/settings"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <Settings className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Paramètres</h3>
          <p className="text-sm text-gray-600 mt-2">Configuration</p>
        </Link>
      </div>
    </div>
  );
}
