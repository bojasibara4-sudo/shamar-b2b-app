'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CreditCard, ArrowLeft, RefreshCw } from 'lucide-react';

export default function SecurityTransactionsPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/security/transactions?limit=100');
      const data = await res.ok ? res.json() : [];
      setList(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-shamar-16">
            <Link href="/dashboard/admin/security" className="inline-flex items-center gap-2 text-shamar-body font-medium text-gray-500 hover:text-primary-600 transition-colors">
              <ArrowLeft size={20} /> Retour Sécurité
            </Link>
            <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 px-shamar-16 py-2 bg-primary-600 text-gray-0 rounded-shamar-md font-semibold hover:bg-primary-700 disabled:opacity-50 text-shamar-small">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Actualiser
            </button>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-shamar-24 flex items-center gap-2">
              <CreditCard className="text-success-500" size={28} /> Transactions / Escrows
            </h1>

            {loading ? (
              <p className="text-gray-500 py-shamar-48 text-shamar-body font-medium">Chargement…</p>
            ) : list.length === 0 ? (
              <div className="bg-gray-50 rounded-shamar-md border border-gray-200 p-shamar-32 text-center text-gray-500 text-shamar-body font-medium">
                Aucune transaction. Vérifiez que la table <code className="bg-gray-100 px-1 rounded-shamar-sm font-mono text-shamar-small">escrows</code> existe et contient des données.
              </div>
            ) : (
              <div className="rounded-shamar-md border border-gray-200 overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                      <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-500 uppercase tracking-wider">Montant</th>
                      <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-500 uppercase tracking-wider">Lien</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-gray-0">
                    {list.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-shamar-24 py-shamar-16 text-shamar-body font-mono text-gray-900">{t.id?.slice(0, 8)}</td>
                        <td className="px-shamar-24 py-shamar-16 text-shamar-body font-medium text-gray-700">{t.order_id?.slice(0, 8)}</td>
                        <td className="px-shamar-24 py-shamar-16 text-shamar-body font-semibold text-gray-900">{Number(t.amount || 0).toLocaleString()} {t.currency || 'FCFA'}</td>
                        <td className="px-shamar-24 py-shamar-16">
                          <span className="px-2 py-0.5 rounded-shamar-sm text-shamar-caption font-semibold bg-gray-100 text-gray-700">{t.status}</span>
                        </td>
                        <td className="px-shamar-24 py-shamar-16 text-shamar-small text-gray-500 font-medium">{t.created_at ? new Date(t.created_at).toLocaleString('fr-FR') : '—'}</td>
                        <td className="px-shamar-24 py-shamar-16">
                          <Link href={`/dashboard/orders/${t.order_id}`} className="text-shamar-small font-medium text-primary-600 hover:underline">Commande</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
