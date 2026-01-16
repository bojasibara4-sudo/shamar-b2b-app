'use client';

import React from 'react';
import { Palmtree, MapPin, Star, Calendar, Users, Coffee, Waves } from 'lucide-react';

export default function AirbnbPage() {
  const listings = [
    { id: 1, title: 'Villa Emeraude - Assinie', price: '250.000', rating: 4.9, img: 'https://picsum.photos/seed/resort1/600/400', location: 'Assinie Mafia, CI' },
    { id: 2, title: 'Hôtel des Ambassadeurs', price: '85.000', rating: 4.7, img: 'https://picsum.photos/seed/hotel1/600/400', location: 'Plateau, Abidjan' },
    { id: 3, title: 'Résidence Touristique Kribi', price: '120.000', rating: 4.8, img: 'https://picsum.photos/seed/kribi1/600/400', location: 'Kribi, CM' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Tourisme & Airbnb</h1>
            <p className="text-slate-500">Séjours professionnels et zones touristiques d'exception.</p>
          </div>
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200">
            <button className="px-6 py-2 bg-rose-500 text-white rounded-xl font-bold text-sm">Hébergements</button>
            <button className="px-6 py-2 text-slate-500 font-bold text-sm">Expériences</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((item) => (
            <div key={item.id} className="group bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer">
              <div className="relative h-56">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-xs font-black">
                  <Star size={14} className="fill-rose-500 text-rose-500" /> {item.rating}
                </div>
                <button className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all">
                  <Palmtree size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-1 text-xs text-rose-500 font-bold mb-2">
                  <MapPin size={12} /> {item.location}
                </div>
                <h3 className="text-xl font-black text-slate-900 group-hover:text-rose-500 transition-colors">{item.title}</h3>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-4 text-slate-400">
                     <Coffee size={18} />
                     <Waves size={18} />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold">À partir de</p>
                    <p className="text-xl font-black text-slate-900">{item.price} <span className="text-xs">FCFA/Nuit</span></p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
