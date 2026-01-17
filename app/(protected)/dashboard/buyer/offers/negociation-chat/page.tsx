'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Sparkles } from 'lucide-react';
import { perplexityService } from '@/lib/ai/perplexity';

interface Message {
  id: string;
  sender: 'user' | 'ai' | 'other';
  text: string;
  timestamp: string;
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

export default function NegociationChatPage() {
  // Note: L'authentification est gérée au niveau du layout ou middleware

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [negotiationContext, setNegotiationContext] = useState<NegotiationContext | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Récupération du contexte de négociation depuis l'URL ou le localStorage
    const params = new URLSearchParams(window.location.search);
    const contextFromUrl = {
      commodity: params.get('commodity') || 'Produit',
      quantity: parseInt(params.get('quantity') || '1'),
      unit: params.get('unit') || 'unité',
      proposedPrice: parseFloat(params.get('price') || '0'),
      currency: (params.get('currency') || 'FCFA') as 'FCFA' | 'USD' | 'EUR',
      originCountry: params.get('origin') || undefined,
      destinationCountry: params.get('destination') || undefined,
      deliveryDeadline: params.get('deadline') || undefined,
    };
    setNegotiationContext(contextFromUrl);

    // Message de bienvenue
    setMessages([
      {
        id: '1',
        sender: 'ai',
        text: 'Bonjour ! Je suis votre assistant de négociation B2B. Comment puis-je vous aider aujourd\'hui ?',
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let aiResponse = '';

      if (negotiationContext) {
        // Utilisation de Perplexity pour l'assistance négociation
        const response = await perplexityService.generateNegotiationArguments(
          negotiationContext
        );

        if (response.success && response.message) {
          aiResponse = response.message;
        } else {
          // Fallback si Perplexity n'est pas configuré
          aiResponse = `Pour "${negotiationContext.commodity}", je recommande de négocier un prix de ${negotiationContext.proposedPrice} ${negotiationContext.currency} pour une quantité de ${negotiationContext.quantity} ${negotiationContext.unit}.`;
        }
      } else {
        // Réponse générique
        aiResponse = 'Je suis là pour vous aider dans vos négociations B2B. Pouvez-vous me donner plus de détails sur votre demande ?';
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetAIHelp = async () => {
    if (!negotiationContext || isLoading) return;

    setIsLoading(true);
    try {
      const response = await perplexityService.generateNegotiationArguments(
        negotiationContext
      );

      if (response.success && response.message) {
        const helpMessage: Message = {
          id: Date.now().toString(),
          sender: 'ai',
          text: `💡 Suggestions de négociation :\n\n${response.message}`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, helpMessage]);
      }
    } catch (error) {
      console.error('Error getting AI help:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 p-6 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <Sparkles className="text-emerald-600" size={28} />
            Assistant Négociation <span className="text-emerald-600">B2B</span>
          </h1>
          {negotiationContext && (
            <p className="text-sm text-slate-500 font-medium mt-2">
              {negotiationContext.commodity} - {negotiationContext.quantity}{' '}
              {negotiationContext.unit} - {negotiationContext.proposedPrice}{' '}
              {negotiationContext.currency}
            </p>
          )}
        </div>
        {negotiationContext && (
          <button
            onClick={handleGetAIHelp}
            disabled={isLoading}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-black hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/20"
          >
            <Sparkles size={20} />
            Aide IA
          </button>
        )}
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-md px-6 py-4 rounded-2xl shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-800 border-2 border-slate-200'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="flex items-center gap-2 mb-3">
                  <Bot size={18} className="text-emerald-600" />
                  <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">
                    Assistant IA
                  </span>
                </div>
              )}
              <p className="whitespace-pre-wrap font-medium leading-relaxed">{msg.text}</p>
              <p className={`text-xs mt-2 ${msg.sender === 'user' ? 'text-emerald-100' : 'text-slate-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-md px-6 py-4 rounded-2xl shadow-sm bg-white text-slate-800 border-2 border-slate-200">
              <div className="flex items-center gap-3">
                <Bot size={18} className="text-emerald-600 animate-pulse" />
                <span className="text-sm font-medium text-slate-600">L'assistant réfléchit...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="bg-white p-6 border-t-2 border-slate-200">
        <div className="flex items-center gap-3">
          <input
            type="text"
            className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
            placeholder="Votre message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !isLoading) {
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />
          <button
            className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/20"
            onClick={handleSendMessage}
            disabled={isLoading || input.trim() === ''}
          >
            <Send size={22} />
          </button>
        </div>
      </footer>
    </div>
  );
}

