'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OrderStatusBadge from './OrderStatusBadge';

type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  // Statuts pour compatibilité avec l'ancien format
  | 'PAID'
  | 'VALIDATED'
  | 'COMPLETED';

type OrderStatusSelectorProps = {
  orderId: string;
  currentStatus: string; // Accepter string pour flexibilité (pending, PENDING, etc.)
};

export default function OrderStatusSelector({
  orderId,
  currentStatus,
}: OrderStatusSelectorProps) {
  const [isLoading, setIsLoading] = useState(false);
  // Normaliser le statut (convertir en majuscules)
  const normalizedStatus = currentStatus.toUpperCase() as OrderStatus;
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(normalizedStatus);
  const router = useRouter();

  // Statuts valides selon le schéma Supabase (en majuscules)
  const statuses: OrderStatus[] = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ];

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsLoading(true);
    try {
      // Détecter la route selon le contexte (seller ou admin)
      // Si on est sur /dashboard/seller, utiliser la route seller
      const isSellerRoute = window.location.pathname.includes('/dashboard/seller');
      const apiRoute = isSellerRoute 
        ? `/api/seller/orders/${orderId}/status`
        : `/api/admin/orders/${orderId}/status`;

      const response = await fetch(apiRoute, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la mise à jour');
        return;
      }

      setSelectedStatus(newStatus);
      router.refresh();
    } catch {
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <OrderStatusBadge status={selectedStatus} />
      <select
        value={selectedStatus}
        onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
        disabled={isLoading}
        className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}

