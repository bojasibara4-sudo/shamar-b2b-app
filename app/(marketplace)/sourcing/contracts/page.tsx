import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SourcingContractsListPage() {
  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <Link href="/sourcing" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 text-shamar-small mb-shamar-24">
        <ArrowLeft size={16} /> Retour au hub Sourcing
      </Link>
      <h1 className="text-shamar-h2 text-gray-900">Contrats</h1>
      <p className="mt-1 text-shamar-body text-gray-500">Contrat PDF, conditions, quantités, prix final, délais, signature électronique. Statuts : draft, signé, actif, terminé.</p>
      <div className="mt-shamar-32 p-shamar-24 rounded-shamar-md border border-gray-200 bg-gray-0 text-gray-600 shadow-shamar-soft">
        Liste contrats à connecter. <Link href="/international" className="text-primary-600 hover:underline font-medium">International</Link>, <Link href="/dashboard/negoce/buyer/contracts" className="text-primary-600 hover:underline font-medium">Négoce contrats</Link>.
      </div>
      </div>
    </div>
  );
}
