import Link from 'next/link';
import { ArrowLeft, FileText, Shield } from 'lucide-react';

export const metadata = {
  title: 'Mentions légales',
  description: 'Conditions générales et politique de confidentialité - Shamar B2B',
};

export default function LegalHubPage() {
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

        <h1 className="text-shamar-h1 text-gray-900 mb-shamar-8 tracking-tight">
          Mentions <span className="text-primary-600">légales</span>
        </h1>
        <p className="text-shamar-body text-gray-500 mb-shamar-32">
          Conditions d&apos;utilisation et protection des données
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-shamar-24">
          <Link
            href="/legal/terms"
            className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-200 transition-all group"
          >
            <div className="flex items-center gap-shamar-16 mb-shamar-16">
              <div className="p-3 bg-primary-100 rounded-shamar-md">
                <FileText className="text-primary-600" size={28} />
              </div>
              <h2 className="text-shamar-h3 text-gray-900 group-hover:text-primary-600 transition-colors">
                Conditions générales
              </h2>
            </div>
            <p className="text-shamar-body text-gray-500">
              CGU et conditions d&apos;utilisation de la plateforme Shamar.
            </p>
            <span className="inline-flex items-center gap-1 mt-shamar-16 text-primary-600 font-semibold text-shamar-small">
              Lire →
            </span>
          </Link>

          <Link
            href="/legal/privacy"
            className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-200 transition-all group"
          >
            <div className="flex items-center gap-shamar-16 mb-shamar-16">
              <div className="p-3 bg-primary-100 rounded-shamar-md">
                <Shield className="text-primary-600" size={28} />
              </div>
              <h2 className="text-shamar-h3 text-gray-900 group-hover:text-primary-600 transition-colors">
                Politique de confidentialité
              </h2>
            </div>
            <p className="text-shamar-body text-gray-500">
              Collecte, utilisation et protection de vos données personnelles.
            </p>
            <span className="inline-flex items-center gap-1 mt-shamar-16 text-primary-600 font-semibold text-shamar-small">
              Lire →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
