'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, CreditCard, Package, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface Transaction {
  id: string;
  order_id: string;
  amount: number;
  commission_amount: number;
  status: 'pending' | 'paid' | 'failed';
  created_at: string;
  order?: {
    id: string;
    total_amount: number;
    currency: string;
    status: string;
    buyer?: {
      email: string;
      company_name?: string;
    };
    seller?: {
      email: string;
      company_name?: string;
    };
  };
}

export default function TransactionsMonitor() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    totalAmount: 0,
    totalCommissions: 0,
    pending: 0,
    paid: 0,
    failed: 0,
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/admin/transactions');
        if (response.ok) {
          const data = await response.json();
          setTransactions(data.transactions || []);

          // Calculer les stats
          const newStats = {
            total: data.transactions?.length || 0,
            totalAmount: data.transactions?.reduce((sum: number, tx: Transaction) => sum + Number(tx.amount || 0), 0) || 0,
            totalCommissions: data.transactions?.reduce((sum: number, tx: Transaction) => sum + Number(tx.commission_amount || 0), 0) || 0,
            pending: data.transactions?.filter((tx: Transaction) => tx.status === 'pending').length || 0,
            paid: data.transactions?.filter((tx: Transaction) => tx.status === 'paid').length || 0,
            failed: data.transactions?.filter((tx: Transaction) => tx.status === 'failed').length || 0,
          };
          setStats(newStats);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
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
    pending: { icon: Clock, color: 'bg-amber-100 text-amber-800', label: 'En attente' },
    paid: { icon: CheckCircle2, color: 'bg-green-100 text-green-800', label: 'Payé' },
    failed: { icon: XCircle, color: 'bg-red-100 text-red-800', label: 'Échoué' },
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
            <CreditCard className="text-gray-400" size={20} />
            <p className="text-sm text-gray-600">Transactions</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="text-gray-400" size={20} />
            <p className="text-sm text-gray-600">Payées</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transactions</h3>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Aucune transaction</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => {
              const StatusIcon = statusConfig[tx.status].icon;
              const statusColor = statusConfig[tx.status].color;
              const statusLabel = statusConfig[tx.status].label;

              return (
                <div
                  key={tx.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-emerald-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-sm font-mono text-gray-400">#{tx.id.slice(0, 8)}</p>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                          <StatusIcon size={14} />
                          {statusLabel}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Commande #{tx.order_id.slice(0, 8)}
                      </p>
                      {tx.order?.buyer && (
                        <p className="text-xs text-gray-500">
                          Acheteur: {tx.order.buyer.company_name || tx.order.buyer.email}
                        </p>
                      )}
                      {tx.order?.seller && (
                        <p className="text-xs text-gray-500">
                          Vendeur: {tx.order.seller.company_name || tx.order.seller.email}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {Number(tx.amount).toLocaleString()} {tx.order?.currency || 'FCFA'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Commission: {Number(tx.commission_amount).toLocaleString()} {tx.order?.currency || 'FCFA'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(tx.created_at).toLocaleDateString('fr-FR')}
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
