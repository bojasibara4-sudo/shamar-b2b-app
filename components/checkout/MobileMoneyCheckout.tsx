'use client';

import React, { useState } from 'react';
import { Phone, CheckCircle } from 'lucide-react';

interface MobileMoneyCheckoutProps {
  amount: number;
  currency: 'FCFA' | 'USD' | 'EUR';
  orderId: string;
  provider: 'mtn' | 'airtel';
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

export default function MobileMoneyCheckout({
  amount,
  currency,
  orderId,
  provider,
  onSuccess,
  onError,
}: MobileMoneyCheckoutProps) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || phone.length < 9) {
      onError('Numéro de téléphone invalide');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/payments/mobile-money', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          phone,
          amount,
          currency,
          orderId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du paiement');
      }

      setTransactionId(data.transactionId);
      onSuccess(data.transactionId);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const providerName = provider === 'mtn' ? 'MTN Mobile Money' : 'Airtel Money';
  const providerColor = provider === 'mtn' ? 'bg-yellow-500' : 'bg-red-500';

  if (transactionId) {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="text-green-600" size={24} />
          <h3 className="text-lg font-semibold text-green-800">
            Paiement initié avec succès
          </h3>
        </div>
        <p className="text-sm text-green-700 mb-2">
          Transaction ID: <strong>{transactionId}</strong>
        </p>
        <p className="text-sm text-green-700">
          Veuillez confirmer le paiement sur votre téléphone.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className={`${providerColor} p-2 rounded-lg`}>
          <Phone className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{providerName}</h3>
          <p className="text-sm text-gray-500">
            Montant: {amount.toLocaleString()} {currency}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de téléphone
          </label>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              defaultValue="+225"
            >
              <option value="+225">+225 (Côte d&apos;Ivoire)</option>
              <option value="+221">+221 (Sénégal)</option>
              <option value="+226">+226 (Burkina Faso)</option>
              <option value="+227">+227 (Niger)</option>
              <option value="+228">+228 (Togo)</option>
              <option value="+229">+229 (Bénin)</option>
              <option value="+237">+237 (Cameroun)</option>
            </select>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="0123456789"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Entrez votre numéro {providerName} (sans indicatif)
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Montant à payer</span>
            <span className="text-lg font-bold text-gray-900">
              {amount.toLocaleString()} {currency}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Une demande de confirmation sera envoyée à votre téléphone
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !phone}
          className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Traitement...
            </>
          ) : (
            <>
              <Phone size={20} />
              Payer avec {providerName}
            </>
          )}
        </button>
      </form>
    </div>
  );
}

