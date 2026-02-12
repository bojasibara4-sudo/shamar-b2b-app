'use client';

import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { useState } from 'react';

/**
 * /sourcing/search — Recherche fournisseurs (entreprises, usines, grossistes).
 */
export default function SourcingSearchPage() {
  const [query, setQuery] = useState('');

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <Link href="/sourcing" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 text-shamar-small mb-shamar-24">
        <ArrowLeft size={16} /> Retour au hub Sourcing
      </Link>
      <h1 className="text-shamar-h2 text-gray-900">Recherche fournisseurs</h1>
      <p className="mt-1 text-shamar-body text-gray-500">Trouver entreprises, usines, grossistes. Filtres : pays, ville, catégorie, MOQ, prix, badge, vérifié, délai, score qualité.</p>

      <div className="mt-shamar-32 space-y-shamar-16">
        <div className="flex gap-shamar-12">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="search"
              placeholder="Nom, catégorie, produit…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-shamar-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 text-gray-900"
            />
          </div>
          <button type="button" className="px-shamar-24 py-3 bg-primary-600 text-white font-medium rounded-shamar-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
            Rechercher
          </button>
        </div>
        <p className="text-shamar-small text-gray-500">Filtres avancés (pays, ville, MOQ, badge, délai) à connecter au backend fournisseurs.</p>
      </div>

      <div className="mt-shamar-40 p-shamar-24 rounded-shamar-md border border-gray-200 bg-gray-0 shadow-shamar-soft">
        <p className="text-gray-600 text-shamar-body font-medium">Résultats : liste de cartes fournisseur (logo, nom, pays, badge, rating, spécialité, contacter, demander devis).</p>
        <Link href="/sourcing/rfq/new" className="mt-shamar-16 inline-flex items-center text-primary-600 font-semibold hover:underline text-shamar-body">Créer une demande de devis →</Link>
      </div>
      </div>
    </div>
  );
}
