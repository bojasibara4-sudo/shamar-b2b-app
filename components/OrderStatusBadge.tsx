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
  | 'COMPLETED'
  // Statuts en minuscules pour compatibilité
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'paid'
  | 'validated'
  | 'completed';

type OrderStatusBadgeProps = {
  status: OrderStatus | string; // Accepter string pour flexibilité
};

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  // Normaliser le statut en majuscules
  const normalizedStatus = status.toUpperCase() as OrderStatus;
  
  const statusConfig: Record<string, { label: string; className: string }> =
    {
      PENDING: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
      CONFIRMED: { label: 'Confirmée', className: 'bg-blue-100 text-blue-800' },
      PROCESSING: { label: 'En traitement', className: 'bg-indigo-100 text-indigo-800' },
      SHIPPED: { label: 'Expédiée', className: 'bg-purple-100 text-purple-800' },
      DELIVERED: { label: 'Livrée', className: 'bg-green-100 text-green-800' },
      CANCELLED: { label: 'Annulée', className: 'bg-red-100 text-red-800' },
      // Statuts pour compatibilité avec l'ancien format
      PAID: { label: 'Payée', className: 'bg-blue-100 text-blue-800' },
      VALIDATED: { label: 'Validée', className: 'bg-green-100 text-green-800' },
      COMPLETED: { label: 'Terminée', className: 'bg-gray-100 text-gray-800' },
    };

  const config = statusConfig[normalizedStatus] || statusConfig['PENDING'];

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${config.className}`}
    >
      {config.label}
    </span>
  );
}

