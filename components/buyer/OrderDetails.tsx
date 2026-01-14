'use client';

import React from 'react';
import { Package, User, CheckCircle2 } from 'lucide-react';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import PayButton from '@/components/PayButton';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
  };
}

interface Payment {
  id: string;
  status: string;
  amount: number;
  provider: string;
  transaction_id?: string;
  created_at: string;
}

interface OrderDetailsProps {
  order: {
    id: string;
    total_amount: number;
    currency: string;
    status: string;
    payment_status: string;
    created_at: string;
    shipping_address?: string;
    order_items: OrderItem[];
    seller?: {
      email: string;
      full_name?: string;
      company_name?: string;
    };
    payments?: Payment[];
  };
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  const successfulPayment = order.payments?.find((p) => p.status === 'SUCCESS');
  const isPaid = !!successfulPayment;
  const canPay = order.status === 'PENDING' && !isPaid;

  const statusMap: Record<string, string> = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'confirmed',
    SHIPPED: 'shipped',
    DELIVERED: 'completed',
    CANCELLED: 'cancelled',
  };

  const displayStatus = statusMap[order.status] || 'pending';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Commande #{order.id.slice(0, 8)}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(order.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="text-right">
            <OrderStatusBadge status={displayStatus as any} />
            {canPay && (
              <div className="mt-4">
                <PayButton
                  orderId={order.id}
                  amount={Number(order.total_amount)}
                  currency={order.currency}
                  isPaid={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Status */}
      {isPaid && successfulPayment && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-600" size={24} />
            <div>
              <p className="font-semibold text-green-900">Paiement confirmé</p>
              <p className="text-sm text-green-700">
                Paiement de {Number(successfulPayment.amount).toLocaleString()} {order.currency}
                {' '}via {successfulPayment.provider}
                {successfulPayment.transaction_id && ` • ${successfulPayment.transaction_id}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Articles</h3>
        <div className="space-y-4">
          {order.order_items?.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package size={20} className="text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {item.product?.name || 'Produit'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Quantité: {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-semibold text-gray-900">
                {(Number(item.price) * item.quantity).toLocaleString()} {item.product?.currency || order.currency}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Sous-total</span>
            <span className="font-medium text-gray-900">
              {Number(order.total_amount).toLocaleString()} {order.currency}
            </span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-200">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-lg font-bold text-gray-900">
              {Number(order.total_amount).toLocaleString()} {order.currency}
            </span>
          </div>
        </div>
      </div>

      {/* Seller Info */}
      {order.seller && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendeur</h3>
          <div className="flex items-center gap-3">
            <User size={20} className="text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">
                {order.seller.company_name || order.seller.full_name || order.seller.email}
              </p>
              <p className="text-sm text-gray-500">{order.seller.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Address */}
      {order.shipping_address && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Adresse de livraison</h3>
          <p className="text-gray-600">{order.shipping_address}</p>
        </div>
      )}
    </div>
  );
}
