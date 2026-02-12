import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { ArrowLeft, History } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ChinaTransactionsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32">
          <Link href="/china/wallet" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 font-medium">
            <ArrowLeft size={16} /> Retour au portefeuille
          </Link>
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight flex items-center gap-2">
            <History size={28} className="text-primary-600" /> Historique des transactions
          </h1>
          <p className="text-shamar-body text-gray-500">Toutes les opérations (dépôt, blocage escrow, libération, retrait).</p>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <p className="text-gray-600 mb-shamar-24">Liste des transactions à connecter (API wallet/history).</p>
            <Link href="/dashboard/wallet/history" className="text-primary-600 font-semibold hover:underline">
              Voir l’historique du portefeuille global →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
