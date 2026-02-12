'use client';

import Link from 'next/link';

interface ProductFiltersProps {
  country: string;
  city: string;
  region: string;
  countries: { code: string; label: string }[];
}

export default function ProductFilters({ country, city, region, countries }: ProductFiltersProps) {
  return (
    <form method="get" action="/products" className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-end gap-4">
      <div>
        <label htmlFor="filter-country" className="block text-xs font-medium text-slate-500 mb-1">Pays</label>
        <select
          id="filter-country"
          name="country"
          defaultValue={country}
          onChange={(e) => e.target.form?.requestSubmit()}
          className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium min-w-[180px]"
        >
          {countries.map((c) => (
            <option key={c.code || 'all'} value={c.code}>{c.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="filter-city" className="block text-xs font-medium text-slate-500 mb-1">Ville</label>
        <input
          id="filter-city"
          name="city"
          type="text"
          placeholder="Ex. Abidjan, Douala"
          defaultValue={city}
          className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium min-w-[160px]"
        />
      </div>
      <div>
        <label htmlFor="filter-region" className="block text-xs font-medium text-slate-500 mb-1">Région</label>
        <input
          id="filter-region"
          name="region"
          type="text"
          placeholder="Ex. Afrique de l'Ouest"
          defaultValue={region}
          className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium min-w-[160px]"
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700">
        Filtrer
      </button>
      {(country || city || region) && (
        <Link href="/products" className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 hover:underline">
          Réinitialiser
        </Link>
      )}
    </form>
  );
}
