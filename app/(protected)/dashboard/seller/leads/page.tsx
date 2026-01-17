import { requireSeller } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';

export const dynamic = 'force-dynamic';

export default async function SellerLeadsPage() {
  requireSeller();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                <span className="text-indigo-600">Leads</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium">
                Gérez vos leads et opportunités commerciales
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Gestion des Leads</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto">
              Suivez vos opportunités commerciales, vos prospects et convertissez-les en ventes.
            </p>
            <p className="text-sm text-slate-400 mt-4 font-medium">
              Interface de gestion des leads à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

