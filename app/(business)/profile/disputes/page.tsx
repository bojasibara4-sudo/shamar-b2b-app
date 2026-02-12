import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { getUserDisputes } from '@/services/dispute.service';
import { AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

const statusLabel: Record<string, string> = {
  open: 'En cours',
  resolved: 'Résolu',
  rejected: 'Refusé',
};

export default async function ProfileDisputesPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const disputes = await getUserDisputes(user.id);

  return (
    <div className="max-w-shamar-container mx-auto px-4 py-shamar-24">
      <Link href="/profile" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 mb-shamar-24">← Retour Pour moi</Link>
      <h1 className="text-shamar-h2 text-gray-900">Litiges</h1>
      <p className="text-shamar-body text-gray-500 mt-1">Liste, statut, chat médiation, preuves, décision.</p>

      <div className="mt-shamar-24 space-y-shamar-12">
        {disputes.length === 0 ? (
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 text-center shadow-shamar-soft">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-shamar-16">
              <AlertTriangle size={28} className="text-gray-400" />
            </div>
            <p className="text-gray-900 font-medium text-shamar-body">Aucun litige</p>
            <p className="text-gray-500 text-shamar-small mt-1">Vos litiges apparaîtront ici.</p>
          </div>
        ) : (
          disputes.map((d) => (
            <Link
              key={d.id}
              href={`/profile/disputes/${d.id}`}
              className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-16 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 truncate text-shamar-body">{d.reason}</p>
                  {d.description && <p className="text-gray-600 text-shamar-small mt-0.5 line-clamp-2">{d.description}</p>}
                  <p className="text-gray-400 text-shamar-caption mt-2">Commande {d.order_id.slice(0, 8)}…</p>
                </div>
                <span
                  className={`shrink-0 px-2.5 py-1 text-shamar-caption font-medium rounded-shamar-sm ${
                    d.status === 'open'
                      ? 'bg-warning-500/20 text-warning-500'
                      : d.status === 'resolved'
                        ? 'bg-success-500/20 text-success-500'
                        : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {statusLabel[d.status] ?? d.status}
                </span>
              </div>
              {d.amount_requested != null && (
                <p className="text-primary-600 font-medium text-shamar-small mt-2">{Number(d.amount_requested).toLocaleString('fr-FR')} FCFA demandés</p>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
