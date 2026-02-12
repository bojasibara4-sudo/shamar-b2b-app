'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, RefreshCw } from 'lucide-react';

export default function SecurityAlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/security/alerts?limit=100');
      const data = await res.ok ? res.json() : [];
      setAlerts(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAlerts(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/security/alerts', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    fetchAlerts();
  };

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-shamar-16">
            <Link href="/dashboard/admin/security" className="inline-flex items-center gap-2 text-shamar-body font-medium text-gray-500 hover:text-primary-600 transition-colors">
              <ArrowLeft size={20} /> Retour Sécurité
            </Link>
            <button onClick={fetchAlerts} disabled={loading} className="flex items-center gap-2 px-shamar-16 py-2 bg-primary-600 text-gray-0 rounded-shamar-md font-semibold hover:bg-primary-700 disabled:opacity-50 text-shamar-small">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Actualiser
            </button>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-shamar-24 flex items-center gap-2">
              <ShieldAlert className="text-danger-500" size={28} /> Alertes
            </h1>

            {loading ? (
              <p className="text-gray-500 py-shamar-48 text-shamar-body font-medium">Chargement…</p>
            ) : alerts.length === 0 ? (
              <div className="bg-gray-50 rounded-shamar-md border border-gray-200 p-shamar-32 text-center text-gray-500 text-shamar-body font-medium">
                Aucune alerte. Exécutez <code className="bg-gray-100 px-1 rounded-shamar-sm font-mono text-shamar-small">supabase-security-complet.sql</code> si la table security_alerts n&apos;existe pas.
              </div>
            ) : (
              <div className="rounded-shamar-md border border-gray-200 overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-500 uppercase tracking-wider">Raison</th>
                      <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                      <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-gray-0">
                    {alerts.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-shamar-24 py-shamar-16 text-shamar-body font-mono text-gray-900">{a.alert_type}</td>
                        <td className="px-shamar-24 py-shamar-16 text-shamar-body text-gray-700 font-medium">{a.reason}</td>
                        <td className="px-shamar-24 py-shamar-16 text-shamar-body font-medium text-gray-900">{a.risk_score ?? 0}</td>
                        <td className="px-shamar-24 py-shamar-16">
                          <span className={`px-2 py-0.5 rounded-shamar-sm text-shamar-caption font-semibold ${a.status === 'new' ? 'bg-warning-500/20 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="px-shamar-24 py-shamar-16 text-shamar-small text-gray-500 font-medium">{a.created_at ? new Date(a.created_at).toLocaleString('fr-FR') : '—'}</td>
                        <td className="px-shamar-24 py-shamar-16">
                          {a.status === 'new' && (
                            <div className="flex gap-shamar-16 flex-wrap">
                              <button onClick={() => updateStatus(a.id, 'ignored')} className="text-shamar-caption text-gray-500 hover:text-gray-900 font-medium hover:underline">Ignorer</button>
                              <button onClick={() => updateStatus(a.id, 'escalated')} className="text-shamar-caption text-warning-500 font-medium hover:underline">Escalader</button>
                              <Link href={`/dashboard/admin/security/users/${a.user_id}`} className="text-shamar-caption font-medium text-primary-600 hover:underline">Voir user</Link>
                            </div>
                          )}
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
