import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { getDisputeById, getDisputeMessages, getDisputeEvidence } from '@/services/dispute.service';
import DisputeChat from '@/components/profile/DisputeChat';
import { AlertTriangle, FileText, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

const statusLabel: Record<string, string> = {
  open: 'En cours',
  resolved: 'Résolu',
  rejected: 'Refusé',
};

export default async function ProfileDisputeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  const { id } = await params;

  const dispute = await getDisputeById(id);
  if (!dispute) notFound();
  if (dispute.raised_by !== user.id && dispute.against_user !== user.id && user.role !== 'admin') {
    redirect('/profile/disputes');
  }

  const [messages, evidence] = await Promise.all([
    getDisputeMessages(id),
    getDisputeEvidence(id),
  ]);

  const supabase = await createClient();
  const userIds = [...new Set(messages.map((m) => m.sender_id))];
  const { data: users } = userIds.length
    ? await (supabase as any).from('users').select('id, full_name, email').in('id', userIds)
    : { data: [] };
  const userMap = (users || []).reduce((acc: Record<string, { full_name?: string; email?: string }>, u: any) => {
    acc[u.id] = { full_name: u.full_name, email: u.email };
    return acc;
  }, {});

  const messagesWithSenders = messages.map((m) => ({
    ...m,
    content: m.content,
    sender: userMap[m.sender_id],
  }));

  return (
    <div className="max-w-shamar-container mx-auto px-4 py-shamar-24">
      <Link href="/profile/disputes" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 mb-shamar-24">← Retour litiges</Link>

      <div className="bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden mb-shamar-24 shadow-shamar-soft">
        <div className="p-shamar-16 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-shamar-h3 text-gray-900">Litige</h1>
          <span
            className={`px-2.5 py-1 text-shamar-caption font-medium rounded-shamar-sm ${
              dispute.status === 'open' ? 'bg-warning-500/20 text-gray-800' : dispute.status === 'resolved' ? 'bg-success-500/20 text-gray-800' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {statusLabel[dispute.status] ?? dispute.status}
          </span>
        </div>
        <div className="p-shamar-24 space-y-2">
          <p className="font-semibold text-gray-900 text-shamar-body">{dispute.reason}</p>
          {dispute.description && <p className="text-gray-600 text-shamar-small">{dispute.description}</p>}
          {dispute.amount_requested != null && (
            <p className="text-primary-600 font-medium text-shamar-body">{Number(dispute.amount_requested).toLocaleString('fr-FR')} FCFA demandés</p>
          )}
          {dispute.resolution_note && (
            <div className="mt-shamar-16 p-shamar-12 bg-gray-50 rounded-shamar-md border border-gray-200">
              <p className="text-shamar-caption font-medium text-gray-500 uppercase">Décision</p>
              <p className="text-gray-700 text-shamar-small mt-0.5">{dispute.resolution_note}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 mb-shamar-24 shadow-shamar-soft">
        <h2 className="font-bold text-gray-900 mb-shamar-16 flex items-center gap-2 text-shamar-body">
          <AlertTriangle size={18} /> Chat médiation
        </h2>
        {dispute.status === 'open' ? (
          <DisputeChat disputeId={id} messages={messagesWithSenders} />
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {messagesWithSenders.length === 0 ? (
              <p className="text-gray-500 text-shamar-small">Aucun message.</p>
            ) : (
              messagesWithSenders.map((m) => (
                <div key={m.id}>
                  <p className="text-gray-700 text-shamar-small">{m.content}</p>
                  <span className="text-gray-400 text-shamar-caption">{m.sender?.full_name || m.sender?.email} · {new Date(m.created_at).toLocaleString('fr-FR')}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 mb-shamar-24 shadow-shamar-soft">
        <h2 className="font-bold text-gray-900 mb-shamar-16 flex items-center gap-2 text-shamar-body">
          <FileText size={18} /> Preuves
        </h2>
        {evidence.length === 0 ? (
          <p className="text-gray-500 text-shamar-small">Aucune preuve déposée.</p>
        ) : (
          <ul className="space-y-2">
            {evidence.map((e) => (
              <li key={e.id}>
                <a
                  href={e.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary-600 font-medium text-shamar-small hover:underline"
                >
                  {e.file_name || 'Pièce jointe'} <ExternalLink size={14} />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link href={`/profile/orders/${dispute.order_id}`} className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600">
        Voir la commande associée →
      </Link>
    </div>
  );
}
