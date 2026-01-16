import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function HostPaymentsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Paiements Host
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">
          Gestion des paiements host. Fonctionnalité en cours de développement.
        </p>
      </div>
    </div>
  );
}
