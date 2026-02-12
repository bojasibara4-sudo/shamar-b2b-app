import { requireAdmin } from '@/lib/auth-guard';
import { getSecurityLogs } from '@/services/security.service';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SecurityLogsPage() {
  await requireAdmin();
  const logs = await getSecurityLogs({ limit: 200 });

  const severityColor = (s: string) => {
    switch (s) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-24">
          <Link href="/dashboard/admin/security" className="inline-flex items-center gap-2 text-shamar-body font-medium text-gray-500 hover:text-primary-600 mb-shamar-24 transition-colors">
            <ArrowLeft size={20} /> Retour Sécurité
          </Link>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft overflow-hidden">
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight p-shamar-24 flex items-center gap-2 border-b border-gray-200">
              <FileText className="text-gray-500" size={28} /> Audit Trail / Logs
            </h1>
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-500 uppercase tracking-wider">Sévérité</th>
                  <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-shamar-24 py-shamar-16 text-shamar-small text-gray-600 whitespace-nowrap font-medium">{new Date(log.created_at).toLocaleString('fr-FR')}</td>
                    <td className="px-shamar-24 py-shamar-16 text-shamar-small font-mono text-gray-700 font-medium">{log.event_type}</td>
                    <td className="px-shamar-24 py-shamar-16">
                      <span className={`px-2 py-0.5 rounded-shamar-sm text-shamar-caption font-semibold ${severityColor(log.severity)}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-shamar-24 py-shamar-16 text-shamar-small text-gray-700 font-medium">{log.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {logs.length === 0 && (
              <div className="p-shamar-32 text-center text-gray-500 text-shamar-body font-medium">Aucun log. Les événements sécurité apparaissent ici.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
