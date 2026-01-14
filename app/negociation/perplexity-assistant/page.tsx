'use client';

import React, { useState } from 'react';
import LogoutButton from '@/components/LogoutButton';
import type { NegotiationContext } from '@/lib/ai/perplexity';
import { MessageSquare, Sparkles, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';

export default function PerplexityAssistantPage() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'arguments' | 'prices' | 'objections' | 'messages'>('arguments');

  // Form states
  const [negotiationContext, setNegotiationContext] = useState<NegotiationContext>({
    commodity: '',
    quantity: 0,
    unit: 'kg',
    proposedPrice: 0,
    currency: 'FCFA',
    originCountry: '',
    destinationCountry: '',
  });
  const [objection, setObjection] = useState('');
  const [objectionContext, setObjectionContext] = useState('');
  const [priceComparison, setPriceComparison] = useState({
    product: '',
    chinaPrice: 0,
    localPrice: 0,
    currency: 'FCFA' as 'FCFA' | 'USD' | 'EUR',
  });
  const [messageContext, setMessageContext] = useState({
    recipient: 'supplier' as 'supplier' | 'buyer',
    product: '',
    context: '',
  });

  const handleGenerateArguments = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const response = await fetch('/api/ai/perplexity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateArguments',
          ...negotiationContext,
        }),
      });

      const result = await response.json();
      if (result.success && result.message) {
        setResponse(result.message);
      } else {
        setError(result.error || 'Erreur lors de la génération');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleComparePrices = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const response = await fetch('/api/ai/perplexity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'comparePrices',
          ...priceComparison,
        }),
      });

      const result = await response.json();
      if (result.success && result.message) {
        setResponse(result.message);
      } else {
        setError(result.error || 'Erreur lors de la comparaison');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateObjectionResponses = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const response = await fetch('/api/ai/perplexity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateObjectionResponses',
          objection,
          context: objectionContext,
        }),
      });

      const result = await response.json();
      if (result.success && result.message) {
        setResponse(result.message);
      } else {
        setError(result.error || 'Erreur lors de la génération');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMessage = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const response = await fetch('/api/ai/perplexity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateMessage',
          ...messageContext,
        }),
      });

      const result = await response.json();
      if (result.success && result.message) {
        setResponse(result.message);
      } else {
        setError(result.error || 'Erreur lors de la génération');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Sparkles className="text-emerald-600" size={32} />
              Assistant Négociation Perplexity AI
            </h1>
            <p className="mt-2 text-gray-600">
              Aide à la préparation des arguments, analyse de prix et réponses aux objections
            </p>
          </div>
          <LogoutButton />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: 'arguments', label: 'Arguments de négociation', icon: MessageSquare },
            { id: 'prices', label: 'Analyse prix', icon: TrendingUp },
            { id: 'objections', label: 'Réponses objections', icon: AlertCircle },
            { id: 'messages', label: 'Messages persuasifs', icon: DollarSign },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Paramètres</h2>

          {activeTab === 'arguments' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Produit</label>
                <input
                  type="text"
                  value={negotiationContext.commodity}
                  onChange={(e) => setNegotiationContext({ ...negotiationContext, commodity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Ex: Cacao, Café, Huile de palme..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                  <input
                    type="number"
                    value={negotiationContext.quantity}
                    onChange={(e) => setNegotiationContext({ ...negotiationContext, quantity: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unité</label>
                  <select
                    value={negotiationContext.unit}
                    onChange={(e) => setNegotiationContext({ ...negotiationContext, unit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="kg">kg</option>
                    <option value="tonne">tonne</option>
                    <option value="unité">unité</option>
                    <option value="m²">m²</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix proposé</label>
                  <input
                    type="number"
                    value={negotiationContext.proposedPrice}
                    onChange={(e) => setNegotiationContext({ ...negotiationContext, proposedPrice: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                  <select
                    value={negotiationContext.currency}
                    onChange={(e) => setNegotiationContext({ ...negotiationContext, currency: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="FCFA">FCFA</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleGenerateArguments}
                disabled={loading || !negotiationContext.commodity}
                className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Génération...' : 'Générer les arguments'}
              </button>
            </div>
          )}

          {activeTab === 'prices' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Produit</label>
                <input
                  type="text"
                  value={priceComparison.product}
                  onChange={(e) => setPriceComparison({ ...priceComparison, product: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix Chine</label>
                  <input
                    type="number"
                    value={priceComparison.chinaPrice}
                    onChange={(e) => setPriceComparison({ ...priceComparison, chinaPrice: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix marché local</label>
                  <input
                    type="number"
                    value={priceComparison.localPrice}
                    onChange={(e) => setPriceComparison({ ...priceComparison, localPrice: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                <select
                  value={priceComparison.currency}
                  onChange={(e) => setPriceComparison({ ...priceComparison, currency: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="FCFA">FCFA</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <button
                onClick={handleComparePrices}
                disabled={loading || !priceComparison.product}
                className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyse...' : 'Comparer les prix'}
              </button>
            </div>
          )}

          {activeTab === 'objections' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Objection client</label>
                <textarea
                  value={objection}
                  onChange={(e) => setObjection(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  rows={3}
                  placeholder="Ex: Le prix est trop élevé..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contexte</label>
                <textarea
                  value={objectionContext}
                  onChange={(e) => setObjectionContext(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  rows={3}
                  placeholder="Contexte de la négociation..."
                />
              </div>
              <button
                onClick={handleGenerateObjectionResponses}
                disabled={loading || !objection}
                className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Génération...' : 'Générer les réponses'}
              </button>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destinataire</label>
                <select
                  value={messageContext.recipient}
                  onChange={(e) => setMessageContext({ ...messageContext, recipient: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="supplier">Fournisseur</option>
                  <option value="buyer">Acheteur</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Produit</label>
                <input
                  type="text"
                  value={messageContext.product}
                  onChange={(e) => setMessageContext({ ...messageContext, product: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contexte</label>
                <textarea
                  value={messageContext.context}
                  onChange={(e) => setMessageContext({ ...messageContext, context: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  rows={4}
                  placeholder="Contexte de la négociation..."
                />
              </div>
              <button
                onClick={handleGenerateMessage}
                disabled={loading || !messageContext.product}
                className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Génération...' : 'Générer le message'}
              </button>
            </div>
          )}
        </div>

        {/* Response */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Réponse Perplexity AI</h2>
          
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <p className="font-semibold">Erreur</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {response && !loading && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="prose max-w-none">
                <p className="text-gray-800 whitespace-pre-wrap">{response}</p>
              </div>
            </div>
          )}

          {!response && !loading && !error && (
            <div className="py-12 text-center text-gray-400">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p>Remplissez le formulaire et générez une réponse</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

