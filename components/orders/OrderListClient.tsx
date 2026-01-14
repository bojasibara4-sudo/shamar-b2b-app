'use client';

import React, { useState } from 'react';
import { Search, ChevronRight, Download, Package } from 'lucide-react';
import Link from 'next/link';
import { STATUS_CONFIG, type OrderStatus } from './orderStatusConfig';

interface Order {
  id: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  status: OrderStatus;
  date: string;
  sellerName?: string;
  buyerName?: string;
}

interface OrderListClientProps {
  orders: Order[];
  basePath?: string; // Chemin de base pour les liens (ex: '/dashboard/buyer/orders' ou '/dashboard/admin/orders')
}

export default function OrderListClient({ orders, basePath = '/dashboard/admin/orders' }: OrderListClientProps) {
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.productName.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search);
    const matchesFilter = filter === 'all' || o.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Historique des commandes</h1>
        <button className="flex items-center justify-center gap-2 text-slate-600 hover:bg-white bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
          <Download size={18} />
          Exporter CSV
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par ID ou produit..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {(['all', 'pending', 'confirmed', 'shipped', 'completed', 'cancelled'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filter === s 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'all' ? 'Tous' : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Link
              key={order.id}
              href={`${basePath}/${order.id}`}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                    <Package size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">#{order.id}</span>
                      <span className="text-xs text-slate-400">• {order.date}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{order.productName}</h3>
                    <p className="text-sm text-slate-500">{order.quantity} unités • {order.sellerName || order.buyerName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">{order.totalAmount.toLocaleString()} FCFA</p>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_CONFIG[order.status].color}`}>
                      {STATUS_CONFIG[order.status].icon}
                      {STATUS_CONFIG[order.status].label}
                    </span>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center text-gray-400 space-y-4">
              <Package size={48} strokeWidth={1.5} />
              <div className="text-center">
                <p className="font-medium text-gray-900 mb-1">Aucune commande</p>
                <p className="text-sm">
                  {orders.length === 0 
                    ? 'Vous n\'avez pas encore de commandes.' 
                    : 'Aucune commande ne correspond à vos critères de recherche.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

