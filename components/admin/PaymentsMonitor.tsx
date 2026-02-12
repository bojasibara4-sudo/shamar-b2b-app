'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface Payment {
  id: string;
  order_id: string;
  amount_total: number;
  commission_amount: number;
  vendor_amount: number;
  seller_amount?: number;
  currency: string;
  status: 'initiated' | 'paid' | 'failed' | 'refunded';
  provider: string;
  created_at: string;
  buyer?: { email: string; company_name?: string };
  vendor?: { email: string; company_name?: string };
  seller?: { email: string; company_name?: string };
}

export default function PaymentsMonitor() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    totalAmount: 0,
    totalCommissions: 0,
    paid: 0,
    failed: 0,
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch('/api/admin/payments');
        if (response.ok) {
          const data = await response.json();
          setPayments(data.payments || []);

          const newStats = {
            total: data.payments?.length || 0,
            totalAmount: data.payments?.reduce((sum: number, p: Payment) => sum + Number(p.amount_total || 0), 0) || 0,
            totalCommissions: data.payments?.reduce((sum: number, p: Payment) => sum + Number(p.commission_amount || 0), 0) || 0,
            paid: data.payments?.filter((p: Payment) => p.status === 'paid').length || 0,
            failed: data.payments?.filter((p: Payment) => p.status === 'failed').length || 0,
          };
          setStats(newStats);
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
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

  const statusConfig = {
    paid: { icon: CheckCircle2, color: 'bg-green-100 text-green-800', label: 'Payé' },
    initiated: { icon: Clock, color: 'bg-amber-100 text-amber-800', label: 'En attente' },
    failed: { icon: XCircle, color: 'bg-red-100 text-red-800', label: 'Échoué' },
    refunded: { icon: Clock, color: 'bg-blue-100 text-blue-800', label: 'Remboursé' },
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-gray-400" size={20} />
            <p className="text-sm text-gray-600">Montant total</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.totalAmount.toLocaleString()} FCFA
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-gray-400" size={20} />
            <p className="text-sm text-gray-600">Commissions</p>
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            {stats.totalCommissions.toLocaleString()} FCFA
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="text-gray-400" size={20} />
            <p className="text-sm text-gray-600">Payés</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="text-gray-400" size={20} />
            <p className="text-sm text-gray-600">Échoués</p>
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Paiements</h3>
        {payments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <DollarSign size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Aucun paiement</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => {
              const StatusIcon = statusConfig[payment.status].icon;
              const statusColor = statusConfig[payment.status].color;
              const statusLabel = statusConfig[payment.status].label;

              return (
                <div
                  key={payment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-emerald-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-sm font-mono text-gray-400">#{payment.id.slice(0, 8)}</p>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                          <StatusIcon size={14} />
                          {statusLabel}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Commande #{payment.order_id.slice(0, 8)}
                      </p>
                      {payment.buyer && (
                        <p className="text-xs text-gray-500">
                          Acheteur: {payment.buyer.company_name || payment.buyer.email}
                        </p>
                      )}
                      {payment.seller && (
                        <p className="text-xs text-gray-500">
                          Seller: {payment.seller.company_name || payment.seller.email}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {Number(payment.amount_total).toLocaleString()} {payment.currency}
                      </p>
                      <p className="text-sm text-gray-500">
                        Commission: {Number(payment.commission_amount).toLocaleString()} {payment.currency}
                      </p>
                      <p className="text-sm text-emerald-600">
                        Vendeur: {Number(payment.seller_amount || payment.vendor_amount).toLocaleString()} {payment.currency}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(payment.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
