import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import Link from 'next/link';
import { ShoppingBag, Package, MessageSquare, DollarSign, Clock } from 'lucide-react';

export default async function BuyerDashboardClient() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();

  // Récupérer les statistiques buyer
  const [ordersResult, pendingOrdersResult, offersResult, completedOrdersResult] = await Promise.all([
    (supabase as any)
      .from('orders')
      .select('id, total_amount, created_at', { count: 'exact' })
      .eq('buyer_id', user.id),
    (supabase as any)
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('buyer_id', user.id)
      .eq('status', 'pending'),
    (supabase as any)
      .from('offers')
      .select('id', { count: 'exact', head: true })
      .eq('buyer_id', user.id)
      .in('status', ['pending', 'accepted']),
    (supabase as any)
      .from('orders')
      .select('total_amount')
      .eq('buyer_id', user.id)
      .in('status', ['completed', 'delivered']),
  ]);

  const stats = {
    totalOrders: ordersResult.count || 0,
    pendingOrders: pendingOrdersResult.count || 0,
    activeOffers: offersResult.count || 0,
    totalSpent: completedOrdersResult.data?.reduce((sum: number, order: any) => sum + Number(order.total_amount || 0), 0) || 0,
  };

  // Récupérer les activités récentes
  const { data: recentOrders } = await (supabase as any)
    .from('orders')
    .select('id, status, total_amount, created_at')
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: recentOffers } = await (supabase as any)
    .from('offers')
    .select('id, status, quantity, price, created_at')
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3);

  const activities = [
    ...(recentOrders?.map((order: any) => ({
      id: order.id,
      title: `Commande ${order.status === 'completed' ? 'livrée' : order.status === 'pending' ? 'en attente' : order.status}`,
      description: `Montant: ${Number(order.total_amount || 0).toLocaleString()} FCFA`,
      timestamp: order.created_at,
    })) || []),
    ...(recentOffers?.map((offer: any) => ({
      id: offer.id,
      title: `Offre ${offer.status === 'pending' ? 'en attente' : offer.status}`,
      description: `${offer.quantity} unités - ${Number(offer.price || 0).toLocaleString()} FCFA`,
      timestamp: offer.created_at,
    })) || []),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Tableau de bord</h1>
        <p className="text-gray-400 mt-1">Bienvenue, {user.email}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Commandes totales"
          value={stats.totalOrders}
          icon={<ShoppingBag className="w-6 h-6" />}
          link="/dashboard/buyer/orders"
        />
        <StatCard
          title="En attente"
          value={stats.pendingOrders}
          icon={<Clock className="w-6 h-6" />}
          link="/dashboard/buyer/orders?status=pending"
          variant="warning"
        />
        <StatCard
          title="Offres actives"
          value={stats.activeOffers}
          icon={<MessageSquare className="w-6 h-6" />}
          link="/dashboard/buyer/offers"
        />
        <StatCard
          title="Total dépensé"
          value={`${stats.totalSpent.toLocaleString()} FCFA`}
          icon={<DollarSign className="w-6 h-6" />}
          variant="success"
        />
      </div>

      {/* Actions rapides */}
      <div className="bg-brand-bleu-ardoise/50 backdrop-blur-sm rounded-2xl border border-brand-anthracite/50 shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
          <span className="w-1 h-5 bg-brand-or rounded-full block"></span>
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/products"
            className="p-4 rounded-xl border border-brand-anthracite/30 bg-brand-bleu-nuit/50 hover:border-brand-or/40 hover:bg-brand-bleu-nuit/70 transition-all group"
          >
            <Package className="w-5 h-5 mb-2 text-brand-or group-hover:text-brand-or-clair transition-colors" />
            <h3 className="font-semibold text-white">Parcourir les produits</h3>
            <p className="text-sm text-gray-400">Découvrir le catalogue</p>
          </Link>
          <Link
            href="/dashboard/buyer/orders"
            className="p-4 rounded-xl border border-brand-anthracite/30 bg-brand-bleu-nuit/50 hover:border-brand-or/40 hover:bg-brand-bleu-nuit/70 transition-all group"
          >
            <ShoppingBag className="w-5 h-5 mb-2 text-brand-or group-hover:text-brand-or-clair transition-colors" />
            <h3 className="font-semibold text-white">Mes commandes</h3>
            <p className="text-sm text-gray-400">Voir toutes mes commandes</p>
          </Link>
          <Link
            href="/messages"
            className="p-4 rounded-xl border border-brand-anthracite/30 bg-brand-bleu-nuit/50 hover:border-brand-or/40 hover:bg-brand-bleu-nuit/70 transition-all group"
          >
            <MessageSquare className="w-5 h-5 mb-2 text-brand-or group-hover:text-brand-or-clair transition-colors" />
            <h3 className="font-semibold text-white">Messages</h3>
            <p className="text-sm text-gray-400">Contacter les vendeurs</p>
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
