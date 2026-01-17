import { getCurrentUser } from '@/lib/auth';
import { Palmtree } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HostPropertiesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                Mes <span className="text-rose-600">Propriétés</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium">
                Gérez vos propriétés touristiques et hébergements
              </p>
            </div>
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
              Ajouter une propriété
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-12 text-center">
          <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Palmtree className="w-12 h-12 text-rose-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-3">Gestion des Propriétés</h3>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            Fonctionnalité en cours de développement. Vous pourrez bientôt gérer toutes vos propriétés touristiques.
          </p>
        </div>
      </div>
    </div>
  );
}
