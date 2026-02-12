import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SettingsSecurityPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <Link
              href="/profile/settings"
              className="inline-flex items-center gap-2 text-shamar-body font-medium text-gray-500 hover:text-primary-600 transition-colors mb-shamar-16"
            >
              <ArrowLeft size={20} />
              Retour aux paramètres
            </Link>
            <div className="flex items-center gap-shamar-16 mb-2">
              <div className="p-3 bg-primary-100 rounded-shamar-md">
                <Shield className="text-primary-600" size={32} />
              </div>
              <div>
                <h1 className="text-shamar-h1 text-gray-900 tracking-tight">
                  <span className="text-primary-600">Sécurité</span>
                </h1>
                <p className="text-shamar-body text-gray-500 font-medium mt-1">
                  Mot de passe, 2FA, sessions actives
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-32">
            <p className="text-gray-600 font-medium text-shamar-body">
              Changement de mot de passe et gestion des sessions à implémenter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
