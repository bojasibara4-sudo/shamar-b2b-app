'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useCallback, useState } from 'react';

type Category = { slug: string; label: string };

export default function MarketplaceHomeClient({
  categories,
}: {
  categories: Category[];
  initialProducts?: any[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      } else {
        router.push('/search');
      }
    },
    [query, router]
  );

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-vert/20 focus:border-brand-vert"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-brand-vert text-white font-bold hover:opacity-90 transition-opacity"
        >
          Rechercher
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-slate-500 font-medium text-sm">Catégories :</span>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 font-medium hover:bg-brand-vert hover:text-white transition-colors"
          >
            {cat.label}
          </Link>
        ))}
      </div>

      <div className="flex gap-2">
        <Link
          href="/b2b"
          className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-brand-bleu-ardoise hover:text-white transition-colors"
        >
          B2B
        </Link>
        <Link
          href="/b2c"
          className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-brand-bleu-ardoise hover:text-white transition-colors"
        >
          B2C
        </Link>
      </div>
    </div>
  );
}
