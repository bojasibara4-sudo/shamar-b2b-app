'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';

interface PayoutSummaryProps {
  sellerId: string;
}

interface PayoutData {
  payouts: Array<{
    id: string;
    amount: number;
    currency: string;
    status: 'pending' | 'sent' | 'failed';
    period_start: string;
    period_end: string;
    created_at: string;
  }>;
  pendingAmount: number;
}

export default function PayoutSummary({ sellerId }: PayoutSummaryProps) {
  const [data, setData] = useState<PayoutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const response = await fetch('/api/seller/payouts');
        if (response.ok) {
          const payoutData = await response.json();
          setData(payoutData);
        }
      } catch (error) {
        console.error('Error fetching payouts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayouts();
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

  if (!data) {
    return null;
  }

  const sentAmount = data.payouts
    .filter((p) => p.status === 'sent')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Versements</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-green-600" size={20} />
            <p className="text-sm text-gray-600">Montant versé</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {sentAmount.toLocaleString()} FCFA
          </p>
        </div>

        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-amber-600" size={20} />
            <p className="text-sm text-gray-600">En attente</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {data.pendingAmount.toLocaleString()} FCFA
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-blue-600" size={20} />
            <p className="text-sm text-gray-600">Total versements</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {data.payouts.length}
          </p>
        </div>
      </div>

      {data.payouts.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Historique</h4>
          <div className="space-y-2">
            {data.payouts.slice(0, 5).map((payout) => (
              <div
                key={payout.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {Number(payout.amount).toLocaleString()} {payout.currency}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(payout.period_start).toLocaleDateString('fr-FR')} - {new Date(payout.period_end).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div>
                  {payout.status === 'sent' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      <CheckCircle2 size={12} />
                      Envoyé
                    </span>
                  )}
                  {payout.status === 'pending' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                      <Clock size={12} />
                      En attente
                    </span>
                  )}
                  {payout.status === 'failed' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                      Échoué
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
