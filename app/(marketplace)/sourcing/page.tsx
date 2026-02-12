'use client';

import React from 'react';
import Link from 'next/link';
import {
  Search,
  FileText,
  MessageSquare,
  FileSignature,
  Truck,
  CreditCard,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

/**
 * Hub Sourcing — centre de commande (vision validée).
 * Pipeline : Trouver → Comparer → Négocier → Contracter → Payer → Livrer → Sécuriser.
 */
const modules = [
  { id: 'search', label: 'Recherche fournisseurs', icon: Search, href: '/sourcing/search', desc: 'Trouver entreprises, usines, grossistes' },
  { id: 'rfq', label: 'Demande devis (RFQ)', icon: FileText, href: '/sourcing/rfq', desc: 'Créer et suivre vos demandes de devis' },
  { id: 'negotiations', label: 'Négociations', icon: MessageSquare, href: '/sourcing/rfq', desc: 'Chat business et contre-offres' },
  { id: 'contracts', label: 'Contrats', icon: FileSignature, href: '/sourcing/contracts', desc: 'Contrats et signatures' },
  { id: 'logistics', label: 'Logistique', icon: Truck, href: '/sourcing/logistics', desc: 'Transport, tracking, livraison' },
  { id: 'payments', label: 'Paiements', icon: CreditCard, href: '/sourcing/payments', desc: 'Escrow et libération des fonds' },
  { id: 'verified', label: 'Fournisseurs validés', icon: ShieldCheck, href: '/sourcing/verified', desc: 'Partenaires officiels Shamar' },
  { id: 'ai', label: 'IA assistant', icon: Sparkles, href: '/sourcing/search', desc: 'Aide recherche, négociation, traduction' },
];

export default function SourcingHubPage() {
  return (
    <div className="min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-40">
        <header>
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight">
            Sourcing — Hub central
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl text-shamar-body">
            Pipeline complet import/export : Trouver → Comparer → Négocier → Contracter → Payer → Livrer → Sécuriser.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-shamar-24">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.id}
                href={m.href}
                className="group flex flex-col p-shamar-24 rounded-shamar-md border border-gray-200 bg-gray-0 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-shamar-md bg-primary-100 text-primary-600 flex items-center justify-center mb-shamar-16 group-hover:bg-primary-200 transition-colors">
                  <Icon size={24} />
                </div>
                <h2 className="text-shamar-body font-semibold text-gray-900">{m.label}</h2>
                <p className="mt-1 text-shamar-small text-gray-600 flex-1">{m.desc}</p>
                <span className="mt-shamar-16 inline-flex items-center gap-1 text-shamar-small font-medium text-primary-600">
                  Accéder <ArrowRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="pt-shamar-24 border-t border-gray-200">
          <p className="text-shamar-small text-gray-600 font-medium">
            Commandes : <Link href="/sourcing/orders" className="text-primary-600 font-semibold hover:underline">Voir mes commandes sourcing</Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
