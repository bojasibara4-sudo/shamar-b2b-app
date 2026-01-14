'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Star, MapPin, ChevronRight, Store } from 'lucide-react';

interface Shop {
  id: string;
  name: string;
  type: 'B2B' | 'B2C';
  rating: number;
  location: string;
  image: string;
}

const MOCK_SHOPS: Shop[] = [
  { id: '1', name: 'Africa Trade Corp', type: 'B2B', rating: 4.8, location: 'Abidjan, Côte d\'Ivoire', image: 'https://picsum.photos/seed/shop1/400/200' },
  { id: '2', name: 'Zena Cosmetics', type: 'B2C', rating: 4.5, location: 'Dakar, Sénégal', image: 'https://picsum.photos/seed/shop2/400/200' },
  { id: '3', name: 'Sodex Pro Sourcing', type: 'B2B', rating: 4.9, location: 'Cotonou, Bénin', image: 'https://picsum.photos/seed/shop3/400/200' },
  { id: '4', name: 'Electro Plus Afrique', type: 'B2C', rating: 4.2, location: 'Lomé, Togo', image: 'https://picsum.photos/seed/shop4/400/200' },
];

export default function B2BPage() {
  const [filter, setFilter] = useState<'ALL' | 'B2B' | 'B2C'>('ALL');

  const filteredShops = MOCK_SHOPS.filter(s => filter === 'ALL' || s.type === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-black text-slate-900">Explorer les boutiques B2B | B2C</h1>
          <div className="flex bg-white p-1 rounded-xl border border-slate-200">
            {(['ALL', 'B2B', 'B2C'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === f ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {f === 'ALL' ? 'Tout' : f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredShops.map((shop) => (
            <div 
              key={shop.id}
              className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="h-40 relative">
                <img src={shop.image} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div>
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white ${shop.type === 'B2B' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                      {shop.type}
                    </span>
                    <h3 className="text-white font-black text-xl mt-1">{shop.name}</h3>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-white text-xs font-bold">
                    <Star size={12} className="fill-amber-400 text-amber-400" /> {shop.rating}
                  </div>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <MapPin size={16} /> {shop.location}
                </div>
                <button className="text-emerald-600 font-bold text-sm flex items-center gap-1">
                  Visiter <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
