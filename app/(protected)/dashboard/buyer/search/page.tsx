import { requireBuyer } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';

export const dynamic = 'force-dynamic';

export default async function BuyerSearchPage() {
  await requireBuyer();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                <span className="text-emerald-600">Recherche</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium">
                Recherchez des produits et fournisseurs
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Recherche Avancée</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto">
              Trouvez rapidement les produits et fournisseurs qui correspondent à vos besoins.
            </p>
            <p className="text-sm text-slate-400 mt-4 font-medium">
              Interface de recherche à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

