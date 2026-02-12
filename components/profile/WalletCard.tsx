'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Wallet, Lock, TrendingUp, ArrowRight } from 'lucide-react';

type WalletData = {
  available: number;
  blocked: number;
  currency: string;
  total_spent?: number;
  pending_amount?: number;
};

interface WalletCardProps {
  showPayout?: boolean;
}

export default function WalletCard({ showPayout = false }: WalletCardProps) {
  const [data, setData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/wallet')
      .then((r) => r.ok ? r.json() : null)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
        <div className="h-10 bg-slate-200 rounded w-1/2 mb-2" />
        <div className="h-4 bg-slate-100 rounded w-2/3" />
      </div>
    );
  }

  const available = data?.available ?? 0;
  const blocked = data?.blocked ?? 0;
  const currency = data?.currency ?? 'FCFA';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 bg-gradient-to-br from-brand-vert/10 to-brand-bleu-nuit/10 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
            <Wallet size={18} />
            <span>Solde disponible</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {Number(available).toLocaleString('fr-FR')} {currency}
          </p>
        </div>
        <div className="grid grid-cols-2 divide-x divide-slate-100">
          <div className="p-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <Lock size={14} />
              Escrow bloqué
            </div>
            <p className="text-lg font-semibold text-slate-800 mt-0.5">
              {Number(blocked).toLocaleString('fr-FR')} {currency}
            </p>
          </div>
          {data?.total_spent != null && (
            <div className="p-4">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                <TrendingUp size={14} />
                Total dépensé
              </div>
              <p className="text-lg font-semibold text-slate-800 mt-0.5">
                {Number(data.total_spent).toLocaleString('fr-FR')} {currency}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {showPayout && (
          <Link
            href="/profile/payouts"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-vert text-white rounded-xl font-medium text-sm hover:bg-brand-vert/90 transition-colors"
          >
            Retirer <ArrowRight size={16} />
          </Link>
        )}
        <Link
          href="/dashboard/wallet"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors"
        >
          Historique
        </Link>
      </div>
    </div>
  );
}
