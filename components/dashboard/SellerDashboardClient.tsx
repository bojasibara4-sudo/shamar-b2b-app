import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import Link from 'next/link';
import { ShoppingBag, Package, DollarSign, TrendingUp, Clock, ShieldAlert } from 'lucide-react';

export default async function SellerDashboardClient() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();

  // Récupérer les statistiques seller
  const [ordersResult, pendingOrdersResult, productsResult, completedOrdersResult, vendorResult, openDisputesResult] = await Promise.all([
    (supabase as any)
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('seller_id', user.id),
    (supabase as any)
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('seller_id', user.id)
      .eq('status', 'pending'),
    (supabase as any)
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('seller_id', user.id)
      .eq('is_active', true),
    (supabase as any)
      .from('orders')
      .select('total_amount')
      .eq('seller_id', user.id)
      .in('status', ['completed', 'delivered']),
    (supabase as any)
      .from('vendors')
      .select('status, level')
      .eq('user_id', user.id)
      .single(),
    (supabase as any)
      .from('disputes')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'open')
      .or(`raised_by.eq.${user.id},against_user.eq.${user.id}`),
  ]);

  const stats = {
    totalOrders: ordersResult.count || 0,
    pendingOrders: pendingOrdersResult.count || 0,
    activeProducts: productsResult.count || 0,
    totalRevenue: completedOrdersResult.data?.reduce((sum: number, order: any) => sum + Number(order.total_amount || 0), 0) || 0,
    vendorStatus: vendorResult.data?.status || 'pending',
    vendorLevel: vendorResult.data?.level || 'bronze',
    openDisputesCount: openDisputesResult?.count || 0,
  };

  // Récupérer les activités récentes
  const { data: recentOrders } = await (supabase as any)
    .from('orders')
    .select('id, status, total_amount, created_at, buyer:users!orders_buyer_id_fkey(name, email)')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: recentProducts } = await (supabase as any)
    .from('products')
    .select('id, name, created_at')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3);

  const activities = [
    ...(recentOrders?.map((order: any) => ({
      id: order.id,
      title: `Commande ${order.status === 'completed' ? 'livrée' : order.status === 'pending' ? 'en attente' : order.status}`,
      description: `${order.buyer?.name || order.buyer?.email || 'Client'} - ${Number(order.total_amount || 0).toLocaleString()} FCFA`,
      timestamp: order.created_at,
    })) || []),
    ...(recentProducts?.map((product: any) => ({
      id: product.id,
      title: `Produit créé: ${product.name}`,
      description: 'Nouveau produit ajouté au catalogue',
      timestamp: product.created_at,
    })) || []),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Tableau de bord Vendeur</h1>
        <p className="text-gray-400 mt-1">Bienvenue, {user.email}</p>
        {stats.vendorStatus !== 'verified' && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Votre compte vendeur est en attente de vérification. 
              <Link href="/dashboard/onboarding-vendeur" className="underline ml-1">
                Complétez votre profil
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Commandes totales"
          value={stats.totalOrders}
          icon={<ShoppingBag className="w-6 h-6" />}
          link="/dashboard/seller/orders"
        />
        <StatCard
          title="En attente"
          value={stats.pendingOrders}
          icon={<Clock className="w-6 h-6" />}
          link="/dashboard/seller/orders?status=pending"
          variant="warning"
        />
        <StatCard
          title="Produits actifs"
          value={stats.activeProducts}
          icon={<Package className="w-6 h-6" />}
          link="/dashboard/seller/products"
        />
        <StatCard
          title="Revenus totaux"
          value={`${stats.totalRevenue.toLocaleString()} FCFA`}
          icon={<DollarSign className="w-6 h-6" />}
          variant="success"
        />
        {stats.openDisputesCount > 0 && (
          <Link href="/dashboard/seller/disputes" className="block p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500/20 rounded-lg">
                <ShieldAlert className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <p className="font-bold text-white">Litiges ouverts</p>
                <p className="text-sm text-rose-200">{stats.openDisputesCount} litige(s) à traiter</p>
              </div>
              <span className="ml-auto px-2 py-1 bg-rose-500 text-white rounded-full text-sm font-bold">{stats.openDisputesCount}</span>
            </div>
          </Link>
        )}
      </div>

      {/* Niveau vendeur */}
      {stats.vendorLevel && (
        <div className="bg-brand-bleu-ardoise/50 backdrop-blur-sm rounded-2xl border border-brand-anthracite/50 shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-1 text-white">Niveau Vendeur</h2>
              <p className="text-sm text-gray-300 capitalize">
                {stats.vendorLevel === 'bronze' && '🥉 Bronze'}
                {stats.vendorLevel === 'silver' && '🥈 Silver'}
                {stats.vendorLevel === 'gold' && '🥇 Gold'}
                {stats.vendorLevel === 'premium' && '💎 Premium'}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-brand-or" />
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="bg-brand-bleu-ardoise/50 backdrop-blur-sm rounded-2xl border border-brand-anthracite/50 shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
          <span className="w-1 h-5 bg-brand-or rounded-full block"></span>
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/seller/products"
            className="p-4 rounded-xl border border-brand-anthracite/30 bg-brand-bleu-nuit/50 hover:border-brand-or/40 hover:bg-brand-bleu-nuit/70 transition-all group"
          >
            <Package className="w-5 h-5 mb-2 text-brand-or group-hover:text-brand-or-clair transition-colors" />
            <h3 className="font-semibold text-white">Ajouter un produit</h3>
            <p className="text-sm text-gray-400">Créer un nouveau produit</p>
          </Link>
          <Link
            href="/dashboard/seller/orders"
            className="p-4 rounded-xl border border-brand-anthracite/30 bg-brand-bleu-nuit/50 hover:border-brand-or/40 hover:bg-brand-bleu-nuit/70 transition-all group"
          >
            <ShoppingBag className="w-5 h-5 mb-2 text-brand-or group-hover:text-brand-or-clair transition-colors" />
            <h3 className="font-semibold text-white">Mes commandes</h3>
            <p className="text-sm text-gray-400">Gérer les commandes</p>
          </Link>
          <Link
            href="/dashboard/seller/analytics"
            className="p-4 rounded-xl border border-brand-anthracite/30 bg-brand-bleu-nuit/50 hover:border-brand-or/40 hover:bg-brand-bleu-nuit/70 transition-all group"
          >
            <TrendingUp className="w-5 h-5 mb-2 text-brand-or group-hover:text-brand-or-clair transition-colors" />
            <h3 className="font-semibold text-white">Analytics</h3>
            <p className="text-sm text-gray-400">Voir les statistiques</p>
          </Link>
        </div>
      </div>

      {/* Activités récentes */}
      {activities.length > 0 && (
        <ActivityFeed activities={activities} />
      )}
    </div>
  );
}
