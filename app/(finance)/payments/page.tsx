import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { DollarSign, Package, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PaymentsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();

  // Récupérer les commandes de l'utilisateur comme historique de transactions
  const { data: orders } = await (supabase as any)
    .from('orders')
    .select('id, total_amount, currency, status, payment_status, created_at, buyer_id, seller_id')
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('created_at', { ascending: false })
    .limit(50);

  const totalSpent = orders
    ?.filter((o: any) => o.buyer_id === user.id)
    ?.reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0) || 0;

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <div>
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
              <span className="text-primary-600">Paiements</span>
            </h1>
            <p className="text-shamar-body text-gray-500 font-medium">
              Historique de vos transactions et paiements
            </p>
          </div>
        </div>

        {user.role === 'buyer' && (
          <div className="bg-success-500/10 rounded-shamar-md border border-emerald-200 p-shamar-24">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-shamar-small font-medium text-emerald-800">Total dépensé</p>
                <p className="text-shamar-h2 font-semibold text-emerald-900">{totalSpent.toLocaleString()} FCFA</p>
              </div>
              <DollarSign className="h-12 w-12 text-primary-600" />
            </div>
          </div>
        )}

        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft overflow-hidden">
          <h2 className="p-shamar-24 border-b border-gray-200 text-shamar-h3 font-semibold text-gray-900">Historique des transactions</h2>
          {orders && orders.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {orders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-shamar-24 hover:bg-gray-50 transition-colors">
                  <Link href={`/dashboard/orders/${order.id}`} className="flex items-center gap-shamar-16 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-shamar-md flex items-center justify-center shrink-0">
                      <Package className="text-primary-600" size={24} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-shamar-body">Commande #{order.id.slice(0, 8)}</p>
                      <p className="text-shamar-small text-gray-500">{new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </Link>
                  <div className="flex items-center gap-shamar-16 shrink-0">
                    <span className="font-semibold text-gray-900 text-shamar-body">
                      {Number(order.total_amount).toLocaleString()} {order.currency || 'FCFA'}
                    </span>
                    <span className={`px-3 py-1 rounded-shamar-sm text-shamar-caption font-semibold ${
                      order.payment_status === 'paid' ? 'bg-success-500/20 text-emerald-700' :
                      order.status === 'PENDING' ? 'bg-warning-500/20 text-amber-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {order.payment_status === 'paid' ? 'Payé' : order.status === 'PENDING' ? 'En attente' : order.status}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link href={`/payments/escrow/order/${order.id}`} className="text-shamar-caption font-medium text-amber-700 hover:underline">Escrow</Link>
                      <Link href={`/payments/invoice/${order.id}`} className="text-shamar-caption font-medium text-gray-600 hover:underline">Facture</Link>
                      <Link href={`/dashboard/orders/${order.id}`}><ChevronRight className="text-gray-400" size={20} /></Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-shamar-48">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-shamar-24">
                <DollarSign className="w-12 h-12 text-primary-600" />
              </div>
              <h3 className="text-shamar-h2 text-gray-900 mb-3">Aucune transaction</h3>
              <p className="text-gray-500 font-medium max-w-md mx-auto mb-shamar-24 text-shamar-body">
                Vos transactions apparaîtront ici après vos achats ou ventes.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:underline text-shamar-body"
              >
                Découvrir le catalogue <ChevronRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
