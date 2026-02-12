'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import { Shield, AlertTriangle, Info, RefreshCw, Bell, Users, CreditCard, FileText } from 'lucide-react';

interface SecurityLog {
  id: string;
  user_id?: string;
  event_type: string;
  severity: string;
  message: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

interface SecurityStats {
  totalEvents24h: number;
  highSeverity24h: number;
  critical24h: number;
  topEventTypes: { event_type: string; count: number }[];
}

export default function AdminSecurityPage() {
  const { profile, loading: authLoading } = useAuth();
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/security');
      if (!res.ok) throw new Error('Erreur chargement');
      const data = await res.json();
      setLogs(data.logs || []);
      setStats(data.stats || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (authLoading) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center min-h-[50vh] text-gray-500 text-shamar-body">Chargement…</div>
      </AuthGuard>
    );
  }
  if (!profile || profile.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500 text-shamar-body">Accès refusé.</p>
      </div>
    );
  }

  const severityColor = (s: string) => {
    switch (s) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <AuthGuard>
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
          <div className="space-y-shamar-32">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-shamar-h1 text-gray-900 flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary-600" />
              ASB Security
            </h1>
            <p className="text-gray-500 mt-1 text-shamar-body">Détection fraude et logs sécurité</p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-shamar-16 py-2 bg-primary-600 text-white rounded-shamar-md hover:bg-primary-700 disabled:opacity-50 font-semibold focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-shamar-24">
          <Link href="/dashboard/admin/security/alerts" className="flex items-center gap-2 px-shamar-16 py-3 bg-gray-0 border border-gray-200 rounded-shamar-md hover:border-red-200 hover:bg-red-50/50 transition-colors text-shamar-body font-medium text-gray-900">
            <Bell size={20} className="text-red-500" /> Alertes
          </Link>
          <Link href="/dashboard/admin/security/users" className="flex items-center gap-2 px-shamar-16 py-3 bg-gray-0 border border-gray-200 rounded-shamar-md hover:border-primary-200 hover:bg-primary-50/50 transition-colors text-shamar-body font-medium text-gray-900">
            <Users size={20} className="text-primary-500" /> Users à risque
          </Link>
          <Link href="/dashboard/admin/security/transactions" className="flex items-center gap-2 px-shamar-16 py-3 bg-gray-0 border border-gray-200 rounded-shamar-md hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors text-shamar-body font-medium text-gray-900">
            <CreditCard size={20} className="text-emerald-500" /> Transactions
          </Link>
          <Link href="/dashboard/admin/security/disputes" className="flex items-center gap-2 px-shamar-16 py-3 bg-gray-0 border border-gray-200 rounded-shamar-md hover:border-amber-200 hover:bg-amber-50/50 transition-colors text-shamar-body font-medium text-gray-900">
            <AlertTriangle size={20} className="text-amber-500" /> Litiges
          </Link>
          <Link href="/dashboard/admin/security/logs" className="flex items-center gap-2 px-shamar-16 py-3 bg-gray-0 border border-gray-200 rounded-shamar-md hover:border-gray-300 hover:bg-gray-50 transition-colors text-shamar-body font-medium text-gray-900">
            <FileText size={20} className="text-gray-500" /> Logs
          </Link>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-shamar-16">
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-16 shadow-shamar-soft">
              <p className="text-shamar-small text-gray-500">Événements 24h</p>
              <p className="text-shamar-h2 font-semibold text-gray-900 mt-1">{stats.totalEvents24h}</p>
            </div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-16 shadow-shamar-soft">
              <p className="text-shamar-small text-gray-500">Sévérité haute</p>
              <p className="text-shamar-h2 font-semibold text-orange-600 mt-1">{stats.highSeverity24h}</p>
            </div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-16 shadow-shamar-soft">
              <p className="text-shamar-small text-gray-500">Critiques</p>
              <p className="text-shamar-h2 font-semibold text-red-600 mt-1">{stats.critical24h}</p>
            </div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-16 shadow-shamar-soft">
              <p className="text-shamar-small text-gray-500 mb-2">Top types</p>
              {stats.topEventTypes.length === 0 ? (
                <p className="text-gray-500 text-shamar-small">Aucun</p>
              ) : (
                <ul className="text-shamar-small space-y-1">
                  {stats.topEventTypes.slice(0, 3).map((t) => (
                    <li key={t.event_type} className="flex justify-between">
                      <span className="truncate">{t.event_type}</span>
                      <span className="font-medium">{t.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden shadow-shamar-soft">
          <h2 className="px-shamar-24 py-shamar-16 font-semibold text-gray-900 border-b border-gray-200 flex items-center gap-2 text-shamar-h3">
            <AlertTriangle className="w-4 h-4" />
            Logs récents
          </h2>
          {loading ? (
            <div className="p-shamar-48 text-center text-gray-500 text-shamar-body">Chargement…</div>
          ) : logs.length === 0 ? (
            <div className="p-shamar-48 text-center text-gray-500 flex flex-col items-center gap-2 text-shamar-body">
              <Info className="w-10 h-10 text-gray-400" />
              <p>Aucun événement enregistré.</p>
              <p className="text-shamar-small">Exécutez la migration <code className="bg-gray-100 px-1 rounded-shamar-sm">supabase-security-migration.sql</code> si la table n&apos;existe pas.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-shamar-24 py-3 text-left text-shamar-caption font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-shamar-24 py-3 text-left text-shamar-caption font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-shamar-24 py-3 text-left text-shamar-caption font-medium text-gray-500 uppercase">Sévérité</th>
                    <th className="px-shamar-24 py-3 text-left text-shamar-caption font-medium text-gray-500 uppercase">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-shamar-24 py-3 text-shamar-small text-gray-600 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString('fr-FR')}
                      </td>
                      <td className="px-shamar-24 py-3 text-shamar-small font-mono text-gray-700">{log.event_type}</td>
                      <td className="px-shamar-24 py-3">
                        <span className={`px-2 py-0.5 rounded-shamar-sm text-shamar-caption font-medium ${severityColor(log.severity)}`}>
                          {log.severity}
                        </span>
                      </td>
                      <td className="px-shamar-24 py-3 text-shamar-small text-gray-700">{log.message}</td>
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
    </AuthGuard>
  );
}
