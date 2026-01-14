'use client';

import React from 'react';
import Link from 'next/link';
import { 
  User, 
  Package, 
  AlertTriangle, 
  Globe, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  ArrowRight,
  ChevronRight,
  TrendingUp,
  ExternalLink
} from 'lucide-react';

export default function ParametresPage() {
  const operationalItems = [
    { id: 'orders', label: 'Mes Commandes', icon: <Package size={20} />, color: 'text-blue-600', bg: 'bg-blue-50', href: '/dashboard/buyer/orders' },
    { id: 'disputes', label: 'Centre de Litiges', icon: <AlertTriangle size={20} />, color: 'text-rose-600', bg: 'bg-rose-50', href: '#' },
    { id: 'sourcing-global', label: 'Sourcing International (Pro)', icon: <Globe size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50', isSpecial: true, href: '/international' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-slate-900">Mon Espace SHAMAR</h1>
          <button className="flex items-center gap-2 text-rose-500 font-bold hover:bg-rose-50 px-4 py-2 rounded-xl transition-all">
            <LogOut size={18} /> Déconnexion
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 text-center shadow-sm">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-3xl bg-slate-100 overflow-hidden border-4 border-emerald-50 shadow-xl">
                  <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl border-4 border-white">
                  <ShieldCheck size={16} />
                </div>
              </div>
              <h2 className="text-xl font-black text-slate-900">John Doe</h2>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Acheteur Vérifié</p>
              <div className="mt-6 flex items-center justify-center gap-2">
                <div className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-lg">PRO MEMBER</div>
                <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg">LEVEL 4</div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-6 text-white overflow-hidden relative group">
              <div className="relative z-10 space-y-4">
                 <TrendingUp className="text-emerald-400" size={32} />
                 <h3 className="font-bold">Portefeuille Business</h3>
                 <p className="text-3xl font-black">1.250.000 <span className="text-sm">FCFA</span></p>
                 <button className="w-full bg-white text-slate-900 py-3 rounded-xl font-black text-sm hover:bg-emerald-50 transition-all flex items-center justify-center gap-2">
                   Approvisionner <ArrowRight size={16} />
                 </button>
              </div>
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl transition-transform group-hover:scale-150"></div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-50">
                <h3 className="font-black text-slate-900">Activité Opérationnelle</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {operationalItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-all group block"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className={`font-bold text-slate-900 ${item.isSpecial ? 'text-indigo-600' : ''}`}>{item.label}</p>
                        {item.isSpecial && <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Alibaba style sourcing</p>}
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Sourcing Section (Alibaba style callout) */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[2rem] p-8 text-white flex items-center justify-between shadow-xl shadow-indigo-600/20">
              <div className="flex-1 space-y-2">
                <h3 className="text-2xl font-black italic">Sourcing Pro International</h3>
                <p className="text-indigo-100">Accédez aux meilleurs fournisseurs mondiaux avec notre plateforme de sourcing professionnel.</p>
              </div>
              <Link 
                href="/international"
                className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black hover:bg-indigo-50 transition-all flex items-center gap-2"
              >
                Découvrir <ExternalLink size={18} />
              </Link>
            </div>

            {/* Settings Section */}
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-50">
                <h3 className="font-black text-slate-900">Paramètres</h3>
              </div>
              <div className="divide-y divide-slate-50">
                <button className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100 text-slate-600 group-hover:scale-110 transition-transform">
                      <Settings size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-900">Préférences</p>
                      <p className="text-xs text-slate-500">Langue, notifications, confidentialité</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                </button>
                <button className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100 text-slate-600 group-hover:scale-110 transition-transform">
                      <User size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-900">Profil</p>
                      <p className="text-xs text-slate-500">Informations personnelles et entreprise</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
