'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

export default function BuyerSearchPage() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const doSearch = useCallback(async () => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products/search?tags=${encodeURIComponent(query.trim())}&limit=20`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const t = setTimeout(doSearch, 300);
    return () => clearTimeout(t);
  }, [doSearch]);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-shamar-16">
            <div>
              <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
                <span className="text-primary-600">Recherche</span>
              </h1>
              <p className="text-shamar-body text-gray-500 font-medium">
                Recherchez des produits et fournisseurs
              </p>
            </div>
          </div>
          <div className="mt-shamar-24 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-600" size={22} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nom du produit, catégorie, mot-clé..."
              className="w-full pl-12 pr-5 py-shamar-16 bg-gray-50 border border-gray-200 rounded-shamar-md text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder-gray-400"
            />
          </div>
        </div>

        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-32">
          {loading ? (
            <div className="text-center py-shamar-48 text-gray-500 font-medium text-shamar-body">Recherche en cours...</div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-shamar-24">
              {products.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="block bg-gray-50 rounded-shamar-md border border-gray-200 overflow-hidden hover:shadow-shamar-soft hover:border-gray-300 transition-all"
                >
                  <div className="h-36 bg-gray-100 flex items-center justify-center">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-semibold text-gray-500">{p.name?.[0]?.toUpperCase() || 'P'}</span>
                    )}
                  </div>
                  <div className="p-shamar-16">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 text-shamar-body">{p.name}</h3>
                    <p className="text-primary-600 font-semibold mt-2 text-shamar-body">{p.price?.toLocaleString()} {p.currency || 'FCFA'}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-shamar-48">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-shamar-24">
                <Search className="h-10 w-10 text-primary-600" />
              </div>
              <p className="text-gray-500 font-medium text-shamar-body">
                {query.trim() ? 'Aucun résultat trouvé.' : 'Commencez à taper pour rechercher.'}
              </p>
              <div className="mt-shamar-32 flex flex-wrap justify-center gap-2">
                {['Fruits', 'Légumes', 'Céréales', 'Semences', 'Cacao', 'Café'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-shamar-16 py-2 bg-gray-100 hover:bg-primary-50 text-gray-600 hover:text-primary-700 rounded-shamar-md text-shamar-small font-semibold transition-colors border border-gray-200 hover:border-primary-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 mt-shamar-32 text-primary-600 font-semibold hover:underline"
              >
                Voir tout le catalogue →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
