'use client';

import React from 'react';
import { CheckCircle2, Clock, XCircle, RefreshCw } from 'lucide-react';

export type PaymentStatusType = 'initiated' | 'paid' | 'failed' | 'refunded';

interface PaymentStatusProps {
  status: PaymentStatusType;
  amount?: number;
  currency?: string;
}

export default function PaymentStatus({
  status,
  amount,
  currency = 'FCFA',
}: PaymentStatusProps) {
  const config = {
    paid: {
      icon: CheckCircle2,
      label: 'Payé',
      color: 'text-green-600 bg-green-50 border-green-200',
      iconColor: 'text-green-600',
    },
    initiated: {
      icon: Clock,
      label: 'En attente',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      iconColor: 'text-amber-600',
    },
    failed: {
      icon: XCircle,
      label: 'Échoué',
      color: 'text-red-600 bg-red-50 border-red-200',
      iconColor: 'text-red-600',
    },
    refunded: {
      icon: RefreshCw,
      label: 'Remboursé',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
    },
  };

  const statusConfig = config[status];
  const Icon = statusConfig.icon;

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border ${statusConfig.color}`}>
      <Icon size={20} className={statusConfig.iconColor} />
      <div className="flex-1">
        <p className="font-semibold">{statusConfig.label}</p>
        {amount && (
          <p className="text-sm opacity-75">
            {amount.toLocaleString()} {currency}
          </p>
        )}
      </div>
    </div>
  );
}
