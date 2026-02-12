'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';

type Order = { id: string; total_amount: number; currency: string; status: string; created_at: string };

const TABS = [
  { key: 'active', label: 'En cours', statuses: ['PENDING', 'PAID', 'SHIPPED', 'PROCESSING'] },
  { key: 'delivered', label: 'Livrées', statuses: ['DELIVERED', 'RELEASED'] },
  { key: 'cancelled', label: 'Annulées', statuses: ['CANCELLED'] },
  { key: 'disputed', label: 'Litiges', statuses: ['DISPUTED'] },
  { key: 'all', label: 'Toutes', statuses: [] },
];

function getTabKey(status: string): string {
  if (['PENDING', 'PAID', 'SHIPPED', 'PROCESSING'].includes(status)) return 'active';
  if (['DELIVERED', 'RELEASED'].includes(status)) return 'delivered';
  if (status === 'CANCELLED') return 'cancelled';
  if (status === 'DISPUTED') return 'disputed';
  return 'all';
}

const statusLabel: Record<string, string> = {
  PENDING: 'En attente',
  PAID: 'Payée',
  SHIPPED: 'Expédiée',
  PROCESSING: 'En préparation',
  DELIVERED: 'Livrée',
  RELEASED: 'Finalisée',
  CANCELLED: 'Annulée',
  DISPUTED: 'Litige',
};

export default function ProfileOrdersList({ orders }: { orders: Order[] }) {
  const [tab, setTab] = useState<string>('active');

  const filtered =
    tab === 'all'
      ? orders
      : orders.filter((o) => {
          const tabDef = TABS.find((t) => t.key === tab);
          return tabDef && (tabDef.statuses.length === 0 || tabDef.statuses.includes((o.status || '').toUpperCase()));
        });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="flex overflow-x-auto border-b border-slate-100 p-2 gap-1">
        {TABS.map((t) => {
          const count = t.statuses.length === 0 ? orders.length : orders.filter((o) => t.statuses.includes((o.status || '').toUpperCase())).length;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.key ? 'bg-brand-vert text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.label} ({count})
            </button>
          );
        })}
      </div>
      <div className="divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Package size={32} className="mx-auto mb-2 text-slate-300" />
            <p>Aucune commande dans cette catégorie.</p>
          </div>
        ) : (
          filtered.map((o) => (
            <Link
              key={o.id}
              href={`/profile/orders/${o.id}`}
              className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
              <div>
                <p className="font-semibold text-slate-900">Commande #{o.id.slice(0, 8)}</p>
                <p className="text-slate-500 text-sm">{o.created_at ? new Date(o.created_at).toLocaleDateString('fr-FR') : ''}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">
                  {Number(o.total_amount || 0).toLocaleString('fr-FR')} {o.currency || 'FCFA'}
                </p>
                <span
                  className={`inline-block mt-0.5 px-2 py-0.5 rounded text-xs font-medium ${
                    getTabKey((o.status || '').toUpperCase()) === 'disputed'
                      ? 'bg-amber-100 text-amber-700'
                      : getTabKey((o.status || '').toUpperCase()) === 'delivered'
                        ? 'bg-emerald-100 text-emerald-700'
                        : getTabKey((o.status || '').toUpperCase()) === 'cancelled'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {statusLabel[(o.status || '').toUpperCase()] || o.status}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
