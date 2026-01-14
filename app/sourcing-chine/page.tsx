'use client';

import React from 'react';
import { Factory, MapPin, TrendingUp, ArrowRight } from 'lucide-react';

export default function SourcingChinePage() {
  const suppliers = [
    { id: '1', name: 'Shanghai Industrial Export', location: 'Shanghai, Chine', category: 'Électronique', rating: 4.9 },
    { id: '2', name: 'Guangzhou Manufacturing Hub', location: 'Guangzhou, Chine', category: 'Textile', rating: 4.8 },
    { id: '3', name: 'Shenzhen Tech Solutions', location: 'Shenzhen, Chine', category: 'High-Tech', rating: 4.9 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Sourcing en Chine</h1>
            <p className="text-slate-500">Fournisseurs vérifiés et partenaires de confiance en Chine.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-600 text-white rounded-xl">
                    <Factory size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{supplier.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <MapPin size={12} /> {supplier.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">{supplier.category}</span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                    <TrendingUp size={12} /> {supplier.rating}
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 flex items-center justify-between">
                <span className="text-sm text-slate-600 font-medium">Partenariat vérifié</span>
                <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Contacter <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-600 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-blue-600/20">
          <div className="flex-1 space-y-2">
            <h3 className="text-2xl font-black">Partenariat Chine-Afrique</h3>
            <p className="text-blue-100">Accédez à notre réseau de fournisseurs chinois certifiés et bénéficiez de conditions préférentielles.</p>
          </div>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all">
            En savoir plus
          </button>
        </div>
      </div>
    </div>
  );
}
