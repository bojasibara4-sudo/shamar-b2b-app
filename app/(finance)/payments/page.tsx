import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PaymentsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  
  // Récupérer les paiements (si table existe)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
              <span className="text-emerald-600">Paiements</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium">
              Historique de vos transactions et paiements
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-12 text-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <DollarSign className="w-12 h-12 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-3">Historique des Paiements</h3>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            Fonctionnalité en cours de développement. Vous pourrez bientôt consulter l'historique complet de vos transactions.
          </p>
        </div>
      </div>
    </div>
  );
}
