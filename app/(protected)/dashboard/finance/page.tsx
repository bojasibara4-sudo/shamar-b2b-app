import { getCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Wallet, TrendingUp, Lock, Banknote, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function FinanceDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const cookieStore = await cookies();
  const res = await fetch(`${base}/api/finance/dashboard`, {
    headers: { Cookie: cookieStore.toString() },
    cache: 'no-store',
  });
  const data = res.ok ? await res.json() : {};

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
                  Dashboard <span className="text-primary-600">finance</span>
                </h1>
                <p className="text-shamar-body text-gray-500 font-medium mt-1">
                  Synthèse revenus, escrow et commissions
                </p>
              </div>
            </div>
          </div>

          {data.role === 'seller' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-shamar-16">
              <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
                <div className="flex items-center gap-2 text-gray-500 text-shamar-small font-medium mb-1">
                  <TrendingUp size={18} /> Revenus totaux
                </div>
                <p className="text-shamar-h2 font-semibold text-gray-900">
                  {Number(data.total_revenue || 0).toLocaleString()} {data.currency || 'FCFA'}
                </p>
              </div>
              <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
                <div className="flex items-center gap-2 text-gray-500 text-shamar-small font-medium mb-1">
                  <TrendingUp size={18} /> Ce mois
                </div>
                <p className="text-shamar-h2 font-semibold text-gray-900">
                  {Number(data.monthly_revenue || 0).toLocaleString()} {data.currency || 'FCFA'}
                </p>
              </div>
              <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
                <div className="flex items-center gap-2 text-gray-500 text-shamar-small font-medium mb-1">
                  <Lock size={18} /> Escrow actif
                </div>
                <p className="text-shamar-h2 font-semibold text-gray-900">
                  {Number(data.escrow_active_amount || 0).toLocaleString()} {data.currency || 'FCFA'}
                </p>
                <p className="text-shamar-caption text-gray-400 mt-1 font-medium">{data.escrow_active_count || 0} transaction(s)</p>
              </div>
              <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
                <div className="flex items-center gap-2 text-gray-500 text-shamar-small font-medium mb-1">
                  <Wallet size={18} /> Disponible
                </div>
                <p className="text-shamar-h2 font-semibold text-primary-600">
                  {Number(data.available || 0).toLocaleString()} {data.currency || 'FCFA'}
                </p>
              </div>
            </div>
          )}

          {data.role === 'seller' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-shamar-16">
              <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
                <div className="flex items-center gap-2 text-gray-500 text-shamar-small font-medium mb-1">
                  <Banknote size={18} /> Retraits effectués
                </div>
                <p className="text-shamar-h3 font-semibold text-gray-900">
                  {Number(data.total_withdrawn || 0).toLocaleString()} {data.currency || 'FCFA'}
                </p>
              </div>
              <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
                <div className="text-gray-500 text-shamar-small font-medium mb-1">
                  Commissions plateforme
                </div>
                <p className="text-shamar-h3 font-semibold text-gray-900">
                  {Number(data.commissions_paid || 0).toLocaleString()} {data.currency || 'FCFA'}
                </p>
              </div>
            </div>
          )}

          {data.role === 'buyer' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-shamar-16">
              <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
                <div className="flex items-center gap-2 text-gray-500 text-shamar-small font-medium mb-1">
                  <TrendingUp size={18} /> Total dépensé
                </div>
                <p className="text-shamar-h2 font-semibold text-gray-900">
                  {Number(data.total_spent || 0).toLocaleString()} {data.currency || 'FCFA'}
                </p>
              </div>
              <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
                <div className="flex items-center gap-2 text-gray-500 text-shamar-small font-medium mb-1">
                  <Lock size={18} /> En escrow
                </div>
                <p className="text-shamar-h2 font-semibold text-gray-900">
                  {Number(data.blocked || 0).toLocaleString()} {data.currency || 'FCFA'}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-shamar-16">
            <Link
              href="/dashboard/wallet"
              className="inline-flex items-center gap-2 px-shamar-24 py-3 rounded-shamar-md bg-primary-600 text-gray-0 font-semibold hover:bg-primary-700 transition-colors text-shamar-body"
            >
              Portefeuille <ArrowRight size={18} />
            </Link>
            <Link
              href="/dashboard/wallet/history"
              className="inline-flex items-center gap-2 px-shamar-24 py-3 rounded-shamar-md border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-shamar-body"
            >
              Historique
            </Link>
            <Link
              href="/payments"
              className="inline-flex items-center gap-2 px-shamar-24 py-3 rounded-shamar-md border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-shamar-body"
            >
              Paiements
            </Link>
            <Link
              href="/disputes"
              className="inline-flex items-center gap-2 px-shamar-24 py-3 rounded-shamar-md border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-shamar-body"
            >
              Litiges
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
