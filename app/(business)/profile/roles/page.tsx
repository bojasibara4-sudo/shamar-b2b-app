import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { Repeat, ShoppingCart, Store, Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

const roleConfig = {
  buyer: {
    label: 'Acheteur',
    short: 'Acheteur',
    description: 'Commander, suivre vos achats, gérer panier et adresses.',
    icon: ShoppingCart,
  },
  seller: {
    label: 'Vendeur',
    short: 'Vendeur',
    description: 'Boutique, produits, commandes vendeur, analytics, retraits.',
    icon: Store,
  },
  admin: {
    label: 'Administrateur',
    short: 'Admin',
    description: 'Accès complet plateforme, modération, paramètres.',
    icon: Shield,
  },
};

export default async function ProfileRolesPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const current = roleConfig[user.role];
  const CurrentIcon = current?.icon ?? ShoppingCart;

  return (
    <div className="max-w-shamar-container mx-auto px-4 py-shamar-24">
      <Link href="/profile" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 mb-shamar-24">← Retour Pour moi</Link>
      <h1 className="text-shamar-h2 text-gray-900">Gestion des rôles</h1>
      <p className="text-shamar-body text-gray-500 mt-1">Mode Acheteur / Vendeur / Pro — change menus, dashboard et écrans visibles.</p>

      {/* Mode actuel */}
      <div className="mt-shamar-24 bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden shadow-shamar-soft">
        <div className="p-shamar-16 border-b border-gray-200 bg-gray-50">
          <span className="text-shamar-caption font-medium text-gray-500 uppercase tracking-wide">Rôle actif</span>
        </div>
        <div className="p-shamar-24 flex items-start gap-shamar-16">
          <div className="w-12 h-12 rounded-shamar-md bg-primary-100 flex items-center justify-center text-primary-600 shrink-0">
            <CurrentIcon size={24} />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-shamar-body">{current?.label ?? user.role}</p>
            <p className="text-gray-600 text-shamar-small mt-0.5">{current?.description}</p>
          </div>
        </div>
      </div>

      {/* CTAs selon rôle */}
      <div className="mt-shamar-24 space-y-shamar-12">
        {user.role === 'buyer' && (
          <Link
            href="/dashboard/onboarding-vendeur"
            className="flex items-center gap-3 p-shamar-16 bg-gray-0 rounded-shamar-md border border-gray-200 hover:border-primary-600 hover:bg-primary-50 transition-colors shadow-shamar-soft"
          >
            <Store size={24} className="text-primary-600" />
            <div>
              <p className="font-semibold text-gray-900 text-shamar-body">Devenir vendeur</p>
              <p className="text-gray-600 text-shamar-small">Ouvrir une boutique, vendre, gérer vos produits et commandes.</p>
            </div>
          </Link>
        )}
        {(user.role === 'seller' || user.role === 'admin') && (
          <Link
            href="/profile/shop"
            className="flex items-center gap-3 p-shamar-16 bg-gray-0 rounded-shamar-md border border-gray-200 hover:border-primary-600 hover:bg-primary-50 transition-colors shadow-shamar-soft"
          >
            <Store size={24} className="text-primary-600" />
            <div>
              <p className="font-semibold text-gray-900 text-shamar-body">Ma boutique</p>
              <p className="text-gray-600 text-shamar-small">Dashboard boutique, produits, commandes, analytics.</p>
            </div>
          </Link>
        )}
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 mt-shamar-16 text-primary-600 font-medium hover:underline text-shamar-body"
        >
          <Repeat size={16} /> Retour au centre Pour moi
        </Link>
      </div>
    </div>
  );
}
