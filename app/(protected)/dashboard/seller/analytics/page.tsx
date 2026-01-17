import { requireSeller } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { createClient } from '@/lib/supabase/server';
import { TrendingUp, Package, DollarSign, ShoppingCart } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SellerAnalyticsPage() {
  const user = await requireSeller();

  const supabase = await createClient();
  
  const stats = {
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
    thisMonthRevenue: 0,
    topProducts: [] as Array<{ id: string; name: string; quantity: number; revenue: number }>,
  };

  // Total commandes et par statut
  const { data: allOrders, error: ordersError } = await (supabase as any)
    .from('orders')
    .select('id, status, total_amount, created_at')
    .eq('seller_id', user.id);

  if (!ordersError && allOrders) {
    stats.totalOrders = allOrders.length;
    stats.pendingOrders = allOrders.filter((o: any) => o.status === 'PENDING').length;
    stats.confirmedOrders = allOrders.filter((o: any) => o.status === 'CONFIRMED' || o.status === 'PROCESSING').length;
    stats.shippedOrders = allOrders.filter((o: any) => o.status === 'SHIPPED').length;
    stats.deliveredOrders = allOrders.filter((o: any) => o.status === 'DELIVERED').length;

    // Revenus totaux (seulement commandes payées ou confirmées)
    const paidOrders = allOrders.filter((o: any) => 
      ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(o.status)
    );
    stats.totalRevenue = paidOrders.reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0);

    // Revenus ce mois-ci
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthOrders = paidOrders.filter((o: any) => 
      new Date(o.created_at) >= firstDayOfMonth
    );
    stats.thisMonthRevenue = thisMonthOrders.reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0);
  }

  // Produits les plus vendus
  // Récupérer les commandes du vendeur d'abord
  const { data: sellerOrders, error: ordersError2 } = await (supabase as any)
    .from('orders')
    .select('id')
    .eq('seller_id', user.id)
    .in('status', ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']);

  if (!ordersError2 && sellerOrders && sellerOrders.length > 0) {
    const orderIds = sellerOrders.map((o: any) => o.id);
    
    const { data: orderItems, error: itemsError } = await (supabase as any)
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                <span className="text-indigo-600">Statistiques</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium">
                Vue d'ensemble de votre activité commerciale
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Commandes</p>
              <p className="text-3xl font-black text-slate-900 mt-2">{stats.totalOrders}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Package className="text-blue-600" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Revenus Totaux</p>
              <p className="text-3xl font-black text-slate-900 mt-2">
                {stats.totalRevenue.toLocaleString()} FCFA
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <DollarSign className="text-green-600" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Ce Mois</p>
              <p className="text-3xl font-black text-slate-900 mt-2">
                {stats.thisMonthRevenue.toLocaleString()} FCFA
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <TrendingUp className="text-purple-600" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Commandes Livrées</p>
              <p className="text-3xl font-black text-slate-900 mt-2">{stats.deliveredOrders}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl">
              <ShoppingCart className="text-emerald-600" size={28} />
            </div>
          </div>
        </div>
        </div>

        {/* Commandes par statut */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-black text-slate-900 mb-4">Commandes par Statut</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                <span className="text-sm font-bold text-slate-700">En attente</span>
                <span className="text-xl font-black text-yellow-700">{stats.pendingOrders}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-sm font-bold text-slate-700">Confirmées</span>
                <span className="text-xl font-black text-blue-700">{stats.confirmedOrders}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl border border-purple-100">
                <span className="text-sm font-bold text-slate-700">Expédiées</span>
                <span className="text-xl font-black text-purple-700">{stats.shippedOrders}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-100">
                <span className="text-sm font-bold text-slate-700">Livrées</span>
                <span className="text-xl font-black text-green-700">{stats.deliveredOrders}</span>
              </div>
            </div>
          </div>

          {/* Produits les plus vendus */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-black text-slate-900 mb-4">Produits les Plus Vendus</h2>
            {stats.topProducts.length > 0 ? (
              <div className="space-y-3">
                {stats.topProducts.map((product, index) => (
                  <div key={product.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-sm font-black text-slate-900">#{index + 1} {product.name}</p>
                      <p className="text-xs text-slate-500 mt-1 font-medium">
                        {product.quantity} unités vendues
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">
                        {product.revenue.toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-8 font-medium">Aucun produit vendu</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
