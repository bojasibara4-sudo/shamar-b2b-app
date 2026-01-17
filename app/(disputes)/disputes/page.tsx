'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ChevronRight, MessageSquare } from 'lucide-react';

export default function DisputesPage() {
  // Mock data - À remplacer par des données réelles depuis Supabase
  const disputes: any[] = [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                Centre de <span className="text-orange-600">Litiges</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium">Gérez et résolvez les problèmes liés à vos commandes</p>
            </div>
            <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black hover:bg-slate-800 transition-all shadow-md">
              Aide & FAQ
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {disputes.length > 0 ? (
            disputes.map((dispute: any) => (
              <div 
                key={dispute.id}
                className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-200 hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 flex-shrink-0">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-slate-400 font-medium">ID: {dispute.id}</span>
                        <span className="text-xs text-slate-400 font-medium">• Commande #{dispute.orderId}</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">{dispute.reason}</h3>
                      <p className="text-sm text-slate-500 line-clamp-1 font-medium">{dispute.buyerMessage}</p>
                      <div className="flex items-center gap-4 mt-4">
                        <span className="px-3 py-1.5 rounded-full text-xs font-black bg-orange-100 text-orange-700">
                          {dispute.status || 'Ouvert'}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                          <MessageSquare size={14} /> 2 messages
                        </span>
                        <span className="text-xs text-slate-400 font-medium">Ouvert le {dispute.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <button className="text-orange-600 font-black text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Détails <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-4 bg-white rounded-[2rem] border border-slate-200">
              <AlertTriangle size={48} strokeWidth={1} />
              <p className="font-medium">Vous n'avez aucun litige en cours.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
