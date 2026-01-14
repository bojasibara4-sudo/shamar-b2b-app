import { requireAdmin } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export default async function AdminDashboardPage() {
  const user = requireAdmin();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tableau de bord Administrateur
            </h1>
            <p className="mt-2 text-gray-600">
              Bienvenue, <span className="font-semibold">{user.email}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Vue d'ensemble de la plateforme SHAMAR B2B
            </p>
          </div>
          <LogoutButton />
        </div>
      </div>

      <AdminDashboardClient />
    </div>
  );
}

