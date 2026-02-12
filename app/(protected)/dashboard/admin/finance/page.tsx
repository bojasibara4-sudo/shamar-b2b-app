import { requireAdmin } from '@/lib/auth-guard';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { CreditCard, ShieldAlert, DollarSign, Wallet, Lock, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminFinancePage() {
  await requireAdmin();

  const supabase = await createClient();

  const [paymentsRes, payoutsRes, escrowsRes] = await Promise.all([
    (supabase as any).from('payments').select('id, amount_total, seller_amount, commission_amount, currency, status, created_at, order_id').order('created_at', { ascending: false }).limit(20),
    (supabase as any).from('payouts').select('id, seller_id, amount, currency, status, created_at').order('created_at', { ascending: false }).limit(20),
    (supabase as any).from('escrows').select('id, order_id, amount, currency, status, created_at').order('created_at', { ascending: false }).limit(20),
  ]);

  const payments = paymentsRes.data || [];
  const payouts = payoutsRes.data || [];
  const escrows = escrowsRes.data || [];

  return (
    <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <div className="flex items-center gap-shamar-16 mb-2">
            <div className="p-3 bg-primary-100 rounded-shamar-md">
              <Wallet className="text-primary-600" size={32} />
            </div>
            <div>
              <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Finance</h1>
              <p className="text-shamar-body text-gray-500 font-medium mt-1">
                Vue unifiée : transactions, escrow, commissions, litiges
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-shamar-16">
          <Link href="/dashboard/admin/payments" className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:border-primary-200 hover:bg-gray-50 transition-colors flex items-center gap-shamar-16">
            <div className="p-3 bg-success-500/20 rounded-shamar-md">
              <CreditCard className="text-success-500" size={28} />
            </div>
            <div className="flex-1">
              <h2 className="text-shamar-body font-semibold text-gray-900">Paiements</h2>
              <p className="text-shamar-small text-gray-500">Toutes les transactions</p>
            </div>
            <ArrowRight className="text-gray-400" size={20} />
          </Link>
          <Link href="/dashboard/admin/disputes" className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:border-primary-200 hover:bg-gray-50 transition-colors flex items-center gap-shamar-16">
            <div className="p-3 bg-warning-500/20 rounded-shamar-md">
              <ShieldAlert className="text-amber-600" size={28} />
            </div>
            <div className="flex-1">
              <h2 className="text-shamar-body font-semibold text-gray-900">Litiges</h2>
              <p className="text-shamar-small text-gray-500">Résolution et arbitrage</p>
            </div>
            <ArrowRight className="text-gray-400" size={20} />
          </Link>
          <Link href="/dashboard/admin/commissions" className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:border-primary-200 hover:bg-gray-50 transition-colors flex items-center gap-shamar-16">
            <div className="p-3 bg-primary-100 rounded-shamar-md">
              <DollarSign className="text-primary-600" size={28} />
            </div>
            <div className="flex-1">
              <h2 className="text-shamar-body font-semibold text-gray-900">Commissions</h2>
              <p className="text-shamar-small text-gray-500">Revenus plateforme</p>
            </div>
            <ArrowRight className="text-gray-400" size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-shamar-24">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
            <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-shamar-16 flex items-center gap-2">
              <CreditCard size={22} /> Derniers paiements
            </h2>
            {payments.length === 0 ? (
              <p className="text-gray-500 text-shamar-body">Aucun paiement.</p>
            ) : (
              <div className="space-y-0 divide-y divide-gray-200 max-h-80 overflow-y-auto">
                {payments.map((p: any) => (
                  <div key={p.id} className="flex justify-between items-center py-shamar-12 text-shamar-small">
                    <span className="text-gray-700">{(p.amount_total || 0).toLocaleString()} {p.currency}</span>
                    <span className={`px-2 py-0.5 rounded-shamar-sm text-shamar-caption font-semibold ${p.status === 'paid' || p.status === 'SUCCESS' ? 'bg-success-500/20 text-emerald-700' : 'bg-warning-500/20 text-amber-700'}`}>{p.status}</span>
                    <Link href={`/dashboard/orders/${p.order_id}`} className="text-primary-600 hover:underline text-shamar-caption">Commande</Link>
                  </div>
                ))}
              </div>
            )}
            <Link href="/dashboard/admin/payments" className="inline-block mt-3 text-shamar-small font-semibold text-primary-600 hover:underline">Voir tout →</Link>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
            <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-shamar-16 flex items-center gap-2">
              <Lock size={22} /> Escrows récents
            </h2>
            {escrows.length === 0 ? (
              <p className="text-gray-500 text-shamar-body">Aucun escrow.</p>
            ) : (
              <div className="space-y-0 divide-y divide-gray-200 max-h-80 overflow-y-auto">
                {escrows.map((e: any) => (
                  <div key={e.id} className="flex justify-between items-center py-shamar-12 text-shamar-small">
                    <span className="text-gray-700">{(e.amount || 0).toLocaleString()} {e.currency}</span>
                    <span className="px-2 py-0.5 rounded-shamar-sm text-shamar-caption font-semibold bg-gray-100 text-gray-700">{e.status}</span>
                    <Link href={`/payments/escrow/order/${e.order_id}`} className="text-primary-600 hover:underline text-shamar-caption">Voir</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
          <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-shamar-16">Derniers versements vendeurs</h2>
          {payouts.length === 0 ? (
            <p className="text-gray-500 text-shamar-body">Aucun versement.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-shamar-small">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="py-shamar-12">Montant</th>
                    <th className="py-shamar-12">Statut</th>
                    <th className="py-shamar-12">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((p: any) => (
                    <tr key={p.id} className="border-b border-gray-100">
                      <td className="py-shamar-12 text-gray-900 font-medium">{(p.amount || 0).toLocaleString()} {p.currency}</td>
                      <td className="py-shamar-12"><span className={`px-2 py-0.5 rounded-shamar-sm text-shamar-caption font-semibold ${p.status === 'sent' ? 'bg-success-500/20 text-emerald-700' : 'bg-warning-500/20 text-amber-700'}`}>{p.status}</span></td>
                      <td className="py-shamar-12 text-gray-500">{new Date(p.created_at).toLocaleDateString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
