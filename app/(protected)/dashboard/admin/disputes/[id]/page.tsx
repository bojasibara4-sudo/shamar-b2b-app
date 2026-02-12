import { requireAdmin } from '@/lib/auth-guard';
import { getDisputeById, getDisputeMessages, getDisputeEvidence } from '@/services/dispute.service';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ShieldAlert, FileText, MessageSquare, DollarSign } from 'lucide-react';
import AdminDisputeResolve from '@/components/admin/AdminDisputeResolve';

export const dynamic = 'force-dynamic';

export default async function AdminDisputeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const dispute = await getDisputeById(id);
  if (!dispute) notFound();

  const supabase = await createClient();
  const [orderRes, escrowRes, messages, evidence] = await Promise.all([
    (supabase as any).from('orders').select('id, total_amount, currency, status, buyer_id, seller_id').eq('id', dispute.order_id).single(),
    (supabase as any).from('escrows').select('id, amount, currency, status').eq('order_id', dispute.order_id).maybeSingle(),
    getDisputeMessages(id),
    getDisputeEvidence(id),
  ]);

  const order = orderRes.error ? null : orderRes.data;
  const escrow = escrowRes?.data ?? null;
  const buyerId = order?.buyer_id || dispute.raised_by;
  const sellerId = order?.seller_id || dispute.against_user;
  const { data: buyer } = await (supabase as any).from('users').select('id, email, full_name, company_name').eq('id', buyerId).single();
  const { data: seller } = await (supabase as any).from('users').select('id, email, full_name, company_name').eq('id', sellerId).single();

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <Link href="/dashboard/admin/disputes" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 font-medium mb-shamar-16 text-shamar-body">
            <ArrowLeft size={20} /> Retour aux litiges
          </Link>
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
            Litige <span className="text-primary-600">#{id?.slice(0, 8)}</span>
          </h1>
          <p className="text-shamar-body text-gray-500 font-medium">
            Commande #{dispute.order_id?.slice(0, 8)} • {dispute.status}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-shamar-24">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
            <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-3 flex items-center gap-2"><FileText size={20} /> Détails</h2>
            <p className="text-gray-700 font-medium text-shamar-body">{dispute.reason}</p>
            {dispute.description && <p className="text-gray-600 text-shamar-small mt-2">{dispute.description}</p>}
            {dispute.amount_requested != null && (
              <p className="text-gray-700 mt-2 text-shamar-body">Montant demandé : <strong>{Number(dispute.amount_requested).toLocaleString()} FCFA</strong></p>
            )}
            <p className="text-gray-500 text-shamar-small mt-2">Créé le {new Date(dispute.created_at).toLocaleDateString('fr-FR')}</p>
            <div className="mt-shamar-16 pt-shamar-16 border-t border-gray-100">
              <p className="text-shamar-caption text-gray-500 uppercase font-semibold">Acheteur (plaignant)</p>
              <p className="text-gray-900 text-shamar-body">{buyer?.company_name || buyer?.full_name || buyer?.email}</p>
              <p className="text-shamar-caption text-gray-500 uppercase font-semibold mt-2">Vendeur (mis en cause)</p>
              <p className="text-gray-900 text-shamar-body">{seller?.company_name || seller?.full_name || seller?.email}</p>
            </div>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
            <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-3 flex items-center gap-2"><DollarSign size={20} /> Escrow</h2>
            {escrow ? (
              <p className="text-gray-700 text-shamar-body">{Number(escrow.amount).toLocaleString()} {escrow.currency} — <span className="font-semibold">{escrow.status}</span></p>
            ) : (
              <p className="text-gray-500 text-shamar-body">Aucun escrow pour cette commande.</p>
            )}
            <Link href={`/payments/escrow/order/${dispute.order_id}`} className="text-shamar-small text-primary-600 font-medium hover:underline mt-2 inline-block">Voir escrow</Link>
          </div>
        </div>

        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
          <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-3 flex items-center gap-2"><MessageSquare size={20} /> Chat ({messages.length})</h2>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {messages.length === 0 && <p className="text-gray-500 text-shamar-small">Aucun message.</p>}
            {messages.map((m) => (
              <div key={m.id} className="text-shamar-small text-gray-700 border-l-2 border-gray-200 pl-3">
                <span className="text-gray-500">{new Date(m.created_at).toLocaleString('fr-FR')}</span>
                <p>{m.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
          <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-3">Preuves ({evidence.length})</h2>
          {evidence.length === 0 && <p className="text-gray-500 text-shamar-small">Aucune preuve.</p>}
          <ul className="space-y-1">
            {evidence.map((e) => (
              <li key={e.id}>
                <a href={e.file_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 font-medium text-shamar-small hover:underline">
                  {e.file_name || 'Preuve'} — {new Date(e.created_at).toLocaleDateString('fr-FR')}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {dispute.status === 'open' && (
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
            <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-shamar-16 flex items-center gap-2"><ShieldAlert size={20} /> Décision</h2>
            <AdminDisputeResolve disputeId={id} />
          </div>
        )}

        {dispute.status !== 'open' && dispute.resolution_note && (
          <div className="bg-gray-50 rounded-shamar-md border border-gray-200 p-shamar-24">
            <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-2">Résolution</h2>
            <p className="text-gray-700 text-shamar-body">{dispute.resolution_note}</p>
            <p className="text-gray-500 text-shamar-small mt-2">Résolu le {dispute.resolved_at ? new Date(dispute.resolved_at).toLocaleDateString('fr-FR') : '—'}</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
