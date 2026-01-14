'use client';

import React, { useEffect, useState } from 'react';
import { 
  Package, 
  ShoppingBag, 
  TrendingUp,
  DollarSign,
  MessageSquare
} from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

interface SellerStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  activeOffers: number;
  totalRevenue: number;
}

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  userInitials?: string;
}

export default function SellerDashboardClient() {
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/seller/stats');
        
        if (!response.ok) {
          // En cas d'erreur, initialiser avec des valeurs par défaut
          setStats({
            totalProducts: 0,
            activeProducts: 0,
            totalOrders: 0,
            pendingOrders: 0,
            activeOffers: 0,
            totalRevenue: 0,
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
            title: `Nouvelle commande`,
            description: `Commande de ${order.total_amount} FCFA - ${order.status}`,
            timestamp: order.created_at,
          })) || []),
          ...(data.recentProducts?.slice(0, 2).map((product: any) => ({
            id: product.id,
            title: `Produit ${product.status === 'active' ? 'activé' : 'mis à jour'}`,
            description: product.name,
            timestamp: product.created_at,
          })) || []),
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

        setActivities(formattedActivities);
      } catch (error) {
        console.error('Error fetching seller stats:', error);
        // En cas d'erreur, initialiser avec des valeurs par défaut
        setStats({
          totalProducts: 0,
          activeProducts: 0,
          totalOrders: 0,
          pendingOrders: 0,
          activeOffers: 0,
          totalRevenue: 0,
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

  // Mock chart data
  const chartData = [
    { name: 'Lun', value: stats.totalOrders },
    { name: 'Mar', value: stats.totalOrders + 2 },
    { name: 'Mer', value: stats.totalOrders + 1 },
    { name: 'Jeu', value: stats.totalOrders + 3 },
    { name: 'Ven', value: stats.totalOrders + 2 },
    { name: 'Sam', value: stats.totalOrders + 1 },
    { name: 'Dim', value: stats.totalOrders },
  ];

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
          title="Revenus totaux"
          value={formatCurrency(stats.totalRevenue)}
          change="+8%"
          trend="up"
          icon={DollarSign}
          iconColor="bg-green-50 text-green-600"
        />
        <StatCard
          title="Commandes"
          value={stats.totalOrders}
          change={`${stats.pendingOrders} en attente`}
          trend={stats.pendingOrders > 0 ? 'neutral' : 'up'}
          icon={ShoppingBag}
          iconColor="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Produits actifs"
          value={stats.activeProducts}
          change={`${stats.totalProducts} au total`}
          trend="up"
          icon={Package}
          iconColor="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Offres actives"
          value={stats.activeOffers}
          icon={MessageSquare}
          iconColor="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Chart and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Ventes (7 derniers jours)</h3>
            <Link 
              href="/dashboard/seller/analytics" 
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Voir plus →
            </Link>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSeller" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8b5cf6" 
                  fillOpacity={1} 
                  fill="url(#colorSeller)" 
                  strokeWidth={2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <ActivityFeed activities={activities} emptyMessage="Aucune activité récente" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/seller/products">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <Package size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Gérer les produits</h3>
                <p className="text-sm text-gray-500 mt-1">Ajouter ou modifier vos produits</p>
              </div>
            </div>
          </div>
        </Link>
        <Link href="/dashboard/seller/orders">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <ShoppingBag size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Voir les commandes</h3>
                <p className="text-sm text-gray-500 mt-1">Suivre vos commandes</p>
              </div>
            </div>
          </div>
        </Link>
        <Link href="/dashboard/seller/analytics">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-500 mt-1">Analyser vos performances</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
