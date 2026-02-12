'use client';

import { useAuth } from '@/hooks/useAuth';

export default function DashboardNav() {
  const { profile, signOut } = useAuth();

  return (
    <>
      {profile?.role === 'seller' && (
        <a href="/dashboard/shops" className="text-shamar-small text-gray-600 hover:text-primary-600">
          Mes boutiques
        </a>
      )}
      <a href="/marketplace" className="text-shamar-small text-gray-600 hover:text-primary-600">
        Marketplace
      </a>
      <a href="/products" className="text-shamar-small text-gray-600 hover:text-primary-600">
        Produits
      </a>
      <a href="/dashboard/orders" className="text-shamar-small text-gray-600 hover:text-primary-600">
        Commandes
      </a>
      <a href="/dashboard/wallet" className="text-shamar-small text-gray-600 hover:text-primary-600">
        Portefeuille
      </a>
      <a href="/dashboard/finance" className="text-shamar-small text-gray-600 hover:text-primary-600">
        Finance
      </a>
      <button
        onClick={() => signOut()}
        className="text-shamar-small text-gray-600 hover:text-primary-600"
      >
        Déconnexion
      </button>
    </>
  );
}

