import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ExporterOfferNewPage() {
  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 max-w-2xl">
          <Link href="/dashboard/exporter/offers" className="inline-flex items-center gap-2 text-shamar-body text-gray-500 hover:text-primary-600 font-medium">
            <ArrowLeft size={20} /> Retour
          </Link>
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Nouvelle offre</h1>
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <p className="text-shamar-body text-gray-500">Formulaire de publication d&apos;offre (à venir)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
