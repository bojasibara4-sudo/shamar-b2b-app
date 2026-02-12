'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WalletHistoryClient() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('90');
  const [type, setType] = useState('all');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/wallet/history?period=${period}&type=${type}`)
      .then((r) => r.json())
      .then((d) => setTransactions(d.transactions || []))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, [period, type]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium"
        >
          <option value="30">30 jours</option>
          <option value="90">90 jours</option>
          <option value="365">1 an</option>
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium"
        >
          <option value="all">Tous</option>
          <option value="payment">Paiements</option>
          <option value="payout">Retraits</option>
          <option value="order">Commandes</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Chargement...</div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">Aucune transaction.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-sm font-bold">
                <th className="p-4">Date</th>
                <th className="p-4">Référence</th>
                <th className="p-4">Module</th>
                <th className="p-4">Type</th>
                <th className="p-4 text-right">Montant</th>
                <th className="p-4">Statut</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={`${t.id}-${t.type}`} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 text-sm text-slate-600">
                    {new Date(t.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="p-4">
                    {(t.type === 'paiement' || t.type === 'revenu') ? (
                      <Link href={`/dashboard/orders/${t.id}`} className="text-brand-vert font-medium hover:underline">
                        {t.ref}
                      </Link>
                    ) : (
                      <span>{t.ref}</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-slate-600">{t.module}</td>
                  <td className="p-4 text-sm capitalize">{t.type}</td>
                  <td className="p-4 text-right font-bold">
                    <span className={t.amount >= 0 ? 'text-emerald-600' : 'text-slate-900'}>
                      {t.amount >= 0 ? '+' : ''}{t.amount.toLocaleString()} {t.currency}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
