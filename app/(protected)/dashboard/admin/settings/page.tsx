import { requireAdmin } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  requireAdmin();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                <span className="text-orange-600">Paramètres</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium">
                Configurez les paramètres de la plateforme
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Configuration de la Plateforme</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto">
              Gérez les paramètres généraux, les préférences et la configuration de votre plateforme B2B.
            </p>
            <p className="text-sm text-slate-400 mt-4 font-medium">
              Interface de configuration des paramètres à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


