import { requireAdmin } from '@/lib/auth-guard';
import { createClient } from '@/lib/supabase/server';
import { getSecurityLogs } from '@/services/security.service';
import Link from 'next/link';
import { ArrowLeft, User, FileText, CreditCard, ShieldAlert } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SecurityUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: user }, { data: orders }, sanctionsResult, logs] = await Promise.all([
    (supabase as any).from('users').select('id, email, full_name, role, company_name, created_at').eq('id', id).single(),
    (supabase as any).from('orders').select('id, total_amount, currency, status, created_at').or(`buyer_id.eq.${id},seller_id.eq.${id}`).order('created_at', { ascending: false }).limit(20),
    (supabase as any).from('sanctions').select('*').eq('user_id', id).order('created_at', { ascending: false }).limit(10).then((r: any) => r.data || []).catch(() => []),
    getSecurityLogs({ userId: id, limit: 30 }),
  ]);
  const sanctions = Array.isArray(sanctionsResult) ? sanctionsResult : [];

  if (!user) notFound();

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-24">
          <Link href="/dashboard/admin/security/users" className="inline-flex items-center gap-2 text-shamar-body font-medium text-gray-500 hover:text-primary-600 mb-shamar-24 transition-colors">
            <ArrowLeft size={20} /> Retour utilisateurs à risque
          </Link>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight flex items-center gap-2 mb-shamar-24">
              <User className="text-primary-600" size={28} /> {user.email || user.full_name || user.id?.slice(0, 8)}
            </h1>
          </div>

          <section className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
            <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-shamar-16">Compte</h2>
            <p className="text-shamar-body text-gray-600 font-medium">Rôle : {user.role} • Créé le {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '—'}</p>
          </section>

          <section className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
            <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-shamar-16 flex items-center gap-2"><FileText size={18} className="text-primary-600" /> Commandes récentes</h2>
            {(!orders || orders.length === 0) ? (
              <p className="text-gray-500 text-shamar-body font-medium">Aucune commande</p>
            ) : (
              <ul className="space-y-2">
                {orders.map((o: any) => (
                  <li key={o.id} className="flex justify-between items-center text-shamar-body">
                    <Link href={`/dashboard/orders/${o.id}`} className="font-medium text-primary-600 hover:underline">#{o.id?.slice(0, 8)}</Link>
                    <span className="text-gray-600 font-medium">{o.total_amount} {o.currency} • {o.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
            <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-shamar-16 flex items-center gap-2"><ShieldAlert size={18} className="text-danger-500" /> Logs sécurité</h2>
            {logs.length === 0 ? (
              <p className="text-gray-500 text-shamar-body font-medium">Aucun log</p>
            ) : (
              <ul className="space-y-2">
                {logs.slice(0, 15).map((l) => (
                  <li key={l.id} className="flex justify-between gap-2 text-shamar-small">
                    <span className="font-mono text-gray-700 font-medium">{l.event_type}</span>
                    <span className="text-gray-500 font-medium">{new Date(l.created_at).toLocaleString('fr-FR')}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {Array.isArray(sanctions) && sanctions.length > 0 && (
            <section className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-shamar-16 flex items-center gap-2"><CreditCard size={18} className="text-warning-500" /> Sanctions</h2>
              <ul className="space-y-2 text-shamar-body text-gray-700 font-medium">
                {sanctions.map((s: any) => (
                  <li key={s.id}>{s.sanction_type} — {s.reason || '—'} ({new Date(s.created_at).toLocaleDateString('fr-FR')})</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
