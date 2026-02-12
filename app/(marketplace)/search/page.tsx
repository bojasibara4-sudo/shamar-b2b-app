'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

const CATEGORIES = [
  { slug: '', label: 'Toutes' },
  { slug: 'fruits', label: 'Fruits' },
  { slug: 'legumes', label: 'Légumes' },
  { slug: 'cereales', label: 'Céréales' },
  { slug: 'semences', label: 'Semences' },
  { slug: 'other', label: 'Autres' },
];
const SORT_OPTIONS = [
  { value: 'created_at', label: 'Récents' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'name', label: 'Nom A-Z' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('created_at');

  const doSearch = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (category) params.set('category', category);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      params.set('sort', sort);
      params.set('limit', '24');
      const res = await fetch(`/api/products/search?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [query, category, minPrice, maxPrice, sort]);

  useEffect(() => {
    const t = setTimeout(doSearch, 300);
    return () => clearTimeout(t);
  }, [doSearch]);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="flex gap-shamar-32 animate-in fade-in duration-500">
        <aside className="w-64 shrink-0 space-y-shamar-24">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-16 shadow-shamar-soft">
            <h3 className="font-semibold text-gray-900 mb-3 text-shamar-body">Catégorie</h3>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-shamar-md border border-gray-200 text-gray-700 font-medium text-shamar-small"
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug || 'all'} value={c.slug}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-16 shadow-shamar-soft">
            <h3 className="font-semibold text-gray-900 mb-3 text-shamar-body">Prix (FCFA)</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-shamar-md border border-gray-200 text-shamar-small"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-shamar-md border border-gray-200 text-shamar-small"
              />
            </div>
          </div>
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-16 shadow-shamar-soft">
            <h3 className="font-semibold text-gray-900 mb-3 text-shamar-body">Tri</h3>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-2 rounded-shamar-md border border-gray-200 text-gray-700 font-medium text-shamar-small"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </aside>

        <main className="flex-1 min-w-0 space-y-shamar-24">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
            <h1 className="text-shamar-h2 text-gray-900 tracking-tight mb-shamar-16">Recherche</h1>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-600" size={22} />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nom ou description..."
                className="w-full pl-12 pr-4 py-3 rounded-shamar-md border border-gray-200 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-24">
            {loading ? (
              <div className="text-center py-shamar-48 text-gray-400 text-shamar-body">Recherche...</div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-shamar-16">
                {products.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="block p-shamar-16 rounded-shamar-md border border-gray-200 hover:border-primary-600/30 hover:bg-gray-50 transition-colors"
                  >
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-32 object-cover rounded-shamar-md mb-3" />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 rounded-shamar-md flex items-center justify-center text-gray-400 text-shamar-h2 mb-3">
                        {p.name?.[0]?.toUpperCase() || 'P'}
                      </div>
                    )}
                    <h3 className="font-semibold text-gray-900 text-shamar-body">{p.name}</h3>
                    <p className="text-primary-600 font-semibold text-shamar-small">{Number(p.price || 0).toLocaleString()} {p.currency || 'FCFA'}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-shamar-48">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-shamar-16" />
                <p className="text-gray-500 font-medium text-shamar-body">Aucun résultat. Modifiez les filtres ou le terme de recherche.</p>
                <div className="mt-shamar-24 flex flex-wrap justify-center gap-2">
                  {CATEGORIES.filter((c) => c.slug).map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => setCategory(c.slug)}
                      className="px-shamar-16 py-2 rounded-shamar-md bg-gray-100 text-gray-600 font-medium hover:bg-primary-600 hover:text-gray-0 transition-colors text-shamar-small"
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      </div>
    </div>
  );
}
