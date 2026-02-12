import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { ArrowLeft, Building2, MapPin, FileCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ChinaCompanyPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32">
          <div>
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Profil entreprise importateur</h1>
            <p className="text-shamar-body text-gray-500 mt-1">Infos société, adresses livraison, KYC entreprise, documents légaux.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-shamar-24">
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
              <Building2 className="h-10 w-10 text-primary-600 mb-shamar-16" />
              <h2 className="text-shamar-h3 text-gray-900 mb-shamar-16">Informations société</h2>
              <p className="text-shamar-body text-gray-500">Raison sociale, SIRET, TVA, contact. Formulaire à connecter au profil utilisateur / entreprise.</p>
            </div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
              <MapPin className="h-10 w-10 text-primary-600 mb-shamar-16" />
              <h2 className="text-shamar-h3 text-gray-900 mb-shamar-16">Adresses livraison</h2>
              <p className="text-shamar-body text-gray-500">Entrepôt, port de dédouanement. À gérer depuis le profil.</p>
              <Link href="/profile/addresses" className="inline-block mt-shamar-16 text-primary-600 font-semibold hover:underline">
                Gérer les adresses →
              </Link>
            </div>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <FileCheck className="h-10 w-10 text-primary-600 mb-shamar-16" />
            <h2 className="text-shamar-h3 text-gray-900 mb-shamar-16">KYC entreprise & documents légaux</h2>
            <p className="text-shamar-body text-gray-500">Statut KYC, documents déposés. À connecter au module KYC existant.</p>
            <Link href="/profile/kyc" className="inline-block mt-shamar-16 text-primary-600 font-semibold hover:underline">
              Voir mon KYC →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
