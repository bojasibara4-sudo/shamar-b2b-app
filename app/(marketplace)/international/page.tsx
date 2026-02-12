'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Package } from 'lucide-react';
import type { InternationalOffer } from '@/lib/international-offers';
import { getInternationalOffers } from '@/lib/international-offers';

const BADGE_STYLES: Record<string, string> = {
  gold: 'bg-warning-500/20 text-gray-800 border-warning-500/30',
  verified: 'bg-success-500/20 text-gray-800 border-success-500/30',
  '': 'bg-gray-500/20 text-gray-500',
};

export default function InternationalPage() {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('');
  const [incoterm, setIncoterm] = useState('');
  const [minMoq, setMinMoq] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [maxLeadTime, setMaxLeadTime] = useState('');
  const [certification, setCertification] = useState('');
  const [offers, setOffers] = useState<InternationalOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('product', query);
    if (country) params.set('country', country);
    if (incoterm) params.set('incoterm', incoterm);
    if (minMoq) params.set('minMoq', minMoq);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (maxLeadTime) params.set('maxLeadTime', maxLeadTime);
    if (certification) params.set('certification', certification);

    setLoading(true);
    fetch(`/api/international/offers?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setOffers(data.offers ?? []);
      })
      .catch(() => {
        setOffers(getInternationalOffers({
          product: query || undefined,
          country: country || undefined,
          incoterm: incoterm || undefined,
          minMoq: minMoq ? Number(minMoq) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          maxLeadTime: maxLeadTime ? Number(maxLeadTime) : undefined,
          certification: certification || undefined,
        }));
      })
      .finally(() => setLoading(false));
  }, [query, country, incoterm, minMoq, maxPrice, maxLeadTime, certification]);

  return (
    <div className="min-h-full">
    <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-shamar-16 mb-shamar-24">
            <div>
              <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
                Commerce <span className="text-primary-600">International</span>
              </h1>
              <p className="text-shamar-body text-gray-500 font-medium">
                Import-Export B2B • Afrique ↔ Monde • Contrats • Escrow • Logistique
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/importer" className="px-shamar-16 py-2 text-shamar-small font-semibold text-primary-600 border border-primary-600 rounded-shamar-md hover:bg-primary-50">
                Espace Importateur
              </Link>
              <Link href="/dashboard/exporter" className="px-shamar-16 py-2 text-shamar-small font-semibold text-primary-600 border border-primary-600 rounded-shamar-md hover:bg-primary-50">
                Espace Exportateur
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-shamar-16">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Produit, catégorie, fournisseur..."
                className="w-full pl-12 pr-4 py-3 rounded-shamar-md border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-600"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="px-shamar-16 py-3 rounded-shamar-md border border-gray-200 bg-gray-0 text-shamar-small"
              >
                <option value="">Tous pays</option>
                <option value="Sénégal">Sénégal</option>
                <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
              </select>
              <select
                value={incoterm}
                onChange={(e) => setIncoterm(e.target.value)}
                className="px-shamar-16 py-3 rounded-shamar-md border border-gray-200 bg-gray-0 text-shamar-small"
              >
                <option value="">Incoterm (FOB/CIF/EXW)</option>
                <option value="FOB">FOB</option>
                <option value="CIF">CIF</option>
                <option value="EXW">EXW</option>
              </select>
              <input
                type="number"
                value={minMoq}
                onChange={(e) => setMinMoq(e.target.value)}
                placeholder="MOQ min"
                className="px-shamar-16 py-3 rounded-shamar-md border border-gray-200 bg-gray-0 w-28 text-shamar-small"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Prix max (USD)"
                className="px-shamar-16 py-3 rounded-shamar-md border border-gray-200 bg-gray-0 w-32 text-shamar-small"
              />
              <input
                type="number"
                value={maxLeadTime}
                onChange={(e) => setMaxLeadTime(e.target.value)}
                placeholder="Délai max (j)"
                className="px-shamar-16 py-3 rounded-shamar-md border border-gray-200 bg-gray-0 w-28 text-shamar-small"
              />
              <select
                value={certification}
                onChange={(e) => setCertification(e.target.value)}
                className="px-shamar-16 py-3 rounded-shamar-md border border-gray-200 bg-gray-0 text-shamar-small"
              >
                <option value="">Certification</option>
                <option value="ISO">ISO</option>
                <option value="HACCP">HACCP</option>
                <option value="UTZ">UTZ</option>
                <option value="CE">CE</option>
                <option value="Rainforest">Rainforest</option>
                <option value="Better Cotton">Better Cotton</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-shamar-48 text-gray-500 text-shamar-body">Chargement...</div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-shamar-24">
          {offers.map((o) => (
            <Link
              key={o.id}
              href={`/international/${o.id}`}
              className="group bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden hover:shadow-shamar-medium hover:border-primary-600/30 transition-all block shadow-shamar-soft"
            >
              <div className="h-32 bg-gray-100 flex items-center justify-center">
                <span className="text-shamar-h1 text-gray-400">
                  {o.supplier_name[0]}
                </span>
              </div>
              <div className="p-shamar-24">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={14} className="text-gray-400" />
                  <span className="text-shamar-small text-gray-500">{o.country}</span>
                  {o.badge && (
                    <span
                      className={`ml-auto px-2 py-0.5 rounded text-[10px] font-bold border ${BADGE_STYLES[o.badge]}`}
                    >
                      {o.badge === 'gold' ? 'Gold' : 'Verified'}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-shamar-body">{o.product}</h3>
                <p className="text-shamar-caption text-gray-500 mb-3">{o.supplier_name}</p>
                <div className="flex justify-between text-shamar-small">
                  <span className="text-gray-600">
                    MOQ {o.moq.toLocaleString()} {o.moq_unit}
                  </span>
                  <span className="font-semibold text-primary-600">
                    {o.price_bulk} {o.currency}/{o.moq_unit}
                  </span>
                </div>
                <p className="text-shamar-caption text-gray-400 mt-1">{o.incoterm} • {o.lead_time_days} j</p>
                <div className="mt-shamar-16 pt-shamar-16 border-t border-gray-200">
                  <span className="inline-flex items-center gap-1 px-shamar-16 py-2 bg-primary-600 text-gray-0 text-shamar-small font-semibold rounded-shamar-md group-hover:bg-primary-700">
                    Voir offre
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        )}

        {!loading && offers.length === 0 && (
          <div className="text-center py-shamar-48 bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-shamar-16" />
            <p className="text-gray-500 font-medium text-shamar-body">Aucune offre trouvée</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
