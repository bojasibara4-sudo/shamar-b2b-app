import { requireSeller } from '@/lib/auth-guard';
import { getUserDisputes } from '@/services/dispute.service';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { AlertTriangle, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SellerDisputesPage() {
  const user = await requireSeller();
  const disputes = await getUserDisputes(user.id);
  const sellerDisputes = disputes.filter((d) => d.against_user === user.id);

  const supabase = await createClient();
  const orderIds = Array.from(new Set(sellerDisputes.map((d) => d.order_id)));
  const { data: orders } = orderIds.length
    ? await (supabase as any).from('orders').select('id, total_amount, currency').in('id', orderIds)
    : { data: [] };
  const orderMap = (orders || []).reduce((acc: Record<string, { total_amount?: number; currency?: string }>, o: any) => {
    acc[o.id] = o;
    return acc;
  }, {});

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">Litiges</h1>
          <p className="text-shamar-body text-gray-500 font-medium">Litiges où vous êtes mis en cause (vendeur)</p>
        </div>

        {sellerDisputes.length === 0 ? (
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-48 text-center shadow-shamar-soft">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-shamar-16" />
            <p className="text-gray-500 font-medium text-shamar-body">Aucun litige en cours.</p>
          </div>
        ) : (
          <div className="space-y-0 divide-y divide-gray-200 rounded-shamar-md border border-gray-200 bg-gray-0 shadow-shamar-soft overflow-hidden">
            {sellerDisputes.map((d) => (
              <Link
                key={d.id}
                href={`/disputes/${d.id}`}
                className="block p-shamar-24 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-shamar-caption text-gray-500 font-mono">#{d.id?.slice(0, 8)}</span>
                    <span className="text-shamar-caption text-gray-500 ml-2">Commande #{d.order_id?.slice(0, 8)}</span>
                    <h3 className="text-shamar-body font-semibold text-gray-900 mt-1">{d.reason}</h3>
                    {d.description && <p className="text-shamar-small text-gray-500 line-clamp-1 mt-1">{d.description}</p>}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600 font-medium text-shamar-body">
                      {orderMap[d.order_id] ? `${Number(orderMap[d.order_id].total_amount || 0).toLocaleString()} ${orderMap[d.order_id].currency || 'FCFA'}` : '—'}
                    </span>
                    <span className={`px-3 py-1 rounded-shamar-sm text-shamar-small font-semibold ${
                      d.status === 'open' ? 'bg-warning-500/20 text-amber-700' :
                      d.status === 'resolved' ? 'bg-success-500/20 text-emerald-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {d.status === 'open' ? 'Ouvert' : d.status === 'resolved' ? 'Résolu' : 'Rejeté'}
                    </span>
                    <ChevronRight className="text-gray-400" size={20} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
