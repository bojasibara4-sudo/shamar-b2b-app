'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Users, ArrowLeft, RefreshCw } from 'lucide-react';

const COUNTRY_OPTIONS = [
  { value: '', label: 'Tous pays' },
  { value: 'CI', label: "Côte d'Ivoire" },
  { value: 'SN', label: 'Sénégal' },
  { value: 'CM', label: 'Cameroun' },
  { value: 'CG', label: 'Congo' },
  { value: 'GA', label: 'Gabon' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'FR', label: 'France' },
  { value: 'CN', label: 'Chine' },
];

export default function SecurityUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (country) params.set('country', country);
      if (region) params.set('region', region);
      const res = await fetch(`/api/admin/security/risk-users?${params}`);
      const data = await res.ok ? res.json() : [];
      setUsers(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, [country, region]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-shamar-16">
            <Link href="/dashboard/admin/security" className="inline-flex items-center gap-2 text-shamar-body font-medium text-gray-500 hover:text-primary-600 transition-colors">
              <ArrowLeft size={20} /> Retour Sécurité
            </Link>
            <button onClick={fetchUsers} disabled={loading} className="flex items-center gap-2 px-shamar-16 py-2 bg-primary-600 text-gray-0 rounded-shamar-md font-semibold hover:bg-primary-700 disabled:opacity-50 text-shamar-small">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Actualiser
            </button>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-shamar-24 flex items-center gap-2">
              <Users className="text-primary-600" size={28} /> Utilisateurs à risque
            </h1>
            <div className="flex flex-wrap items-center gap-shamar-16 mb-shamar-24">
              <div>
                <label className="block text-shamar-caption font-medium text-gray-500 mb-1">Pays</label>
                <select value={country} onChange={(e) => setCountry(e.target.value)} className="px-shamar-16 py-2 rounded-shamar-md border border-gray-200 text-gray-700 min-w-[160px] text-shamar-body font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500">
                  {COUNTRY_OPTIONS.map((c) => (
                    <option key={c.value || 'all'} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-shamar-caption font-medium text-gray-500 mb-1">Région</label>
                <input type="text" placeholder="Ex. Afrique de l'Ouest" value={region} onChange={(e) => setRegion(e.target.value)} className="px-shamar-16 py-2 rounded-shamar-md border border-gray-200 text-gray-700 min-w-[160px] text-shamar-body font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
            </div>

            {loading ? (
              <p className="text-gray-500 py-shamar-48 text-shamar-body font-medium">Chargement…</p>
            ) : users.length === 0 ? (
              <div className="bg-gray-50 rounded-shamar-md border border-gray-200 p-shamar-32 text-center text-gray-500 text-shamar-body font-medium">
                Aucun utilisateur avec score. Remplir la table <code className="bg-gray-100 px-1 rounded-shamar-sm font-mono text-shamar-small">risk_scores</code> (ex. via analyse paiements).
              </div>
            ) : (
              <div className="rounded-shamar-md border border-gray-200 overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-500 uppercase tracking-wider">Rôle</th>
                      <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-500 uppercase tracking-wider">Score risque</th>
                      <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-500 uppercase tracking-wider">Mis à jour</th>
                      <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-gray-0">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-shamar-24 py-shamar-16 text-shamar-body font-medium text-gray-900">{u.email || u.full_name || u.id?.slice(0, 8)}</td>
                        <td className="px-shamar-24 py-shamar-16 text-shamar-body text-gray-600 font-medium">{u.role}</td>
                        <td className="px-shamar-24 py-shamar-16">
                          <span className={`px-2 py-0.5 rounded-shamar-sm text-shamar-caption font-semibold ${(u.risk_score || 0) >= 50 ? 'bg-danger-500/20 text-red-800' : 'bg-warning-500/20 text-amber-800'}`}>
                            {u.risk_score ?? 0}
                          </span>
                        </td>
                        <td className="px-shamar-24 py-shamar-16 text-shamar-small text-gray-500 font-medium">{u.score_updated_at ? new Date(u.score_updated_at).toLocaleDateString('fr-FR') : '—'}</td>
                        <td className="px-shamar-24 py-shamar-16">
                          <Link href={`/dashboard/admin/security/users/${u.id}`} className="text-shamar-small font-medium text-primary-600 hover:underline">Détail</Link>
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
