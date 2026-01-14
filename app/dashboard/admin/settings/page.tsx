import { requireAdmin } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';

export default async function AdminSettingsPage() {
  requireAdmin();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Paramètres
            </h1>
            <p className="mt-2 text-gray-600">
              Configurez les paramètres de la plateforme
            </p>
          </div>
          <LogoutButton />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600">
          Interface de configuration des paramètres à venir.
        </p>
      </div>
    </div>
  );
}


