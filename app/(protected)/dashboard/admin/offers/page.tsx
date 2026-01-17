import { requireAdmin } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';

export const dynamic = 'force-dynamic';

export default async function AdminOffersPage() {
  requireAdmin();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                Gestion des <span className="text-orange-600">Offres</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium">
                Gérez les offres et propositions de la plateforme
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Gestion des Offres</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto">
              Gérez toutes les offres et propositions commerciales de la plateforme.
            </p>
            <p className="text-sm text-slate-400 mt-4 font-medium">
              Interface de gestion des offres à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

