import { requireSeller } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { TrendingUp, Package, DollarSign, ShoppingCart } from 'lucide-react';

export default async function SellerAnalyticsPage() {
  const user = requireSeller();

  const supabase = createSupabaseServerClient();
  
  let stats = {
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
    thisMonthRevenue: 0,
    topProducts: [] as Array<{ id: string; name: string; quantity: number; revenue: number }>,
  };

  if (supabase) {
    // Total commandes et par statut
    const { data: allOrders, error: ordersError } = await supabase
      .from('orders')
      .select('id, status, total_amount, created_at')
      .eq('seller_id', user.id);

    if (!ordersError && allOrders) {
      stats.totalOrders = allOrders.length;
      stats.pendingOrders = allOrders.filter(o => o.status === 'PENDING').length;
      stats.confirmedOrders = allOrders.filter(o => o.status === 'CONFIRMED' || o.status === 'PROCESSING').length;
      stats.shippedOrders = allOrders.filter(o => o.status === 'SHIPPED').length;
      stats.deliveredOrders = allOrders.filter(o => o.status === 'DELIVERED').length;

      // Revenus totaux (seulement commandes payées ou confirmées)
      const paidOrders = allOrders.filter(o => 
        ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(o.status)
      );
      stats.totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

      // Revenus ce mois-ci
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisMonthOrders = paidOrders.filter(o => 
        new Date(o.created_at) >= firstDayOfMonth
      );
      stats.thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    }

    // Produits les plus vendus
    // Récupérer les commandes du vendeur d'abord
    const { data: sellerOrders, error: ordersError2 } = await supabase
      .from('orders')
      .select('id')
      .eq('seller_id', user.id)
      .in('status', ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']);

    if (!ordersError2 && sellerOrders && sellerOrders.length > 0) {
      const orderIds = sellerOrders.map(o => o.id);
      
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          quantity,
          price,
          product:products(id, name)
        `)
        .in('order_id', orderIds);

    if (!itemsError && orderItems) {
      const productMap = new Map<string, { name: string; quantity: number; revenue: number }>();
      
      orderItems.forEach((item: any) => {
        const productId = item.product?.id || 'unknown';
        const productName = item.product?.name || 'Produit inconnu';
        
        if (!productMap.has(productId)) {
          productMap.set(productId, { name: productName, quantity: 0, revenue: 0 });
        }
        
        const product = productMap.get(productId)!;
        product.quantity += item.quantity || 0;
        product.revenue += (Number(item.price || 0) * (item.quantity || 0));
      });

        stats.topProducts = Array.from(productMap.entries())
          .map(([id, data]) => ({ id, ...data }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
            <p className="mt-2 text-gray-600">Vue d'ensemble de votre activité commerciale</p>
          </div>
          <LogoutButton />
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Commandes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Revenus Totaux</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalRevenue.toLocaleString()} FCFA
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Ce Mois</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.thisMonthRevenue.toLocaleString()} FCFA
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Commandes Livrées</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.deliveredOrders}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <ShoppingCart className="text-emerald-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Commandes par statut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Commandes par Statut</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">En attente</span>
              <span className="text-lg font-bold text-yellow-700">{stats.pendingOrders}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Confirmées</span>
              <span className="text-lg font-bold text-blue-700">{stats.confirmedOrders}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Expédiées</span>
              <span className="text-lg font-bold text-purple-700">{stats.shippedOrders}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Livrées</span>
              <span className="text-lg font-bold text-green-700">{stats.deliveredOrders}</span>
            </div>
          </div>
        </div>

        {/* Produits les plus vendus */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Produits les Plus Vendus</h2>
          {stats.topProducts.length > 0 ? (
            <div className="space-y-3">
              {stats.topProducts.map((product, index) => (
                <div key={product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">#{index + 1} {product.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {product.quantity} unités vendues
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {product.revenue.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">Aucun produit vendu</p>
          )}
        </div>
      </div>
    </div>
  );
}
