import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité de Shamar B2B',
};

export default function LegalPrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 py-shamar-24 lg:py-shamar-40">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 font-medium mb-shamar-24"
        >
          <ArrowLeft size={16} />
          Retour à l&apos;accueil
        </Link>
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 md:p-shamar-32 shadow-shamar-soft">
          <h1 className="text-shamar-h1 text-gray-900 mb-shamar-24 tracking-tight">
            Politique de confidentialité
          </h1>
          <div className="prose prose-lg max-w-none text-gray-600 text-shamar-body">
            <p className="text-shamar-body-lg text-gray-700 mb-shamar-24">
              Chez Shamar, la protection de vos données personnelles est une priorité absolue.
            </p>
            <div className="p-shamar-16 bg-gray-50 rounded-shamar-md border border-gray-200 my-shamar-24">
              <p className="font-medium text-gray-500 italic text-shamar-body">
                Le contenu juridique complet doit être rédigé et validé par un expert légal.
              </p>
            </div>
            <h3 className="text-shamar-h4 text-gray-900 mt-shamar-24 mb-shamar-8">1. Collecte des données</h3>
            <p className="mb-shamar-16">Nous collectons uniquement les données nécessaires au bon fonctionnement du service...</p>
            <h3 className="text-shamar-h4 text-gray-900 mt-shamar-24 mb-shamar-8">2. Utilisation des données</h3>
            <p>Vos données sont utilisées pour gérer vos commandes, améliorer nos services et communiquer avec vous.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
