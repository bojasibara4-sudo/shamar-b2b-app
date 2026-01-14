'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  ShoppingBag, 
  Globe, 
  Palmtree, 
  Factory, 
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function SourcingPage() {
  const segments = [
    { id: 'b2b', label: 'Business B2B', icon: <Briefcase size={32} />, color: 'bg-indigo-600', desc: 'Vente en gros et solutions entreprises', href: '/b2b' },
    { id: 'b2c', label: 'Marketplace B2C', icon: <ShoppingBag size={32} />, color: 'bg-emerald-600', desc: 'Produits pour particuliers', href: '/b2b' },
    { id: 'international', label: 'Business International', icon: <Globe size={32} />, color: 'bg-blue-600', desc: 'Import-Export & Sourcing global', href: '/international' },
    { id: 'airbnb', label: 'Airbnb & Tourisme', icon: <Palmtree size={32} />, color: 'bg-rose-500', desc: 'Hôtels, résidences et zones touristiques', href: '/airbnb' },
    { id: 'matiere-premiere', label: 'Matières Premières', icon: <Factory size={32} />, color: 'bg-amber-600', desc: 'Agricole & Mines : Coopératives et Entreprises', href: '/negociation' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-12 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
              Bienvenue dans l'écosystème <span className="text-emerald-600">SHAMAR</span>.
            </h1>
            <p className="text-lg text-slate-500 mt-2 font-medium">
              Une plateforme unifiée pour le commerce, les services et l'industrie.
            </p>
          </div>
        </div>

        {/* External AI Studio Banner */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-black uppercase tracking-widest text-emerald-400">
                <Sparkles size={14} /> Intelligence Artificielle
              </div>
              <h2 className="text-4xl font-black leading-tight">Propulsez votre catalogue avec Google AI</h2>
              <p className="text-slate-400 text-lg">
                Utilisez Google AI Studio pour générer des descriptions et des visuels produits de haute qualité en quelques secondes.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <a 
                  href="https://aistudio.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-emerald-50 transition-all active:scale-95"
                >
                  Ouvrir Google AI Studio <ExternalLink size={18} />
                </a>
                <p className="text-xs text-slate-500 italic max-w-[200px] text-center sm:text-left">
                  Génération traitée exclusivement sur la plateforme de Google.
                </p>
              </div>
            </div>
            <div className="hidden lg:block w-72 h-72 bg-gradient-to-br from-emerald-500 to-indigo-600 rounded-3xl rotate-12 opacity-80 blur-2xl absolute -right-12 top-0"></div>
            <div className="relative w-64 h-64 flex items-center justify-center bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl animate-pulse">
              <Sparkles size={80} className="text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {segments.map((s) => (
            <Link
              key={s.id}
              href={s.href}
              className="group bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all text-left flex flex-col h-full"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 ${s.color} shadow-xl transition-transform group-hover:scale-110`}>
                {s.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                {s.label}
              </h3>
              <p className="text-slate-500 text-sm mb-6 flex-1">
                {s.desc}
              </p>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm group-hover:gap-3 transition-all">
                Explorer <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
