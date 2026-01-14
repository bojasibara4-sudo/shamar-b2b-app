'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, CreditCard, Package } from 'lucide-react';

interface EarningsSummaryProps {
  sellerId: string;
}

interface EarningsData {
  totalRevenue: number;
  totalCommissions: number;
  netEarnings: number;
  totalTransactions: number;
  currency: string;
}

export default function EarningsSummary({ sellerId }: EarningsSummaryProps) {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await fetch('/api/seller/earnings');
        if (response.ok) {
          const data = await response.json();
          setEarnings(data.earnings || {
            totalRevenue: 0,
            totalCommissions: 0,
            netEarnings: 0,
            totalTransactions: 0,
            currency: 'FCFA',
          });
        }
      } catch (error) {
        console.error('Error fetching earnings:', error);
        setEarnings({
          totalRevenue: 0,
          totalCommissions: 0,
          netEarnings: 0,
          totalTransactions: 0,
          currency: 'FCFA',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [sellerId]);

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

  if (!earnings) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenus</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-green-600" size={20} />
            <p className="text-sm text-gray-600">Revenus bruts</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {earnings.totalRevenue.toLocaleString()} {earnings.currency}
          </p>
        </div>

        <div className="bg-amber-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-amber-600" size={20} />
            <p className="text-sm text-gray-600">Commissions</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {earnings.totalCommissions.toLocaleString()} {earnings.currency}
          </p>
        </div>

        <div className="bg-emerald-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="text-emerald-600" size={20} />
            <p className="text-sm text-gray-600">Revenus nets</p>
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            {earnings.netEarnings.toLocaleString()} {earnings.currency}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package size={16} className="text-gray-400" />
            <p className="text-sm text-gray-600">Transactions</p>
          </div>
          <p className="font-semibold text-gray-900">{earnings.totalTransactions}</p>
        </div>
      </div>
    </div>
  );
}
