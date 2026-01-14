'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, ShoppingBag, Percent } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsData {
  gmv: number;
  platformRevenue: number;
  vendorRevenue: number;
  topVendors: Array<{
    vendor_id: string;
    vendor_name: string;
    total_revenue: number;
    order_count: number;
  }>;
  conversionRate: number;
  totalOrders: number;
  completedOrders: number;
  totalPayments: number;
  totalPayouts: number;
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/admin/analytics');
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data.analytics);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-500">Aucune donnée disponible</p>
      </div>
    );
  }

  const chartData = analytics.topVendors.slice(0, 5).map((vendor) => ({
    name: vendor.vendor_name.length > 15 ? vendor.vendor_name.substring(0, 15) + '...' : vendor.vendor_name,
    revenue: vendor.total_revenue,
    orders: vendor.order_count,
  }));

  const revenueData = [
    { name: 'Plateforme', value: analytics.platformRevenue },
    { name: 'Vendeurs', value: analytics.vendorRevenue },
  ];

  const COLORS = ['#10b981', '#3b82f6'];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-emerald-600" size={24} />
            <p className="text-sm text-gray-600">GMV</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {analytics.gmv.toLocaleString()} FCFA
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-blue-600" size={24} />
            <p className="text-sm text-gray-600">Revenus plateforme</p>
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            {analytics.platformRevenue.toLocaleString()} FCFA
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="text-purple-600" size={24} />
            <p className="text-sm text-gray-600">Commandes</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {analytics.completedOrders} / {analytics.totalOrders}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Percent className="text-amber-600" size={24} />
            <p className="text-sm text-gray-600">Taux conversion</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {analytics.conversionRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Vendeurs */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Vendeurs (Revenus)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition Revenus */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition Revenus</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Vendeurs Liste */}
      {analytics.topVendors.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Vendeurs</h3>
          <div className="space-y-3">
            {analytics.topVendors.map((vendor, index) => (
              <div
                key={vendor.vendor_id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{vendor.vendor_name}</p>
                    <p className="text-sm text-gray-500">{vendor.order_count} commandes</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-emerald-600">
                  {vendor.total_revenue.toLocaleString()} FCFA
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
