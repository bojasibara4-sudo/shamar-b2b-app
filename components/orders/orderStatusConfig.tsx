import { Clock, CheckCircle, Truck, XCircle, ShieldCheck } from 'lucide-react';
import React from 'react';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled';

export const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: <Clock size={14} /> },
  confirmed: { label: 'Confirmée', color: 'bg-blue-100 text-blue-800', icon: <CheckCircle size={14} /> },
  shipped: { label: 'Expédiée', color: 'bg-purple-100 text-purple-800', icon: <Truck size={14} /> },
  completed: { label: 'Terminée', color: 'bg-green-100 text-green-800', icon: <ShieldCheck size={14} /> },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800', icon: <XCircle size={14} /> },
};

