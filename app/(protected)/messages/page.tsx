'use client';

import React from 'react';
import { Send, Phone, Info, User } from 'lucide-react';

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
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden shadow-shamar-soft flex flex-col md:flex-row h-[calc(100vh-200px)] min-h-[400px] animate-in slide-in-from-bottom-4 duration-500">
          {/* List (Sidebar Mobile / Left Desktop) */}
          <div className="w-full md:w-80 border-r border-gray-200 flex flex-col bg-gray-0">
            <div className="p-shamar-24 border-b border-gray-200">
              <h2 className="text-shamar-h3 font-semibold text-gray-900">Discussions</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-shamar-16 space-y-2">
              {['Sodex Pro', 'Electro Plus', 'Zena Shop'].map((name, i) => (
                <div
                  key={i}
                  className={`p-shamar-16 rounded-shamar-md cursor-pointer transition-all border ${
                    i === 0 ? 'bg-primary-50 border-primary-200' : 'border-transparent hover:bg-gray-50 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-semibold text-shamar-small">
                      {name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <h4 className="font-semibold text-gray-900 text-shamar-body truncate">{name}</h4>
                        <span className="text-shamar-caption text-gray-400">09:46</span>
                      </div>
                      <p className="text-shamar-small text-gray-500 truncate">Merci, quel est le délai estimé...</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-gray-50">
            <div className="p-shamar-16 bg-gray-0 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-shamar-body">
                  S
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-shamar-body">Sodex Pro Sourcing</h3>
                  <p className="text-shamar-caption text-primary-600 font-medium uppercase tracking-wider">En ligne</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-shamar-md transition-colors" aria-label="Appeler">
                  <Phone size={18} />
                </button>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-shamar-md transition-colors" aria-label="Infos">
                  <Info size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-shamar-24 space-y-4">
              {MOCK_MESSAGES.map((m) => (
                <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] p-shamar-16 rounded-shamar-lg text-shamar-body ${
                      m.isMe
                        ? 'bg-primary-600 text-gray-0 rounded-tr-none'
                        : 'bg-gray-0 text-gray-900 border border-gray-200 rounded-tl-none shadow-shamar-soft'
                    }`}
                  >
                    <p>{m.text}</p>
                    <p className={`text-shamar-caption mt-1 ${m.isMe ? 'text-primary-100' : 'text-gray-400'}`}>
                      {m.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-shamar-16 bg-gray-0 border-t border-gray-200">
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-shamar-md border border-gray-200">
                <input
                  type="text"
                  placeholder="Écrire votre message..."
                  className="flex-1 bg-transparent border-none outline-none text-shamar-body px-shamar-12 text-gray-900 placeholder-gray-400 focus:ring-0"
                />
                <button className="bg-primary-600 text-gray-0 p-2.5 rounded-shamar-md hover:bg-primary-700 transition-colors shadow-shamar-soft">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
