'use client';

import React from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export default function PanierPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="text-emerald-600" size={32} />
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              Votre <span className="text-emerald-600">Panier</span>
            </h1>
          </div>
          <p className="text-lg text-slate-500 font-medium">
            Révisez vos articles avant de passer commande
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all flex items-center gap-4">
              <div className="w-24 h-24 bg-slate-100 rounded-2xl flex-shrink-0 overflow-hidden">
                <img src="https://picsum.photos/seed/cart1/96/96" className="w-full h-full object-cover" alt="Product" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-lg text-slate-900">Ciment CPJ-45 (Lot de 50)</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Vendeur: BTP Store</p>
                <p className="text-emerald-600 font-black text-xl mt-2">225,000 FCFA</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <button className="text-slate-300 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 rounded-xl">
                  <Trash2 size={20} />
                </button>
                <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-xl">
                  <button className="p-1.5 hover:bg-white rounded-lg transition-all">
                    <Minus size={16} className="text-slate-600" />
                  </button>
                  <span className="font-black text-base text-slate-900 min-w-[2rem] text-center">2</span>
                  <button className="p-1.5 hover:bg-white rounded-lg transition-all">
                    <Plus size={16} className="text-slate-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 space-y-6">
              <h3 className="text-2xl font-black text-slate-900">Récapitulatif</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Sous-total</span>
                  <span>450,000 FCFA</span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Livraison</span>
                  <span className="text-emerald-600 font-black">Gratuit</span>
                </div>
                <div className="pt-4 border-t-2 border-slate-200 flex justify-between text-2xl font-black text-slate-900">
                  <span>Total</span>
                  <span>450,000 FCFA</span>
                </div>
              </div>
              <button className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20">
                Passer la commande <ArrowRight size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
