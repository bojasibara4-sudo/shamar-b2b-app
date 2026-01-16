'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ChevronRight, MessageSquare } from 'lucide-react';

export default function DisputesPage() {
  // Mock data - À remplacer par des données réelles depuis Supabase
  const disputes: any[] = [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Centre de Litiges</h1>
            <p className="text-slate-500 text-sm">Gérez et résolvez les problèmes liés à vos commandes.</p>
          </div>
          <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all text-sm">
            Aide & FAQ
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {disputes.length > 0 ? (
            disputes.map((dispute: any) => (
              <div 
                key={dispute.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 flex-shrink-0">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-400">ID: {dispute.id}</span>
                        <span className="text-xs text-slate-400">• Commande #{dispute.orderId}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">{dispute.reason}</h3>
                      <p className="text-sm text-slate-500 line-clamp-1">{dispute.buyerMessage}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                          {dispute.status || 'Ouvert'}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <MessageSquare size={14} /> 2 messages
                        </span>
                        <span className="text-xs text-slate-400">Ouvert le {dispute.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <button className="text-orange-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Détails <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-4">
              <AlertTriangle size={48} strokeWidth={1} />
              <p>Vous n'avez aucun litige en cours.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
