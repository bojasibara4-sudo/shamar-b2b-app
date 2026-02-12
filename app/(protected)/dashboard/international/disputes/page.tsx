import { requireAuth } from '@/lib/auth-guard';
import Link from 'next/link';
import { AlertTriangle, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function InternationalDisputesPage() {
  await requireAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Litiges Commerce International</h1>
        <p className="text-gray-400 mt-1">Produit non conforme, retard, perte cargo, fraude</p>
      </div>
      <div className="bg-brand-bleu-ardoise/50 rounded-2xl border border-brand-anthracite/50 p-12">
        <div className="flex flex-col items-center justify-center text-center py-12">
          <AlertTriangle className="h-16 w-16 text-amber-400 mb-4" />
          <p className="text-slate-400 font-medium mb-4">Centre de litiges international</p>
          <Link href="/disputes" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700">
            <FileText size={20} /> Voir tous les litiges
          </Link>
        </div>
      </div>
    </div>
  );
}
