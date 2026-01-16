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
      <div className="mb-6">
        <Link
          href="/dashboard/buyer/orders"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Retour aux commandes
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Commande #{order.id.slice(0, 8)}</h1>
            <p className="mt-2 text-gray-600">
              Passée le {new Date(order.created_at).toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${status.color}`}>
            {status.label}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <User className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Vendeur</h3>
            </div>
            <p className="text-gray-900">{order.seller?.company_name || order.seller?.full_name || 'N/A'}</p>
            <p className="text-sm text-gray-600">{order.seller?.email}</p>
            {order.seller?.phone && (
              <p className="text-sm text-gray-600">{order.seller.phone}</p>
            )}
          </div>

          {order.shipping_address && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Adresse de livraison</h3>
              </div>
              <p className="text-gray-900">{order.shipping_address}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="h-5 w-5" />
          Articles commandés
        </h2>
        <div className="space-y-4">
          {orderItems.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.product?.name || 'Produit'}</h3>
                {item.product?.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.product.description}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">Quantité: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  {(Number(item.price) * item.quantity).toLocaleString()} {item.product?.currency || order.currency || 'FCFA'}
                </p>
                <p className="text-sm text-gray-500">
                  {Number(item.price).toLocaleString()} {item.product?.currency || order.currency || 'FCFA'} × {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-emerald-600">
              {totalAmount.toLocaleString()} {order.currency || 'FCFA'}
            </span>
          </div>
        </div>
      </div>

      {order.payments && order.payments.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Paiements
          </h2>
          <div className="space-y-3">
            {order.payments.map((payment: any) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {payment.provider || 'Paiement'} - {payment.status || 'pending'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(payment.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">
                  {Number(payment.amount_total || 0).toLocaleString()} {order.currency || 'FCFA'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
