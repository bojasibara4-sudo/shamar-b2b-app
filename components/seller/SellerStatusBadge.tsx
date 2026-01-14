'use client';

import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

export type VendorStatus = 'pending' | 'verified' | 'suspended';

interface SellerStatusBadgeProps {
  status: VendorStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export default function SellerStatusBadge({
  status,
  size = 'md',
  showIcon = true,
}: SellerStatusBadgeProps) {
  const config = {
    verified: {
      label: 'Vérifié',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle2,
      iconColor: 'text-green-600',
    },
    pending: {
      label: 'En attente',
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: Clock,
      iconColor: 'text-amber-600',
    },
    suspended: {
      label: 'Suspendu',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: XCircle,
      iconColor: 'text-red-600',
    },
  };

  const statusConfig = config[status];
  const Icon = statusConfig.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${statusConfig.color} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} className={statusConfig.iconColor} />}
      {statusConfig.label}
    </span>
  );
}
