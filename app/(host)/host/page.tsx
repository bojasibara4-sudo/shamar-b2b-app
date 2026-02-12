'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Star, SlidersHorizontal } from 'lucide-react';
import { getHostProperties } from '@/lib/host-properties';

const BADGE_COLORS: Record<string, string> = {
  bronze: 'bg-amber-800 text-amber-100',
  argent: 'bg-slate-400 text-slate-900',
  or: 'bg-amber-500 text-amber-950',
  diamant: 'bg-indigo-400 text-indigo-950',
};

export default function HostCatalogPage() {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'price' | 'rating' | 'recent'>('recent');

  const properties = getHostProperties({ city: query || undefined });
  const sorted = [...properties].sort((a, b) => {
    if (sort === 'price') return a.price_per_night - b.price_per_night;
    if (sort === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
            Locations & <span className="text-primary-600">Hébergements</span>
          </h1>
          <p className="text-shamar-body text-gray-500 font-medium mb-shamar-24">
            Trouvez le logement parfait pour votre séjour
          </p>
          <div className="flex flex-col md:flex-row gap-shamar-16">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Où allez-vous ? (ville, région...)"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-shamar-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-shamar-16 py-3 bg-gray-100 text-gray-600 rounded-shamar-md font-medium text-shamar-small flex items-center gap-2">
                <span>Dates</span>
              </button>
              <button className="px-shamar-16 py-3 bg-gray-100 text-gray-600 rounded-shamar-md font-medium text-shamar-small flex items-center gap-2">
                <span>Voyageurs</span>
              </button>
              <button className="px-shamar-24 py-3 bg-primary-600 text-white rounded-shamar-md font-semibold flex items-center gap-2 hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                <Search size={20} />
                Rechercher
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-shamar-16">
          <p className="text-gray-600 font-medium text-shamar-body">{sorted.length} logement(s) trouvé(s)</p>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-gray-500" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="px-shamar-16 py-2 border border-gray-200 rounded-shamar-md text-shamar-small font-medium bg-gray-0"
            >
              <option value="recent">Plus récents</option>
              <option value="price">Prix croissant</option>
              <option value="rating">Mieux notés</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-shamar-24">
          {sorted.map((p) => (
            <Link
              key={p.id}
              href={`/host/${p.id}`}
              className="group bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all"
            >
              <div className="relative h-56">
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-shamar-caption font-semibold">
                  <Star size={14} className="fill-amber-500 text-amber-500" /> {p.rating}
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-shamar-md text-[10px] font-bold uppercase ${BADGE_COLORS[p.host_badge] || 'bg-gray-600 text-white'}`}>
                    {p.host_badge}
                  </span>
                </div>
              </div>
              <div className="p-shamar-24">
                <p className="text-shamar-caption text-primary-600 font-semibold mb-1 flex items-center gap-1">
                  <MapPin size={12} /> {p.city}
                </p>
                <h3 className="text-shamar-h3 text-gray-900 group-hover:text-primary-600 transition-colors">{p.title}</h3>
                <div className="mt-shamar-16 flex justify-between items-end">
                  <span className="text-primary-600 font-semibold text-shamar-body">
                    {p.price_per_night.toLocaleString()} <span className="text-shamar-caption font-medium text-gray-500">FCFA/nuit</span>
                  </span>
                  <span className="text-shamar-small font-semibold text-primary-600 group-hover:underline">Voir détails</span>
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
