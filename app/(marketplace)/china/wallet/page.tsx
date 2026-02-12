import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';
import { Wallet, ArrowDownToLine, ArrowUpFromLine, History } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ChinaWalletPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

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
        <div className="space-y-shamar-32">
          <div>
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Portefeuille Sourcing Chine</h1>
            <p className="text-shamar-body text-gray-500 mt-1">Solde, fonds bloqués (escrow), libérés.</p>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <div className="flex items-center gap-shamar-16 mb-shamar-24">
              <div className="p-3 bg-primary-100 rounded-shamar-md">
                <Wallet className="text-primary-600" size={32} />
              </div>
              <div>
                <h2 className="text-shamar-h2 text-gray-900">Solde</h2>
                <p className="text-shamar-body text-gray-500">Disponible et bloqué</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-shamar-24">
              <div className="p-shamar-24 rounded-shamar-md bg-gray-50 border border-gray-200">
                <p className="text-shamar-small text-gray-500">Disponible</p>
                <p className="text-shamar-h2 text-primary-600 font-bold mt-1">
                  {Number(data.available ?? 0).toLocaleString()} {data.currency ?? 'FCFA'}
                </p>
              </div>
              <div className="p-shamar-24 rounded-shamar-md bg-gray-50 border border-gray-200">
                <p className="text-shamar-small text-gray-500">Bloqué (escrow)</p>
                <p className="text-shamar-h2 text-gray-900 font-bold mt-1">
                  {Number(data.blocked ?? 0).toLocaleString()} {data.currency ?? 'FCFA'}
                </p>
              </div>
              <div className="p-shamar-24 rounded-shamar-md bg-gray-50 border border-gray-200">
                <p className="text-shamar-small text-gray-500">Total dépensé</p>
                <p className="text-shamar-h2 text-gray-900 font-bold mt-1">
                  {Number(data.total_spent ?? 0).toLocaleString()} {data.currency ?? 'FCFA'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-shamar-16">
            <Link href="/china/transactions" className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:underline">
              <History size={20} /> Historique des transactions
            </Link>
            <Link href="/dashboard/wallet" className="inline-flex items-center gap-2 text-gray-600 font-medium hover:underline">
              Portefeuille global
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
