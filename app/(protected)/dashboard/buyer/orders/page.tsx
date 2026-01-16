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
        };
      } catch (mapError) {
        console.error('Error formatting order:', mapError, order);
        return null;
      }
    })
    .filter((order): order is NonNullable<typeof order> => order !== null); // Retirer les valeurs null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Commandes</h1>
            <p className="mt-2 text-gray-600">Suivez vos commandes et achats</p>
          </div>
          <LogoutButton />
        </div>
      </div>

      <OrderListClient orders={formattedOrders} basePath="/dashboard/buyer/orders" />
    </div>
  );
}
