'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import { supabaseClient } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Package } from 'lucide-react';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
              Mes <span className="text-emerald-600">Commandes</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium">
              Suivez toutes vos commandes
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16 bg-white rounded-[2rem] border border-slate-200">
              <p className="text-slate-500 font-medium">Chargement...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-[2rem] border border-slate-200">
              <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Aucune commande</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/dashboard/orders/${order.id}`}
                  className="block bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-black text-slate-900 text-lg">Commande #{order.id.slice(0, 8)}</p>
                      {order.shop && (
                        <p className="text-sm text-slate-500 font-medium mt-1">Boutique: {order.shop.name}</p>
                      )}
                      <p className="text-sm text-slate-400 font-medium mt-1">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-emerald-600">
                        {order.total_amount.toLocaleString()} {order.currency}
                      </p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-black mt-2 ${
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
      </div>
    </AuthGuard>
  );
}

