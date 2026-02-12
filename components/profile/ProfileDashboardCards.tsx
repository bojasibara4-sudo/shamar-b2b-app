'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Wallet, Package, Truck, AlertTriangle, Store } from 'lucide-react';

type DashboardData = {
  wallet: { available: number; blocked: number; currency: string };
  ordersInProgress: number;
  deliveriesActive: number;
  disputesOpen: number;
};

export default function ProfileDashboardCards({ isSeller }: { isSeller: boolean }) {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch('/api/profile/dashboard')
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) return null;

  const cards = [
    {
      href: '/profile/wallet',
      icon: Wallet,
      label: 'Solde wallet',
      value: `${Number(data.wallet.available + data.wallet.blocked).toLocaleString('fr-FR')} ${data.wallet.currency}`,
      sub: data.wallet.blocked > 0 ? `${Number(data.wallet.blocked).toLocaleString('fr-FR')} en escrow` : undefined,
    },
    {
      href: '/profile/orders',
      icon: Package,
      label: 'Commandes en cours',
      value: String(data.ordersInProgress),
    },
    {
      href: '/profile/deliveries',
      icon: Truck,
      label: 'Livraisons actives',
      value: String(data.deliveriesActive),
    },
    {
      href: '/profile/disputes',
      icon: AlertTriangle,
      label: 'Litiges ouverts',
      value: String(data.disputesOpen),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-shamar-16 mb-shamar-24">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Link
            key={c.href}
            href={c.href}
            className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-16 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:ring-offset-2 focus:ring-offset-gray-50"
          >
            <div className="flex items-center gap-2 text-gray-500 text-shamar-small font-medium mb-shamar-8">
              <Icon size={16} className="text-primary-600" />
              {c.label}
            </div>
            <p className="text-shamar-h4 font-semibold text-gray-900">{c.value}</p>
            {c.sub && <p className="text-gray-500 text-shamar-small mt-1">{c.sub}</p>}
          </Link>
        );
      })}
      {isSeller ? (
        <Link
          href="/profile/shop"
          className="col-span-2 sm:col-span-1 bg-primary-50 rounded-shamar-md border border-primary-200 p-shamar-16 hover:bg-primary-100/80 transition-all duration-200 flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:ring-offset-2 focus:ring-offset-gray-50"
        >
          <Store size={24} className="text-primary-600" />
          <span className="font-semibold text-gray-900 text-shamar-body">Ma boutique</span>
        </Link>
      ) : (
        <Link
          href="/dashboard/onboarding-vendeur"
          className="col-span-2 sm:col-span-1 bg-warning-500/10 rounded-shamar-md border border-amber-200 p-shamar-16 hover:bg-amber-100/80 transition-all duration-200 flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-warning-500/20 focus:ring-offset-2 focus:ring-offset-gray-50"
        >
          <Store size={24} className="text-amber-600" />
          <span className="font-semibold text-gray-900 text-shamar-body">Devenir vendeur</span>
        </Link>
      )}
    </div>
  );
}
