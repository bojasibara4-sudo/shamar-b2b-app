'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { stripeService } from '@/lib/payments/stripe';

interface StripeCheckoutProps {
  amount: number;
  currency: 'FCFA' | 'USD' | 'EUR';
  orderId: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

const stripePromise = loadStripe(stripeService.getPublishableKey() || '');

function CheckoutForm({
  amount,
  currency,
  orderId,
  onSuccess,
  onError,
}: StripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    // Création du PaymentIntent
    fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: currency === 'FCFA' ? 'xof' : currency.toLowerCase(),
        orderId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          onError(data.error || 'Erreur lors de la création du paiement');
        }
      })
      .catch((error) => {
        onError(error.message);
      });
  }, [amount, currency, orderId, onError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      onError('Élément de carte non trouvé');
      setLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    setLoading(false);

    if (error) {
      onError(error.message || 'Erreur lors du paiement');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-300 rounded-lg">
        <CardElement options={cardElementOptions} />
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">Montant total</p>
          <p className="text-xl font-bold">
            {amount.toLocaleString()} {currency}
          </p>
        </div>
        <button
          type="submit"
          disabled={!stripe || loading || !clientSecret}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Traitement...' : 'Payer'}
        </button>
      </div>
    </form>
  );
}

export default function StripeCheckout({
  amount,
  currency,
  orderId,
  onSuccess,
  onError,
}: StripeCheckoutProps) {
  const options: StripeElementsOptions = {
    mode: 'payment',
    amount: amount * (currency === 'FCFA' ? 1 : 100), // Conversion en centimes
    currency: currency === 'FCFA' ? 'xof' : currency.toLowerCase(),
  };

  if (!stripeService.isConfigured()) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          Stripe n&apos;est pas configuré. Veuillez configurer les clés API Stripe.
        </p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm
        amount={amount}
        currency={currency}
        orderId={orderId}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}

