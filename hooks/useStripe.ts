'use client';

import { useState } from 'react';

interface PaymentIntentData {
  amount: number;
  currency: 'usd' | 'eur' | 'xof';
  orderId: string;
}

export function useStripe() {
  const [loading, setLoading] = useState(false);

  const createPaymentIntent = async (data: PaymentIntentData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Error creating payment intent');
      }

      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createPaymentIntent,
  };
}

