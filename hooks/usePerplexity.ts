'use client';

import { useState } from 'react';

interface PerplexityResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface NegotiationContext {
  commodity: string;
  quantity: number;
  unit: string;
  proposedPrice: number;
  currency: 'FCFA' | 'USD' | 'EUR';
  originCountry?: string;
  destinationCountry?: string;
  deliveryDeadline?: string;
}

export function usePerplexity() {
  const [loading, setLoading] = useState(false);

  const assistNegotiation = async (context: NegotiationContext): Promise<PerplexityResponse> => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/perplexity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'assistNegotiation', context }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    } finally {
      setLoading(false);
    }
  };

  /** Compare prix (délégué à Gemini = moteur analyse) */
  const comparePrices = async (
    product: string,
    chinaPrice: number,
    localPrice: number,
    currency: 'FCFA' | 'USD' | 'EUR'
  ): Promise<PerplexityResponse> => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'comparePrices', product, chinaPrice, localPrice, currency }),
      });
      const data = await response.json();
      return { success: data.success, message: data.text, error: data.error };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    assistNegotiation,
    comparePrices,
  };
}

