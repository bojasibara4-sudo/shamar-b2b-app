import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { Store, Package, Banknote, FileText, BarChart3 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProfileShopPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  if (user.role !== 'seller' && user.role !== 'admin') redirect('/dashboard/onboarding-vendeur');

  return (
    <div className="max-w-shamar-container mx-auto px-4 py-shamar-24">
      <Link href="/profile" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 mb-shamar-24">← Retour Pour moi</Link>
      <h1 className="text-shamar-h2 text-gray-900">Ma boutique</h1>
      <p className="text-shamar-body text-gray-500 mt-1">Infos boutique, produits, commandes reçues, revenus.</p>

      <div className="mt-shamar-24 space-y-shamar-12">
        <Link
          href="/dashboard/shops"
          className="flex items-center gap-shamar-16 p-shamar-16 bg-gray-0 rounded-shamar-md border border-gray-200 hover:border-primary-600/50 transition-colors shadow-shamar-soft"
        >
          <Store size={24} className="text-primary-600 shrink-0" />
          <div>
            <p className="font-semibold text-gray-900 text-shamar-body">Infos boutique</p>
            <p className="text-gray-500 text-shamar-small">Nom, logo, description, badges.</p>
          </div>
        </Link>
        <Link
          href="/profile/shop/orders"
          className="flex items-center gap-shamar-16 p-shamar-16 bg-gray-0 rounded-shamar-md border border-gray-200 hover:border-primary-600/50 transition-colors shadow-shamar-soft"
        >
          <Package size={24} className="text-primary-600 shrink-0" />
          <div>
            <p className="font-semibold text-gray-900 text-shamar-body">Commandes reçues</p>
            <p className="text-gray-500 text-shamar-small">Gérer les commandes de votre boutique.</p>
          </div>
        </Link>
        <Link
          href="/profile/shop/earnings"
          className="flex items-center gap-shamar-16 p-shamar-16 bg-gray-0 rounded-shamar-md border border-gray-200 hover:border-primary-600/50 transition-colors shadow-shamar-soft"
        >
          <Banknote size={24} className="text-primary-600 shrink-0" />
          <div>
            <p className="font-semibold text-gray-900 text-shamar-body">Revenus</p>
            <p className="text-gray-500 text-shamar-small">Retraits, commissions, analytics.</p>
          </div>
        </Link>
        <Link
          href="/profile/products"
          className="flex items-center gap-shamar-16 p-shamar-16 bg-gray-0 rounded-shamar-md border border-gray-200 hover:border-primary-600/50 transition-colors shadow-shamar-soft"
        >
          <FileText size={24} className="text-primary-600 shrink-0" />
          <div>
            <p className="font-semibold text-gray-900 text-shamar-body">Produits</p>
            <p className="text-gray-500 text-shamar-small">Liste, ajouter, modifier.</p>
          </div>
        </Link>
        <Link
          href="/profile/analytics"
          className="flex items-center gap-shamar-16 p-shamar-16 bg-gray-0 rounded-shamar-md border border-gray-200 hover:border-primary-600/50 transition-colors shadow-shamar-soft"
        >
          <BarChart3 size={24} className="text-primary-600 shrink-0" />
          <div>
            <p className="font-semibold text-gray-900 text-shamar-body">Analytics</p>
            <p className="text-gray-500 text-shamar-small">Ventes, top produits, performance.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
