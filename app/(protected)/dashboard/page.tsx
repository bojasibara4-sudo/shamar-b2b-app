import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const supabase = await createClient();
  
  // Récupérer les statistiques selon le rôle
  const stats = {
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    activeProducts: 0,
  };

  try {
    if (user.role === 'buyer') {
      const { count: totalOrders } = await (supabase as any)
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('buyer_id', user.id);
      
      const { count: pendingOrders } = await (supabase as any)
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('buyer_id', user.id)
        .eq('status', 'PENDING');

      stats.totalOrders = totalOrders || 0;
      stats.pendingOrders = pendingOrders || 0;
    } else if (user.role === 'seller') {
      const { count: totalOrders } = await (supabase as any)
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', user.id);
      
      const { count: activeProducts } = await (supabase as any)
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', user.id)
        .eq('status', 'active');

      const { data: completedOrders } = await (supabase as any)
        .from('orders')
        .select('total_amount')
        .eq('seller_id', user.id)
        .eq('status', 'DELIVERED');

      stats.totalOrders = totalOrders || 0;
      stats.activeProducts = activeProducts || 0;
      stats.totalRevenue = completedOrders?.reduce((sum: number, order: any) => sum + Number(order.total_amount || 0), 0) || 0;
    } else if (user.role === 'admin') {
      const { count: totalOrders } = await (supabase as any)
        .from('orders')
        .select('*', { count: 'exact', head: true });
      
      const { count: pendingOrders } = await (supabase as any)
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'PENDING');

      stats.totalOrders = totalOrders || 0;
      stats.pendingOrders = pendingOrders || 0;
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="mt-2 text-gray-600">
          Bienvenue, {user.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Commandes</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
            </div>
            <Package className="h-8 w-8 text-emerald-600" />
          </div>
        </div>

        {user.role === 'buyer' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.pendingOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        )}

        {user.role === 'seller' && (
          <>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Produits actifs</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stats.activeProducts}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenus</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stats.totalRevenue.toLocaleString()} FCFA
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </>
        )}

        {user.role === 'admin' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.pendingOrders}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
