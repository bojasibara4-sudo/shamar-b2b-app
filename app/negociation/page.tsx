'use client';

import React from 'react';
import Link from 'next/link';
import { Factory, Wheat, Pickaxe, MapPin, Users, TrendingUp, ArrowRight } from 'lucide-react';

export default function NegociationPage() {
  const categories = [
    { 
      title: 'Coopératives Agricoles', 
      icon: <Wheat size={24} />, 
      items: [
        { name: 'Coopérative Cacao Ivoire', region: 'San Pedro, CI', capacity: '1000 T/Mois' },
        { name: 'Agri-Benin Anacarde', region: 'Parakou, BJ', capacity: '500 T/Mois' }
      ]
    },
    { 
      title: 'Compagnies Minières', 
      icon: <Pickaxe size={24} />, 
      items: [
        { name: 'Sodemi Mines Pro', region: 'Man, CI', resource: 'Or & Nickel' },
        { name: 'Bauxite Trading Togo', region: 'Kara, TG', resource: 'Bauxite' }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Matières Premières</h1>
            <p className="text-slate-500">Flux directs entre producteurs et industriels.</p>
          </div>
          <div className="flex gap-2">
            <Link 
              href="/negociation/perplexity-assistant"
              className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all"
            >
              Assistant de Négociation <ArrowRight size={18} />
            </Link>
            <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
              Devenir Fournisseur <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                <div className="p-2 bg-amber-600 text-white rounded-lg">{cat.icon}</div>
                <h2 className="text-xl font-black text-slate-900">{cat.title}</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {cat.items.map((item: any, i) => (
                  <div key={i} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer">
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{item.name}</h3>
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {item.region}</span>
                        <span className="flex items-center gap-1"><TrendingUp size={12} /> {item.capacity || item.resource}</span>
                      </div>
                    </div>
                    <button className="p-2 bg-slate-100 rounded-xl text-slate-400 group-hover:bg-amber-600 group-hover:text-white transition-all">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-amber-600 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-amber-600/20">
          <div className="flex-1 space-y-2">
            <h3 className="text-2xl font-black italic">SHAMAR Commodity Index</h3>
            <p className="text-amber-100">Suivez les cours du Cacao, du Café et des métaux en temps réel.</p>
          </div>
          <button className="bg-white text-amber-600 px-8 py-4 rounded-2xl font-black hover:bg-amber-50 transition-all">
            Voir les cours
          </button>
        </div>
      </div>
    </div>
  );
}
