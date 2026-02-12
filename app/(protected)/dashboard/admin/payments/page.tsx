import { requireAdmin } from '@/lib/auth-guard';
import { createClient } from '@/lib/supabase/server';
import { CreditCard } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage() {
  await requireAdmin();

  const supabase = await createClient();
  const { data: payments } = await (supabase as any)
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <div className="flex items-center gap-shamar-16 mb-2">
            <div className="p-3 bg-primary-100 rounded-shamar-md">
              <CreditCard className="text-primary-600" size={32} />
            </div>
            <div>
              <h1 className="text-shamar-h1 text-gray-900 tracking-tight">
                <span className="text-primary-600">Paiements</span>
              </h1>
              <p className="text-shamar-body text-gray-500 font-medium mt-1">
                Vue d&apos;ensemble des transactions
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-32">
          <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-shamar-16">Paiements</h2>
          {(!payments || payments.length === 0) ? (
            <div className="text-center py-shamar-48">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-shamar-24">
                <CreditCard className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium text-shamar-body">Aucun paiement.</p>
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-gray-200">
              {(payments || []).map((p: any) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center py-shamar-16 first:pt-0"
                >
                  <div>
                    <span className="font-medium text-gray-900 text-shamar-body">
                      {(p.amount_total || p.amount || 0).toLocaleString()} {p.currency || 'FCFA'}
                    </span>
                    <span className="ml-2 text-shamar-small text-gray-500">{p.provider}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-shamar-sm text-shamar-small font-semibold ${
                    p.status === 'paid' || p.status === 'SUCCESS' ? 'bg-success-500/20 text-emerald-700' :
                    p.status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-warning-500/20 text-amber-700'
                  }`}>
                    {p.status === 'paid' || p.status === 'SUCCESS' ? 'Payé' : p.status === 'failed' ? 'Échoué' : p.status || '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
