'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard } from 'lucide-react';

type PayButtonProps = {
  orderId: string;
  amount: number;
  currency?: string;
  isPaid?: boolean;
  disabled?: boolean;
};

export default function PayButton({ orderId, amount, currency = 'FCFA', isPaid = false, disabled = false }: PayButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    if (isPaid || disabled) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          provider: 'mobile_money',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Erreur lors du paiement');
        return;
      }

      alert('Paiement effectué avec succès !');
      router.refresh();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Erreur lors du paiement');
    } finally {
      setIsLoading(false);
    }
  };

  if (isPaid) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
        <CreditCard size={16} />
        Payé
      </div>
    );
  }

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading || disabled}
      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <CreditCard size={16} />
      {isLoading ? 'Traitement...' : `Payer ${amount.toLocaleString()} ${currency}`}
    </button>
  );
}
