'use client';

import React from 'react';
import Link from 'next/link';
import { Palmtree, MapPin, Star, Coffee, Waves } from 'lucide-react';

export default function AirbnbPage() {
  const listings = [
    { id: 1, title: 'Villa Emeraude - Assinie', price: '250.000', rating: 4.9, img: 'https://picsum.photos/seed/resort1/600/400', location: 'Assinie Mafia, CI' },
    { id: 2, title: 'Hôtel des Ambassadeurs', price: '85.000', rating: 4.7, img: 'https://picsum.photos/seed/hotel1/600/400', location: 'Plateau, Abidjan' },
    { id: 3, title: 'Résidence Touristique Kribi', price: '120.000', rating: 4.8, img: 'https://picsum.photos/seed/kribi1/600/400', location: 'Kribi, CM' },
  ];

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-shamar-16">
            <div>
              <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Tourisme & Hébergements</h1>
              <p className="text-shamar-body text-gray-500 font-medium mt-1">Séjours professionnels et zones touristiques d&apos;exception.</p>
            </div>
            <div className="flex bg-gray-0 p-1 rounded-shamar-md border border-gray-200">
              <button className="px-shamar-24 py-2 bg-primary-600 text-gray-0 rounded-shamar-md font-semibold text-shamar-small">Hébergements</button>
              <button className="px-shamar-24 py-2 text-gray-500 font-semibold text-shamar-small">Expériences</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-shamar-24">
            {listings.map((item) => (
              <Link
                key={item.id}
                href={`/host/${item.id}`}
                className="group bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all block"
              >
                <div className="relative h-56">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-gray-0/90 backdrop-blur-md px-3 py-1 rounded-shamar-md flex items-center gap-1 text-shamar-caption font-semibold text-gray-900">
                    <Star size={14} className="fill-primary-500 text-primary-500" /> {item.rating}
                  </div>
                  <div className="absolute top-4 right-4 p-2 bg-gray-0/20 hover:bg-gray-0/40 backdrop-blur-md rounded-shamar-md text-gray-0 transition-colors">
                    <Palmtree size={20} />
                  </div>
                </div>
                <div className="p-shamar-24">
                  <div className="flex items-center gap-1 text-shamar-caption text-primary-600 font-semibold mb-2">
                    <MapPin size={12} /> {item.location}
                  </div>
                  <h3 className="text-shamar-h4 font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{item.title}</h3>
                  <div className="mt-shamar-16 flex items-center justify-between border-t border-gray-200 pt-shamar-16">
                    <div className="flex items-center gap-shamar-16 text-gray-400">
                      <Coffee size={18} />
                      <Waves size={18} />
                    </div>
                    <div className="text-right">
                      <p className="text-shamar-caption text-gray-500 font-medium">À partir de</p>
                      <p className="text-shamar-body font-bold text-gray-900">{item.price} <span className="text-shamar-small text-gray-500">FCFA/Nuit</span></p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
