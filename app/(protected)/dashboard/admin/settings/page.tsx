import { requireAdmin } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { Settings } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  requireAdmin();

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-shamar-16">
              <div className="flex items-center gap-shamar-16">
                <div className="p-3 bg-primary-100 rounded-shamar-md">
                  <Settings className="text-primary-600" size={32} />
                </div>
                <div>
                  <h1 className="text-shamar-h1 text-gray-900 tracking-tight">
                    <span className="text-primary-600">Paramètres</span>
                  </h1>
                  <p className="text-shamar-body text-gray-500 font-medium mt-1">
                    Configurez les paramètres de la plateforme
                  </p>
                </div>
              </div>
              <LogoutButton />
            </div>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-32">
            <div className="text-center py-shamar-48">
              <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-shamar-24">
                <Settings className="w-12 h-12 text-primary-600" />
              </div>
              <h3 className="text-shamar-h2 text-gray-900 mb-shamar-16 font-semibold">Configuration de la plateforme</h3>
              <p className="text-gray-500 font-medium max-w-md mx-auto text-shamar-body leading-relaxed mb-shamar-24">
                Gérez les paramètres généraux, les préférences et la configuration de votre plateforme B2B.
              </p>
              <span className="inline-block px-shamar-16 py-2 bg-primary-50 text-primary-600 rounded-shamar-md border border-primary-200 text-shamar-small font-semibold">
                Interface de configuration à venir
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
