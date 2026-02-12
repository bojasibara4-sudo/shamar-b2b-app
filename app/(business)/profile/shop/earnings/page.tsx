import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { Banknote, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

/**
 * Revenus — sous « Pour moi » / Ma boutique (spec: /shop/earnings)
 * Hub vers retraits et analytics vendeur.
 */
export default async function ProfileShopEarningsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  if (user.role !== 'seller' && user.role !== 'admin') redirect('/profile/shop');

  return (
    <div className="max-w-shamar-container mx-auto px-4 py-shamar-24">
      <Link href="/profile/shop" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 mb-shamar-24">← Ma boutique</Link>
      <h1 className="text-shamar-h2 text-gray-900">Revenus</h1>
      <p className="text-shamar-body text-gray-500 mt-1">Retraits, commissions, performance.</p>

      <div className="mt-shamar-24 space-y-shamar-12">
        <Link
          href="/profile/payouts"
          className="flex items-center gap-shamar-16 p-shamar-16 bg-gray-0 rounded-shamar-md border border-gray-200 hover:border-primary-600/50 transition-colors shadow-shamar-soft"
        >
          <Banknote size={24} className="text-primary-600" />
          <div>
            <p className="font-semibold text-gray-900 text-shamar-body">Retraits</p>
            <p className="text-gray-500 text-shamar-small">Mobile Money, Banque, Stripe.</p>
          </div>
        </Link>
        <Link
          href="/profile/commissions"
          className="flex items-center gap-shamar-16 p-shamar-16 bg-gray-0 rounded-shamar-md border border-gray-200 hover:border-primary-600/50 transition-colors shadow-shamar-soft"
        >
          <Banknote size={24} className="text-primary-600" />
          <div>
            <p className="font-semibold text-gray-900 text-shamar-body">Commissions</p>
            <p className="text-gray-500 text-shamar-small">Frais Shamar, détail par commande.</p>
          </div>
        </Link>
        <Link
          href="/profile/analytics"
          className="flex items-center gap-shamar-16 p-shamar-16 bg-gray-0 rounded-shamar-md border border-gray-200 hover:border-primary-600/50 transition-colors shadow-shamar-soft"
        >
          <TrendingUp size={24} className="text-primary-600" />
          <div>
            <p className="font-semibold text-gray-900 text-shamar-body">Analytics</p>
            <p className="text-gray-500 text-shamar-small">Ventes, top produits, performance.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
