'use client';

import React from 'react';
import Link from 'next/link';
import { Wheat, Pickaxe, MapPin, TrendingUp, ArrowRight } from 'lucide-react';

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
    <div className="min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-shamar-16">
            <div>
              <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
                <span className="text-primary-600">Matières Premières</span>
              </h1>
              <p className="text-shamar-body text-gray-500 font-medium">Flux directs entre producteurs et industriels.</p>
            </div>
            <div className="flex gap-shamar-12">
              <Link
                href="/rfq"
                className="bg-primary-600 text-gray-0 px-shamar-24 py-3 rounded-shamar-md font-semibold flex items-center gap-2 hover:bg-primary-700 transition-colors text-shamar-body"
              >
                Assistant de Négociation <ArrowRight size={18} />
              </Link>
              <Link
                href="/dashboard/onboarding-vendeur"
                className="bg-gray-900 text-gray-0 px-shamar-24 py-3 rounded-shamar-md font-semibold flex items-center gap-2 hover:bg-gray-800 transition-colors text-shamar-body"
              >
                Devenir Fournisseur <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-shamar-24">
            {categories.map((cat, idx) => (
              <div key={idx} className="bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden shadow-shamar-soft">
                <div className="p-shamar-24 border-b border-gray-200 flex items-center gap-3 bg-gray-50">
                  <div className="p-2 bg-primary-100 text-primary-600 rounded-shamar-md">{cat.icon}</div>
                  <h2 className="text-shamar-h3 font-semibold text-gray-900">{cat.title}</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {cat.items.map((item: { name: string; region: string; capacity?: string; resource?: string }, i: number) => (
                    <div key={i} className="p-shamar-24 hover:bg-gray-50 transition-colors flex items-center justify-between group cursor-pointer">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors text-shamar-body">{item.name}</h3>
                        <div className="flex items-center gap-shamar-16 text-shamar-small text-gray-500 font-medium">
                          <span className="flex items-center gap-1"><MapPin size={12} /> {item.region}</span>
                          <span className="flex items-center gap-1"><TrendingUp size={12} /> {item.capacity || item.resource}</span>
                        </div>
                      </div>
                      <div className="p-2 bg-gray-100 rounded-shamar-md text-gray-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-primary-600 rounded-shamar-md p-shamar-32 flex flex-col md:flex-row items-center gap-shamar-24 shadow-shamar-medium">
            <div className="flex-1 space-y-2">
              <h3 className="text-shamar-h2 font-bold text-gray-0 italic">SHAMAR Commodity Index</h3>
              <p className="text-primary-100 text-shamar-body font-medium">Suivez les cours du Cacao, du Café et des métaux en temps réel.</p>
            </div>
            <Link
              href="/international"
              className="bg-gray-0 text-primary-600 px-shamar-24 py-3 rounded-shamar-md font-bold hover:bg-gray-100 transition-colors text-shamar-body"
            >
              Voir les cours
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
