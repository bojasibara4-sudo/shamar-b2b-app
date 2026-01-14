'use client';

import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  Package, 
  MessageSquare,
  DollarSign,
  Clock
} from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import Link from 'next/link';

interface BuyerStats {
  totalOrders: number;
  pendingOrders: number;
  activeOffers: number;
  totalSpent: number;
}

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  userInitials?: string;
}

export default function BuyerDashboardClient() {
  const [stats, setStats] = useState<BuyerStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/buyer/stats');
        
        if (!response.ok) {
          // En cas d'erreur, initialiser avec des valeurs par défaut
          setStats({
            totalOrders: 0,
            pendingOrders: 0,
            activeOffers: 0,
            totalSpent: 0,
          });
          setActivities([]);
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        
        // Vérifier que data.stats existe
        if (!data.stats) {
          throw new Error('Invalid response format');
        }
        
        setStats(data.stats);

        // Format recent activities
        const formattedActivities: ActivityItem[] = [
          ...(data.recentOrders?.map((order: any) => ({
            id: order.id,
            title: `Commande ${order.status === 'DELIVERED' ? 'livrée' : order.status === 'PENDING' ? 'en attente' : order.status.toLowerCase()}`,
            description: `Montant: ${order.total_amount} FCFA`,
            timestamp: order.created_at,
          })) || []),
          ...(data.recentOffers?.slice(0, 2).map((offer: any) => ({
            id: offer.id,
            title: `Offre ${offer.status === 'pending' ? 'en attente' : offer.status}`,
            description: `${offer.quantity} unités - ${offer.price} FCFA`,
            timestamp: offer.created_at,
          })) || []),
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

        setActivities(formattedActivities);
      } catch (error) {
        console.error('Error fetching buyer stats:', error);
        // En cas d'erreur, initialiser avec des valeurs par défaut
        setStats({
          totalOrders: 0,
          pendingOrders: 0,
          activeOffers: 0,
          totalSpent: 0,
        });
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Toujours afficher quelque chose, même en cas d'erreur
  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  // Si pas de stats après chargement, afficher un état par défaut
  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500 mb-4">Impossible de charger les statistiques</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount).replace('XOF', 'FCFA');
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Commandes totales"
          value={stats.totalOrders}
          change={`${stats.pendingOrders} en attente`}
          trend={stats.pendingOrders > 0 ? 'neutral' : 'up'}
          icon={ShoppingBag}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Montant dépensé"
          value={formatCurrency(stats.totalSpent)}
          icon={DollarSign}
          iconColor="bg-green-50 text-green-600"
        />
        <StatCard
          title="Offres actives"
          value={stats.activeOffers}
          icon={MessageSquare}
          iconColor="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Commandes en attente"
          value={stats.pendingOrders}
          icon={Clock}
          iconColor="bg-orange-50 text-orange-600"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Actions rapides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/dashboard/buyer/products">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                      <Package size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Parcourir les produits</h4>
                      <p className="text-sm text-gray-500">Découvrir les produits</p>
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="/dashboard/buyer/orders">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Mes commandes</h4>
                      <p className="text-sm text-gray-500">Suivre vos commandes</p>
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="/dashboard/buyer/search">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Rechercher</h4>
                      <p className="text-sm text-gray-500">Rechercher des produits</p>
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="/dashboard/buyer/messages">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Messages</h4>
                      <p className="text-sm text-gray-500">Voir vos messages</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <ActivityFeed activities={activities} emptyMessage="Aucune activité récente" />
      </div>
    </div>
  );
}
