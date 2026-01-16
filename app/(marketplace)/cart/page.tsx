'use client';

import React from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export default function PanierPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <h1 className="text-3xl font-black text-slate-900">Votre Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4">
              <div className="w-20 h-20 bg-slate-100 rounded-2xl flex-shrink-0">
                 <img src="https://picsum.photos/seed/cart1/80/80" className="w-full h-full object-cover rounded-2xl" alt="Product" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">Ciment CPJ-45 (Lot de 50)</h3>
                <p className="text-xs text-slate-500">Vendeur: BTP Store</p>
                <p className="text-emerald-600 font-black mt-1">225,000 FCFA</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <button className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-lg">
                  <button className="p-1 hover:bg-white rounded transition-colors"><Minus size={14} /></button>
                  <span className="font-bold text-sm">2</span>
                  <button className="p-1 hover:bg-white rounded transition-colors"><Plus size={14} /></button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-black text-xl text-slate-900">Récapitulatif</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-slate-500">
                  <span>Sous-total</span>
                  <span>450,000 FCFA</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Livraison</span>
                  <span className="text-emerald-600 font-bold">Gratuit</span>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between text-xl font-black text-slate-900">
                  <span>Total</span>
                  <span>450,000 FCFA</span>
                </div>
              </div>
              <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20">
                Passer la commande <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
