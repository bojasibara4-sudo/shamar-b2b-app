'use client';

import { useAuth } from '@/hooks/useAuth';

export default function DashboardNav() {
  const { profile, signOut } = useAuth();

  return (
    <>
      {profile?.role === 'seller' && (
        <a href="/dashboard/shops" className="text-gray-700 hover:text-emerald-600">
          Mes boutiques
        </a>
      )}
      <a href="/products" className="text-gray-700 hover:text-emerald-600">
        Produits
      </a>
      <a href="/dashboard/orders" className="text-gray-700 hover:text-emerald-600">
        Commandes
      </a>
      <button
        onClick={() => signOut()}
        className="text-gray-700 hover:text-emerald-600"
      >
        Déconnexion
      </button>
    </>
  );
}

