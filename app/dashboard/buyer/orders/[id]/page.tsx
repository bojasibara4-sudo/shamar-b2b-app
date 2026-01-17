import { requireBuyer } from '@/lib/auth-guard';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, User, MapPin, Calendar, DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BuyerOrderDetailPage({ params }: { params: { id: string } }) {
  const user = await requireBuyer();
  const supabase = await createClient();

  // Récupérer la commande avec tous les détails
  const { data: order, error } = await (supabase as any)
    .from('orders')
    .select(`
      *,
      order_items:order_items(
        *,
        product:products(id, name, description, price, currency, image_url)
      ),
      seller:users!orders_seller_id_fkey(id, email, full_name, company_name, phone),
      payments:payments(
        id,
        status,
        amount_total,
        provider,
        created_at
      )
    `)
    .eq('id', params.id)
    .eq('buyer_id', user.id)
    .single();

  if (error || !order) {
    notFound();
  }

  const orderItems = order.order_items || [];
  const totalAmount = Number(order.total_amount || 0);
  
  const statusMap: Record<string, { label: string; color: string }> = {
    'PENDING': { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
    'CONFIRMED': { label: 'Confirmée', color: 'bg-blue-100 text-blue-800' },
    'PROCESSING': { label: 'En traitement', color: 'bg-indigo-100 text-indigo-800' },
    'SHIPPED': { label: 'Expédiée', color: 'bg-purple-100 text-purple-800' },
    'DELIVERED': { label: 'Livrée', color: 'bg-emerald-100 text-emerald-800' },
    'CANCELLED': { label: 'Annulée', color: 'bg-red-100 text-red-800' },
  };

  const status = statusMap[order.status] || statusMap['PENDING'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <Link
          href="/dashboard/buyer/orders"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Retour aux commandes
        </Link>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Commande #{order.id.slice(0, 8)}</h1>
              <p className="text-lg text-slate-500 font-medium">
                Passée le {new Date(order.created_at).toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-xl text-sm font-black ${status.color}`}>
              {status.label}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-[1.5rem] border border-slate-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <User className="h-5 w-5 text-slate-600" />
                <h3 className="font-black text-slate-900">Vendeur</h3>
              </div>
              <p className="text-slate-900 font-bold text-lg">{order.seller?.company_name || order.seller?.full_name || 'N/A'}</p>
              <p className="text-sm text-slate-600 font-medium">{order.seller?.email}</p>
              {order.seller?.phone && (
                <p className="text-sm text-slate-600 font-medium">{order.seller.phone}</p>
              )}
            </div>

            {order.shipping_address && (
              <div className="bg-slate-50 rounded-[1.5rem] border border-slate-100 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="h-5 w-5 text-slate-600" />
                  <h3 className="font-black text-slate-900">Adresse de livraison</h3>
                </div>
                <p className="text-slate-900 font-medium">{order.shipping_address}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
          <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <Package className="h-6 w-6 text-emerald-600" />
            Articles commandés
          </h2>
        <div className="space-y-4">
          {orderItems.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-5 border-2 border-slate-200 rounded-[1.5rem] hover:shadow-lg transition-all"
            >
              <div className="flex-1">
                <h3 className="font-black text-slate-900 text-lg">{item.product?.name || 'Produit'}</h3>
                {item.product?.description && (
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2 font-medium">{item.product.description}</p>
                )}
                <p className="text-sm text-slate-500 mt-2 font-medium">Quantité: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-900 text-lg">
                  {(Number(item.price) * item.quantity).toLocaleString()} {item.product?.currency || order.currency || 'FCFA'}
                </p>
                <p className="text-sm text-slate-500 font-medium">
                  {Number(item.price).toLocaleString()} {item.product?.currency || order.currency || 'FCFA'} × {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="flex justify-between items-center">
            <span className="text-xl font-black text-slate-900">Total</span>
            <span className="text-3xl font-black text-emerald-600">
              {totalAmount.toLocaleString()} {order.currency || 'FCFA'}
            </span>
          </div>
        </div>
        </div>

        {order.payments && order.payments.length > 0 && (
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-emerald-600" />
              Paiements
            </h2>
            <div className="space-y-3">
              {order.payments.map((payment: any) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <div>
                    <p className="font-black text-slate-900">
                      {payment.provider || 'Paiement'} - {payment.status || 'pending'}
                    </p>
                    <p className="text-sm text-slate-600 font-medium">
                      {new Date(payment.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <p className="font-black text-slate-900 text-lg">
                    {Number(payment.amount_total || 0).toLocaleString()} {order.currency || 'FCFA'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
