'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  ShoppingBag, 
  Package, 
  TrendingUp,
  DollarSign,
  FileText,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminStats {
  totalUsers: number;
  totalSellers: number;
  totalBuyers: number;
  totalProducts: number;
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

export default function AdminDashboardClient() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        
        if (!response.ok) {
          // En cas d'erreur, initialiser avec des valeurs par défaut
          setStats({
            totalUsers: 0,
            totalSellers: 0,
            totalBuyers: 0,
            totalProducts: 0,
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
          ...(data.recentUsers?.slice(0, 3).map((user: any) => ({
            id: user.id,
            title: `Nouvel utilisateur ${user.role}`,
            description: `${user.email} s'est inscrit`,
            timestamp: user.created_at,
            userInitials: user.email.substring(0, 2).toUpperCase(),
          })) || []),
          ...(data.recentOrders?.slice(0, 2).map((order: any) => ({
            id: order.id,
            title: `Nouvelle commande`,
            description: `Commande de ${order.total_amount} ${order.currency || 'FCFA'}`,
            timestamp: order.created_at,
          })) || []),
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        setActivities(formattedActivities);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        // En cas d'erreur, initialiser avec des valeurs par défaut
        setStats({
          totalUsers: 0,
          totalSellers: 0,
          totalBuyers: 0,
          totalProducts: 0,
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

  // Mock chart data (can be replaced with real data later)
  const chartData = [
    { name: 'Lun', value: stats.totalOrders },
    { name: 'Mar', value: stats.totalOrders + 10 },
    { name: 'Mer', value: stats.totalOrders + 5 },
    { name: 'Jeu', value: stats.totalOrders + 15 },
    { name: 'Ven', value: stats.totalOrders + 8 },
    { name: 'Sam', value: stats.totalOrders + 12 },
    { name: 'Dim', value: stats.totalOrders + 7 },
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
          title="Utilisateurs totaux"
          value={stats.totalUsers}
          change="+12%"
          trend="up"
          icon={<Users size={24} />}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Produits actifs"
          value={stats.totalProducts}
          change="+5%"
          trend="up"
          icon={<Package size={24} />}
          iconColor="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Commandes"
          value={stats.totalOrders}
          change={`${stats.pendingOrders} en attente`}
          trend="neutral"
          icon={<ShoppingBag size={24} />}
          iconColor="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Revenus totaux"
          value={formatCurrency(stats.totalRevenue)}
          change="+8%"
          trend="up"
          icon={<DollarSign size={24} />}
          iconColor="bg-green-50 text-green-600"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Vendeurs"
          value={stats.totalSellers}
          icon={<Users size={24} />}
          iconColor="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="Acheteurs"
          value={stats.totalBuyers}
          icon={<Users size={24} />}
          iconColor="bg-cyan-50 text-cyan-600"
        />
        <StatCard
          title="Offres actives"
          value={stats.activeOffers}
          icon={<MessageSquare size={24} />}
          iconColor="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Chart and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Activité de la plateforme</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
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
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  strokeWidth={2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <ActivityFeed activities={activities} emptyMessage="Aucune activité récente" />
      </div>
    </div>
  );
}
