'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import { supabaseClient } from '@/lib/supabaseClient';
import Link from 'next/link';

interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  total_amount: number;
  currency: string;
  status: string;
  created_at: string;
  shop?: {
    name: string;
  };
}

export default function OrdersPage() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadOrders();
    }
  }, [profile]);

  const loadOrders = async () => {
    if (!profile) return;

    try {
      let query = supabaseClient
        .from('orders')
        .select(`
          *,
          shop:shops!orders_seller_id_fkey(name)
        `);

      if (profile.role === 'buyer') {
        query = query.eq('buyer_id', profile.id);
      } else if (profile.role === 'seller') {
        query = query.eq('seller_id', profile.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mes commandes</h1>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Chargement...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Aucune commande</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">Commande #{order.id.slice(0, 8)}</p>
                    {order.shop && (
                      <p className="text-sm text-gray-500">Boutique: {order.shop.name}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600">
                      {order.total_amount.toLocaleString()} {order.currency}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}

