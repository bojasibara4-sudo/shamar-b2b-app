import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import WalletHistoryClient from '@/components/finance/WalletHistoryClient';

export const dynamic = 'force-dynamic';

export default async function WalletHistoryPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div>
            <Link href="/dashboard/wallet" className="text-shamar-small font-medium text-gray-500 hover:text-primary-600">
              ← Portefeuille
            </Link>
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight mt-2 mb-2">
              Historique des transactions
            </h1>
            <p className="text-shamar-body text-gray-500 font-medium">
              Date, référence, module, type, montant, statut
            </p>
          </div>

          <WalletHistoryClient />
        </div>
      </div>
    </div>
  );
}
