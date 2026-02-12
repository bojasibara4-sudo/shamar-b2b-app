import { getCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Wallet, ArrowDownToLine, ArrowUpFromLine, History } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function WalletPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const cookieStore = await cookies();
  const res = await fetch(`${base}/api/wallet`, {
    headers: { Cookie: cookieStore.toString() },
    cache: 'no-store',
  });
  const data = res.ok ? await res.json() : { available: 0, blocked: 0, total_spent: 0, currency: 'FCFA' };

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <div className="flex items-center gap-shamar-16 mb-2">
              <div className="p-3 bg-primary-100 rounded-shamar-md">
                <Wallet className="text-primary-600" size={32} />
              </div>
              <div>
                <h1 className="text-shamar-h1 text-gray-900 tracking-tight">
                  <span className="text-primary-600">Portefeuille</span>
                </h1>
                <p className="text-shamar-body text-gray-500 font-medium mt-1">
                  Solde, fonds bloqués et historique
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-shamar-24">
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-primary-100 rounded-shamar-md">
                  <Wallet className="text-primary-600" size={24} />
                </div>
                <span className="text-gray-500 font-medium text-shamar-small">Disponible</span>
              </div>
              <p className="text-shamar-h2 font-semibold text-gray-900">
                {Number(data.available || 0).toLocaleString()} {data.currency || 'FCFA'}
              </p>
              {user.role === 'seller' && (
                <Link
                  href="/dashboard/wallet/withdraw"
                  className="mt-shamar-16 inline-flex items-center gap-2 text-primary-600 font-semibold hover:underline text-shamar-small"
                >
                  <ArrowUpFromLine size={18} /> Retirer
                </Link>
              )}
            </div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-warning-500/20 rounded-shamar-md">
                  <ArrowDownToLine className="text-amber-600" size={24} />
                </div>
                <span className="text-gray-500 font-medium text-shamar-small">Bloqué (escrow)</span>
              </div>
              <p className="text-shamar-h2 font-semibold text-gray-900">
                {Number(data.blocked || 0).toLocaleString()} {data.currency || 'FCFA'}
              </p>
            </div>
            {user.role === 'buyer' && data.total_spent != null && (
              <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-gray-100 rounded-shamar-md">
                    <Wallet className="text-gray-600" size={24} />
                  </div>
                  <span className="text-gray-500 font-medium text-shamar-small">Total dépensé</span>
                </div>
                <p className="text-shamar-h2 font-semibold text-gray-900">
                  {Number(data.total_spent || 0).toLocaleString()} {data.currency || 'FCFA'}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-shamar-16">
            <Link
              href="/dashboard/wallet/history"
              className="inline-flex items-center gap-2 px-shamar-24 py-3 rounded-shamar-md bg-gray-900 text-gray-0 font-semibold hover:bg-gray-800 transition-colors text-shamar-body"
            >
              <History size={20} /> Historique
            </Link>
            <Link
              href="/payments"
              className="inline-flex items-center gap-2 px-shamar-24 py-3 rounded-shamar-md border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-shamar-body"
            >
              Paiements
            </Link>
            <Link
              href="/dashboard/finance"
              className="inline-flex items-center gap-2 px-shamar-24 py-3 rounded-shamar-md border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-shamar-body"
            >
              Dashboard finance
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
