'use client';

import { useState } from 'react';

interface GeminiResponse {
  success: boolean;
  text?: string;
  error?: string;
}

export function useGemini() {
  const [loading, setLoading] = useState(false);

  const translate = async (text: string, from: 'fr' | 'en', to: 'fr' | 'en'): Promise<GeminiResponse> => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'translate', text, from, to }),
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

  const generateProductDescription = async (productName: string, category: string): Promise<GeminiResponse> => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generateProductDescription', productName, category }),
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

  const assistSourcing = async (product: string, country: string): Promise<GeminiResponse> => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'assistSourcing', product, country }),
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

  return {
    loading,
    translate,
    generateProductDescription,
    assistSourcing,
  };
}

