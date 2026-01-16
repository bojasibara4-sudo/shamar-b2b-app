import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function HostPropertiesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Mes Propriétés
      </h1>

      <div className="mb-6">
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
          Ajouter une propriété
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">
          Gestion des propriétés. Fonctionnalité en cours de développement.
        </p>
      </div>
    </div>
  );
}
