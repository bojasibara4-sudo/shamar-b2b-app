import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import Link from 'next/link';
import { Users, ShoppingBag, Package, DollarSign, AlertCircle, Clock } from 'lucide-react';

export default async function AdminDashboardClient() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();

  // Récupérer les statistiques admin
  const [
    usersResult,
    ordersResult,
    pendingOrdersResult,
    productsResult,
    pendingDocumentsResult,
    revenueResult
  ] = await Promise.all([
    (supabase as any)
      .from('users')
      .select('id', { count: 'exact', head: true }),
    (supabase as any)
      .from('orders')
      .select('id', { count: 'exact', head: true }),
    (supabase as any)
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
    (supabase as any)
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true),
    (supabase as any)
      .from('documents')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
    (supabase as any)
      .from('orders')
      .select('total_amount')
      .in('status', ['completed', 'delivered']),
  ]);

  const stats = {
    totalUsers: usersResult.count || 0,
    totalOrders: ordersResult.count || 0,
    pendingOrders: pendingOrdersResult.count || 0,
    activeProducts: productsResult.count || 0,
    pendingDocuments: pendingDocumentsResult.count || 0,
    totalRevenue: revenueResult.data?.reduce((sum: number, order: any) => sum + Number(order.total_amount || 0), 0) || 0,
  };

  // Récupérer les activités récentes
  const { data: recentOrders } = await (supabase as any)
    .from('orders')
    .select('id, status, total_amount, created_at, buyer:users!orders_buyer_id_fkey(name, email)')
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: recentUsers } = await (supabase as any)
    .from('users')
    .select('id, email, role, created_at')
    .order('created_at', { ascending: false })
    .limit(3);

  const activities = [
    ...(recentOrders?.map((order: any) => ({
      id: order.id,
      title: `Commande ${order.status === 'completed' ? 'livrée' : order.status === 'pending' ? 'en attente' : order.status}`,
      description: `${order.buyer?.name || order.buyer?.email || 'Client'} - ${Number(order.total_amount || 0).toLocaleString()} FCFA`,
      timestamp: order.created_at,
    })) || []),
    ...(recentUsers?.map((user: any) => ({
      id: user.id,
      title: `Nouvel utilisateur: ${user.email}`,
      description: `Rôle: ${user.role}`,
      timestamp: user.created_at,
    })) || []),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Tableau de bord Admin</h1>
        <p className="text-gray-400 mt-1">Bienvenue, {user.email}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Utilisateurs"
          value={stats.totalUsers}
          icon={<Users className="w-6 h-6" />}
          link="/dashboard/admin/users"
        />
        <StatCard
          title="Commandes totales"
          value={stats.totalOrders}
          icon={<ShoppingBag className="w-6 h-6" />}
          link="/dashboard/admin/orders"
        />
        <StatCard
          title="En attente"
          value={stats.pendingOrders}
          icon={<Clock className="w-6 h-6" />}
          link="/dashboard/admin/orders?status=pending"
          variant="warning"
        />
        <StatCard
          title="Revenus totaux"
          value={`${stats.totalRevenue.toLocaleString()} FCFA`}
          icon={<DollarSign className="w-6 h-6" />}
          variant="success"
        />
      </div>

      {/* Alertes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.pendingDocuments > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <h2 className="text-lg font-semibold text-yellow-900">
                Documents en attente
              </h2>
            </div>
            <p className="text-yellow-800 mb-4">
              {stats.pendingDocuments} document(s) nécessitent votre validation
            </p>
            <Link
              href="/dashboard/admin/documents"
              className="inline-block bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Voir les documents
            </Link>
          </div>
        )}
        <div className="bg-brand-bleu-ardoise/50 backdrop-blur-sm rounded-2xl border border-brand-anthracite/50 shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-white">Produits actifs</h2>
          <p className="text-3xl font-bold text-white mb-2">{stats.activeProducts}</p>
          <Link
            href="/dashboard/admin/products"
            className="text-brand-or hover:text-brand-or-clair hover:underline text-sm font-medium transition-colors"
          >
            Voir tous les produits →
          </Link>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-brand-bleu-ardoise/50 backdrop-blur-sm rounded-2xl border border-brand-anthracite/50 shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
          <span className="w-1 h-5 bg-brand-or rounded-full block"></span>
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/admin/users"
            className="p-4 rounded-xl border border-brand-anthracite/30 bg-brand-bleu-nuit/50 hover:border-brand-or/40 hover:bg-brand-bleu-nuit/70 transition-all group"
          >
            <Users className="w-5 h-5 mb-2 text-brand-or group-hover:text-brand-or-clair transition-colors" />
            <h3 className="font-semibold text-white">Gérer les utilisateurs</h3>
            <p className="text-sm text-gray-400">Voir et modifier les utilisateurs</p>
          </Link>
          <Link
            href="/dashboard/admin/orders"
            className="p-4 rounded-xl border border-brand-anthracite/30 bg-brand-bleu-nuit/50 hover:border-brand-or/40 hover:bg-brand-bleu-nuit/70 transition-all group"
          >
            <ShoppingBag className="w-5 h-5 mb-2 text-brand-or group-hover:text-brand-or-clair transition-colors" />
            <h3 className="font-semibold text-white">Gérer les commandes</h3>
            <p className="text-sm text-gray-400">Suivre toutes les commandes</p>
          </Link>
          <Link
            href="/dashboard/admin/documents"
            className="p-4 rounded-xl border border-brand-anthracite/30 bg-brand-bleu-nuit/50 hover:border-brand-or/40 hover:bg-brand-bleu-nuit/70 transition-all group"
          >
            <AlertCircle className="w-5 h-5 mb-2 text-brand-or group-hover:text-brand-or-clair transition-colors" />
            <h3 className="font-semibold text-white">Validation</h3>
            <p className="text-sm text-gray-400">Valider documents et boutiques</p>
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
