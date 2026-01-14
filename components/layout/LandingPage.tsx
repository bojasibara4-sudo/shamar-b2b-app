'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, ShieldCheck, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-emerald-500">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-600 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-indigo-600 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col min-h-screen">
        <header className="flex justify-between items-center mb-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-white text-xl">S</div>
            <span className="text-2xl font-black tracking-tighter">SHAMAR</span>
          </div>
          <Link href="/auth/login" className="hidden sm:block text-emerald-400 font-bold hover:text-emerald-300 transition-colors">
            Se connecter
          </Link>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Plateforme Marketplace B2B & B2C
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tighter">
              Le commerce pro, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">sans frontières.</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-xl mx-auto lg:mx-0">
              Achetez et vendez en toute sécurité. Solutions de sourcing international, logistique intégrée et paiement garanti.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                href="/auth/register"
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-600/20 transition-all active:scale-95 text-center"
              >
                Créer un compte
              </Link>
              <Link 
                href="/auth/login"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl font-bold text-lg transition-all active:scale-95 text-center"
              >
                Accéder au portail
              </Link>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                <Globe className="text-emerald-400 mb-4" size={32} />
                <h3 className="font-bold text-lg">Sourcing</h3>
                <p className="text-sm text-slate-400 mt-1">Accédez aux fournisseurs mondiaux.</p>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                <ShieldCheck className="text-blue-400 mb-4" size={32} />
                <h3 className="font-bold text-lg">Sécurisé</h3>
                <p className="text-sm text-slate-400 mt-1">Paiements par tiers de confiance.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-6 bg-emerald-600/20 border border-emerald-500/20 rounded-3xl backdrop-blur-md">
                <Zap className="text-emerald-400 mb-4" size={32} />
                <h3 className="font-bold text-lg">Vitesse</h3>
                <p className="text-sm text-slate-400 mt-1">Transactions rapides et fluides.</p>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                <div className="flex -space-x-3 mb-4">
                  {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs font-bold">U{i}</div>)}
                </div>
                <h3 className="font-bold text-lg">+5,000 Pros</h3>
                <p className="text-sm text-slate-400 mt-1">Déjà actifs sur SHAMAR.</p>
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-20 py-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© 2024 SHAMAR Marketplace. Tous droits réservés.</p>
          <div className="flex gap-6 font-bold">
            <a href="#" className="hover:text-emerald-400">Conditions</a>
            <a href="#" className="hover:text-emerald-400">Confidentialité</a>
            <a href="#" className="hover:text-emerald-400">Support</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

