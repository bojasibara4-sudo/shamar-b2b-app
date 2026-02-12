import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Conditions générales',
  description: "Conditions générales d'utilisation de Shamar B2B",
};

export default function LegalTermsPage() {
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
            Conditions générales d&apos;utilisation
          </h1>
          <div className="prose prose-lg max-w-none text-gray-600 text-shamar-body">
            <p className="text-shamar-body-lg text-gray-700 mb-shamar-24">
              Bienvenue sur Shamar. En utilisant notre plateforme, vous acceptez les conditions suivantes.
            </p>
            <div className="p-shamar-16 bg-gray-50 rounded-shamar-md border border-gray-200 my-shamar-24">
              <p className="font-medium text-gray-500 italic text-shamar-body">
                Le contenu juridique complet doit être rédigé et validé par un expert légal.
              </p>
            </div>
            <h3 className="text-shamar-h4 text-gray-900 mt-shamar-24 mb-shamar-8">1. Acceptation des conditions</h3>
            <p className="mb-shamar-16">L&apos;accès à nos services implique l&apos;acceptation sans réserve des présentes conditions.</p>
            <h3 className="text-shamar-h4 text-gray-900 mt-shamar-24 mb-shamar-8">2. Services proposés</h3>
            <p>Shamar est une plateforme de mise en relation B2B...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
