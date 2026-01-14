'use client';

import React, { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';

interface CheckoutProps {
  orderId: string;
  amount: number;
  currency: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function Checkout({
  orderId,
  amount,
  currency,
  onSuccess,
  onError,
}: CheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création du paiement');
      }

      const data = await response.json();
      // const stripeSessionId = data.stripeSessionId; // Utilisé en production pour rediriger vers Stripe

      // En production, rediriger vers Stripe Checkout
      // window.location.href = stripeCheckoutUrl;
      // Pour l'instant, simuler le succès
      if (onSuccess) {
        onSuccess();
      } else {
        alert('Paiement initié avec succès !');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du paiement';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Paiement</h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-600">Montant total</span>
          <span className="text-xl font-bold text-gray-900">
            {amount.toLocaleString()} {currency}
          </span>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Traitement...
            </>
          ) : (
            <>
              <CreditCard size={20} />
              Payer avec Stripe
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Paiement sécurisé par Stripe
        </p>
      </div>
    </div>
  );
}
