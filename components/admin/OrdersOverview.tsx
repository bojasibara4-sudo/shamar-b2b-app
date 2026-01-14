'use client';

import React, { useEffect, useState } from 'react';
import OrderListClient from '@/components/orders/OrderListClient';

interface Order {
  id: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled';
  date: string;
  sellerName?: string;
  buyerName?: string;
}

export default function OrdersOverview() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    shipped: 0,
    completed: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/admin/orders');
        if (response.ok) {
          const data = await response.json();
          
          // Convertir les commandes au format attendu
          const formattedOrders: Order[] = (data.orders || []).map((order: any) => {
            const productNames = Array.isArray(order.order_items)
              ? order.order_items.map((item: any) => 
                  item?.product?.name || 'Produit'
                ).join(', ') || 'Commande'
              : 'Commande';

            const totalQuantity = Array.isArray(order.order_items)
              ? order.order_items.reduce((sum: number, item: any) => 
                  sum + (Number(item?.quantity) || 0), 0
                )
              : 0;

            const statusMap: Record<string, 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled'> = {
              'PENDING': 'pending',
              'CONFIRMED': 'confirmed',
              'PROCESSING': 'confirmed',
              'SHIPPED': 'shipped',
              'DELIVERED': 'completed',
              'CANCELLED': 'cancelled',
            };

            return {
              id: order.id || '',
              productName: productNames,
              quantity: totalQuantity,
              totalAmount: Number(order.total_amount || 0),
              status: statusMap[order.status || 'PENDING'] || 'pending',
              date: order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : '',
              sellerName: order.seller?.company_name || order.seller?.full_name || order.seller?.email || 'Vendeur',
              buyerName: order.buyer?.company_name || order.buyer?.full_name || order.buyer?.email || 'Acheteur',
            };
          });

          setOrders(formattedOrders);

          // Calculer les stats
          const newStats = {
            total: formattedOrders.length,
            pending: formattedOrders.filter((o) => o.status === 'pending').length,
            confirmed: formattedOrders.filter((o) => o.status === 'confirmed').length,
            shipped: formattedOrders.filter((o) => o.status === 'shipped').length,
            completed: formattedOrders.filter((o) => o.status === 'completed').length,
            totalAmount: formattedOrders.reduce((sum, o) => sum + o.totalAmount, 0),
          };
          setStats(newStats);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
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

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">En attente</p>
          <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">Confirmées</p>
          <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">Expédiées</p>
          <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-emerald-600">
            {stats.totalAmount.toLocaleString()} FCFA
          </p>
        </div>
      </div>

      {/* Orders List */}
      <OrderListClient orders={orders} basePath="/dashboard/admin/orders" />
    </div>
  );
}
