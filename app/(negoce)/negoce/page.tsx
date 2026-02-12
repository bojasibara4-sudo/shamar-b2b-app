'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Package } from 'lucide-react';
import type { NegoceOffer } from '@/lib/negoce-offers';
import { getNegoceOffers } from '@/lib/negoce-offers';

const BADGE_STYLES: Record<string, string> = {
  bronze: 'bg-amber-500/20 text-gray-800',
  silver: 'bg-gray-200 text-gray-700',
  gold: 'bg-warning-500/20 text-gray-800',
  diamond: 'bg-primary-500/20 text-primary-700',
};

export default function NegoceCatalogPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [offers, setOffers] = useState<NegoceOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('product', query);
    if (type) params.set('type', type);
    setLoading(true);
    fetch(`/api/negoce/offers?${params}`)
      .then((res) => res.json())
      .then((data) => setOffers(data.offers ?? []))
      .catch(() => setOffers(getNegoceOffers({ product: query || undefined, type: type || undefined })))
      .finally(() => setLoading(false));
  }, [query, type]);

  return (
    <div className="space-y-shamar-32">
      <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
        <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">Négoce Matières Premières</h1>
        <p className="text-shamar-body text-gray-500 mb-shamar-24">Marketplace B2B Premium • Gros volumes • Escrow obligatoire</p>
        <div className="flex gap-shamar-16">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Produit, fournisseur..."
              className="w-full pl-12 pr-4 py-3 rounded-shamar-md border border-gray-200 bg-gray-0 text-gray-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-4 py-3 rounded-shamar-md border border-gray-200 bg-gray-0 text-gray-900"
          >
            <option value="">Type</option>
            <option value="minerai">Minerai</option>
            <option value="cacao">Cacao</option>
            <option value="bois">Bois</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-shamar-48 text-gray-500 text-shamar-body">Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-shamar-24">
          {offers.map((o) => (
            <Link
              key={o.id}
              href={`/negoce/${o.id}`}
              className="block bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden hover:shadow-shamar-medium hover:border-primary-600/30 transition-all shadow-shamar-soft"
            >
              <div className="h-32 bg-primary-500/10 flex items-center justify-center">
                <span className="text-shamar-h1 text-primary-600 font-bold">{o.supplier_name[0]}</span>
              </div>
              <div className="p-shamar-24">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={12} className="text-gray-400" />
                  <span className="text-shamar-small text-gray-500">{o.country}</span>
                  <span className={`ml-auto px-2 py-0.5 rounded-shamar-sm text-shamar-caption font-semibold ${BADGE_STYLES[o.badge] || 'bg-gray-100 text-gray-700'}`}>{o.badge}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{o.product}</h3>
                <p className="text-shamar-small text-gray-500 mb-shamar-12">{o.supplier_name}</p>
                <p className="text-primary-600 font-semibold">{o.price_indicator} {o.currency}/{o.moq_unit}</p>
                <div className="mt-shamar-16 pt-shamar-16 border-t border-gray-200">
                  <span className="inline-flex px-shamar-16 py-2 bg-primary-600 text-gray-0 text-shamar-small font-semibold rounded-shamar-md">Voir détail</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && offers.length === 0 && (
        <div className="text-center py-shamar-48 bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-shamar-16" />
          <p className="text-gray-500 font-medium">Aucune offre trouvée</p>
        </div>
      )}
    </div>
  );
}
