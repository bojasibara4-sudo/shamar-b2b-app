import { requireBuyer } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { createClient } from '@/lib/supabase/server';
import OrderListClient from '@/components/orders/OrderListClient';

export const dynamic = 'force-dynamic';

export default async function BuyerOrdersPage() {
  const user = await requireBuyer();

  const supabase = await createClient();
  
  // Récupérer les commandes depuis Supabase avec les paiements
  let orders: any[] = [];
  
  try {
    const { data, error } = await (supabase as any)
        .from('orders')
        .select(`
          *,
          order_items:order_items(
            *,
            product:products(name, description)
          ),
          seller:users!orders_seller_id_fkey(email, full_name, company_name),
          payments:payments(
            id,
            status,
            amount,
            provider,
            created_at
          )
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        orders = [];
      } else if (data) {
        orders = data;
      } else {
        orders = [];
      }
  } catch (error) {
    console.error('Error in BuyerOrdersPage:', error);
    orders = [];
  }

  const orderIds = orders.map((o: any) => o.id).filter(Boolean);
  const openDisputesByOrder: Record<string, string> = {};
  if (orderIds.length > 0) {
    const { data: disputes } = await (supabase as any)
      .from('disputes')
      .select('id, order_id')
      .eq('raised_by', user.id)
      .eq('status', 'open')
      .in('order_id', orderIds);
    if (Array.isArray(disputes)) {
      disputes.forEach((d: { id: string; order_id: string }) => {
        openDisputesByOrder[d.order_id] = d.id;
      });
    }
  }

  // Convertir les commandes au format attendu par OrderListClient
  const formattedOrders = orders
    .filter(order => order && order.id) // Filtrer les commandes invalides
    .map(order => {
      try {
        const productNames = Array.isArray(order.order_items)
          ? order.order_items.map((item: any) => 
              item?.product?.name || 'Produit'
            ).join(', ') || 'Commande'
          : 'Commande';
        
        const totalQuantity = Array.isArray(order.order_items)
          ? order.order_items.reduce((sum: number, item: any) => 
              sum + (Number(item?.quantity) || 0), 0
            )
          : 0;

        // Vérifier si la commande est payée
        const successfulPayment = Array.isArray(order.payments)
          ? order.payments.find((p: any) => p?.status === 'SUCCESS')
          : null;
        const isPaid = !!successfulPayment;

        // Convertir le statut de MAJUSCULES vers minuscules pour le composant
        const statusMap: Record<string, 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled'> = {
          'PENDING': 'pending',
          'CONFIRMED': 'confirmed',
          'PROCESSING': 'confirmed',
          'SHIPPED': 'shipped',
          'DELIVERED': 'completed',
          'CANCELLED': 'cancelled',
        };

        return {
          id: order.id || '',
          productName: productNames,
          quantity: totalQuantity,
          totalAmount: Number(order.total_amount || 0),
          status: statusMap[order.status || 'PENDING'] || 'pending',
          date: order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : '',
          sellerName: order.seller?.company_name || order.seller?.full_name || order.seller?.email || 'Vendeur',
          buyerName: user.email,
          isPaid,
          paymentStatus: isPaid ? 'paid' : 'pending',
          currency: order.currency || 'FCFA',
          disputeId: openDisputesByOrder[order.id] || undefined,
        };
      } catch (mapError) {
        console.error('Error formatting order:', mapError, order);
        return null;
      }
    })
    .filter((order): order is NonNullable<typeof order> => order !== null); // Retirer les valeurs null

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-shamar-16">
            <div>
              <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
                Mes <span className="text-primary-600">Commandes</span>
              </h1>
              <p className="text-shamar-body text-gray-500 font-medium">
                Suivez vos commandes et achats
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <OrderListClient orders={formattedOrders} basePath="/dashboard/buyer/orders" />
      </div>
    </div>
    </div>
  );
}
