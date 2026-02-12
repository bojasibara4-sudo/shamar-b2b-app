'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Target, Search, Mail, ChevronRight } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  product: string;
  status: 'nouveau' | 'contacté' | 'devis_envoyé' | 'converti';
  date: string;
}

export default function SellerLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/seller/leads')
      .then((res) => res.ok ? res.json() : { leads: [] })
      .then((data) => setLeads(data.leads || []))
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, []);

  const statusColors: Record<string, string> = {
    nouveau: 'bg-success-500/20 text-gray-800',
    contacté: 'bg-primary-100 text-primary-700',
    devis_envoyé: 'bg-warning-500/20 text-amber-700',
    converti: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-shamar-16">
              <div className="flex items-center gap-shamar-16">
                <div className="p-3 bg-primary-100 rounded-shamar-md">
                  <Target className="text-primary-600" size={28} />
                </div>
                <div>
                  <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-1">
                    <span className="text-primary-600">Leads</span>
                  </h1>
                  <p className="text-shamar-body text-gray-500 font-medium">
                    Gérez vos leads et opportunités commerciales
                  </p>
                </div>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-primary-600 text-gray-0 px-shamar-24 py-3 rounded-shamar-md font-semibold hover:bg-primary-700 transition-colors text-shamar-body"
              >
                <Search size={20} />
                Voir mes produits
              </Link>
            </div>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft overflow-hidden">
            <h2 className="p-shamar-24 border-b border-gray-200 text-shamar-h3 font-semibold text-gray-900">Vos opportunités</h2>
            {loading ? (
              <div className="text-center py-shamar-48 text-gray-500 font-medium text-shamar-body">Chargement...</div>
            ) : leads.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-shamar-24 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-shamar-16"
                  >
                    <div className="flex items-start gap-shamar-16">
                      <div className="w-12 h-12 bg-primary-100 rounded-shamar-md flex items-center justify-center flex-shrink-0">
                        <Target className="text-primary-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-shamar-body">{lead.name}</h3>
                        <p className="text-shamar-small text-gray-500 font-medium">{lead.company}</p>
                        <p className="text-shamar-caption text-gray-400 mt-1 flex items-center gap-1">
                          <Mail size={12} /> {lead.email}
                        </p>
                        <p className="text-shamar-small text-primary-600 font-medium mt-1">Intéressé par : {lead.product}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-shamar-16 flex-wrap">
                      <span className={`px-3 py-1 rounded-shamar-sm text-shamar-small font-semibold ${statusColors[lead.status] || 'bg-gray-100 text-gray-600'}`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                      <span className="text-shamar-caption text-gray-400 font-medium">{lead.date}</span>
                      <Link
                        href="/messages"
                        className="flex items-center gap-1 text-primary-600 font-semibold text-shamar-small hover:underline"
                      >
                        Contacter <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-shamar-48">
                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-shamar-24">
                  <Target className="h-10 w-10 text-primary-600" />
                </div>
                <p className="text-gray-500 font-medium text-shamar-body">Aucun lead pour le moment.</p>
                <p className="text-gray-400 text-shamar-small mt-2">Les demandes de devis et contacts clients apparaîtront ici.</p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 mt-shamar-24 text-primary-600 font-semibold hover:underline text-shamar-body"
                >
                  Promouvoir mes produits →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
