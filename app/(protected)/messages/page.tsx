'use client';

import React from 'react';
import { Send, Phone, Info, MoreHorizontal, User } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

const MOCK_MESSAGES: Message[] = [
  { id: '1', sender: 'Sodex Pro', text: 'Bonjour, votre commande est en cours de préparation.', time: '09:41', isMe: false },
  { id: '2', sender: 'Me', text: 'Merci, quel est le délai estimé pour Abidjan ?', time: '09:45', isMe: true },
  { id: '3', sender: 'Sodex Pro', text: 'Environ 48h par notre service SHAMAR Logistics.', time: '09:46', isMe: false },
];

export default function MessagesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row h-[calc(100vh-200px)] animate-in slide-in-from-bottom-4 duration-500">
        {/* List (Sidebar Mobile / Left Desktop) */}
        <div className="w-full md:w-80 border-r border-slate-100 flex flex-col">
          <div className="p-6 border-b border-slate-50">
            <h2 className="font-black text-xl text-slate-900">Discussions</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {['Sodex Pro', 'Electro Plus', 'Zena Shop'].map((name, i) => (
              <div key={i} className={`p-4 rounded-2xl cursor-pointer transition-all ${i === 0 ? 'bg-emerald-50 border border-emerald-100' : 'hover:bg-slate-50'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 font-bold">{name[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="font-bold text-slate-900 truncate">{name}</h4>
                      <span className="text-[10px] text-slate-400">09:46</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">Merci, quel est le délai estimé...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50/30">
          <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">S</div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Sodex Pro Sourcing</h3>
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">En ligne</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><Phone size={18} /></button>
              <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><Info size={18} /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {MOCK_MESSAGES.map((m) => (
              <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-3xl text-sm ${
                  m.isMe 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-900 border border-slate-100 rounded-tl-none shadow-sm'
                }`}>
                  <p>{m.text}</p>
                  <p className={`text-[10px] mt-1 ${m.isMe ? 'text-emerald-100' : 'text-slate-400'}`}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-2xl border border-slate-200">
              <input 
                type="text" 
                placeholder="Écrire votre message..." 
                className="flex-1 bg-transparent border-none outline-none text-sm px-2"
              />
              <button className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-md">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
