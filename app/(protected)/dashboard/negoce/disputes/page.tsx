import { requireAuth } from '@/lib/auth-guard';
import Link from 'next/link';
import { AlertTriangle, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function NegoceDisputesPage() {
  await requireAuth();

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div>
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Litiges Négoce Matières Premières</h1>
            <p className="text-shamar-small text-gray-500 mt-1">Non conformité qualité, retard, fraude, quantité incorrecte</p>
          </div>
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <div className="flex flex-col items-center justify-center text-center py-shamar-48">
              <AlertTriangle className="h-16 w-16 text-warning-500 mb-shamar-16" />
              <p className="text-gray-500 font-medium mb-shamar-16">Centre de litiges négoce</p>
              <Link href="/disputes" className="inline-flex items-center gap-2 px-shamar-24 py-shamar-12 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700 transition-colors">
                <FileText size={20} /> Voir tous les litiges
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
