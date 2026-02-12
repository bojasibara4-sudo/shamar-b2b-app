'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, Calendar, MessageSquare, Paperclip } from 'lucide-react';
import DisputeChat from '@/components/disputes/DisputeChat';
import DisputeEvidence from '@/components/disputes/DisputeEvidence';

export default function DisputeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [dispute, setDispute] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/disputes/${id}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => setDispute(data))
      .catch(() => setDispute(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
          <div className="text-center py-shamar-48 text-gray-500 text-shamar-body">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 text-center shadow-shamar-soft">
          <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-shamar-16" />
          <h2 className="text-shamar-h2 text-gray-900 mb-2">Litige introuvable</h2>
          <p className="text-gray-500 mb-shamar-24 text-shamar-body">Ce litige n&apos;existe pas ou vous n&apos;y avez pas accès.</p>
          <Link href="/disputes" className="text-primary-600 font-semibold hover:underline text-shamar-body">
            Retour aux litiges
          </Link>
        </div>
        </div>
      </div>
    );
  }

  const statusLabels: Record<string, string> = {
    open: 'Ouvert',
    resolved: 'Résolu',
    rejected: 'Rejeté',
  };

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <Link
            href="/disputes"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 font-medium mb-shamar-24 transition-colors text-shamar-body"
          >
            <ArrowLeft size={20} />
            Retour aux litiges
          </Link>
          <div className="flex items-start justify-between gap-shamar-16">
            <div>
              <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
                Litige <span className="text-primary-600">#{dispute.id?.slice(0, 8)}</span>
              </h1>
              <p className="text-gray-500 font-medium text-shamar-body">
                Commande #{dispute.order_id?.slice(0, 8)} • {statusLabels[dispute.status] || dispute.status}
              </p>
            </div>
            <span className={`px-shamar-16 py-2 rounded-shamar-sm text-shamar-small font-semibold ${
              dispute.status === 'open' ? 'bg-warning-500/20 text-amber-700' :
              dispute.status === 'resolved' ? 'bg-success-500/20 text-emerald-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {statusLabels[dispute.status] || dispute.status}
            </span>
          </div>
        </div>

        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-32 space-y-shamar-24">
          <div>
            <h3 className="text-shamar-caption font-semibold text-gray-400 uppercase tracking-wider mb-1">Motif</h3>
            <p className="text-shamar-h3 font-semibold text-gray-900">{dispute.reason}</p>
          </div>
          {dispute.description && (
            <div>
              <h3 className="text-shamar-caption font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</h3>
              <p className="text-gray-600 text-shamar-body">{dispute.description}</p>
            </div>
          )}
          {dispute.amount_requested != null && (
            <div>
              <h3 className="text-shamar-caption font-semibold text-gray-400 uppercase tracking-wider mb-1">Montant demandé</h3>
              <p className="text-gray-900 font-semibold text-shamar-body">{Number(dispute.amount_requested).toLocaleString()} FCFA</p>
            </div>
          )}
          <div className="flex items-center gap-shamar-16 flex-wrap">
            <Link href={`/dashboard/orders/${dispute.order_id}`} className="text-shamar-small font-medium text-primary-600 hover:underline">
              Voir la commande
            </Link>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-shamar-small">
            <Calendar size={16} />
            <span>Créé le {new Date(dispute.created_at).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</span>
          </div>
          {dispute.status !== 'open' && dispute.resolution_note && (
            <div className="mt-shamar-24 p-shamar-16 bg-gray-50 rounded-shamar-md border border-gray-200">
              <h3 className="text-shamar-caption font-semibold text-gray-400 uppercase tracking-wider mb-1">Résolution</h3>
              <p className="text-gray-700 text-shamar-body">{dispute.resolution_note}</p>
              {dispute.resolved_at && (
                <p className="text-shamar-caption text-gray-500 mt-2">Résolu le {new Date(dispute.resolved_at).toLocaleDateString('fr-FR')}</p>
              )}
            </div>
          )}
        </div>

        {dispute.status === 'open' && (
          <>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-32">
              <h2 className="text-shamar-body font-semibold text-gray-900 mb-3 flex items-center gap-2"><MessageSquare size={20} /> Chat</h2>
              <DisputeChat disputeId={id} canSend={true} />
            </div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-32">
              <h2 className="text-shamar-body font-semibold text-gray-900 mb-3 flex items-center gap-2"><Paperclip size={20} /> Preuves</h2>
              <DisputeEvidence disputeId={id} canAdd={true} />
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
