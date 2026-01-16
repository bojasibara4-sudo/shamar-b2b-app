import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function PaymentsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  
  // Récupérer les paiements (si table existe)
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Paiements
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">
          Historique des paiements. Fonctionnalité en cours de développement.
        </p>
      </div>
    </div>
  );
}
