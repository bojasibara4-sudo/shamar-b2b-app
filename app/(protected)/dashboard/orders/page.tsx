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
  seller?: {
    email?: string;
    full_name?: string;
    company_name?: string;
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
          seller:users!orders_seller_id_fkey(email, full_name, company_name)
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
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
              Mes <span className="text-primary-600">Commandes</span>
            </h1>
            <p className="text-shamar-body text-gray-500 font-medium">
              Suivez toutes vos commandes
            </p>
          </div>

          {loading ? (
            <div className="text-center py-shamar-48 bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft">
              <p className="text-gray-500 font-medium text-shamar-body">Chargement...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-shamar-48 bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-shamar-16" />
              <p className="text-gray-500 font-medium text-shamar-body">Aucune commande</p>
            </div>
          ) : (
            <div className="space-y-shamar-16">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/dashboard/orders/${order.id}`}
                  className="block bg-gray-0 p-shamar-24 rounded-shamar-md border border-gray-200 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900 text-shamar-body">Commande #{order.id.slice(0, 8)}</p>
                      {order.seller && (
                        <p className="text-shamar-small text-gray-500 font-medium mt-1">
                          Vendeur: {order.seller.company_name || order.seller.full_name || order.seller.email}
                        </p>
                      )}
                      <p className="text-shamar-small text-gray-400 font-medium mt-1">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-shamar-h3 font-semibold text-primary-600">
                        {order.total_amount.toLocaleString()} {order.currency}
                      </p>
                      <span className={`inline-block px-3 py-1 rounded-shamar-sm text-shamar-caption font-semibold mt-2 ${
                        order.status === 'DELIVERED' ? 'bg-success-500/20 text-gray-800' :
                        order.status === 'CANCELLED' ? 'bg-danger-500/20 text-gray-800' :
                        'bg-warning-500/20 text-gray-800'
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
      </div>
    </AuthGuard>
  );
}

