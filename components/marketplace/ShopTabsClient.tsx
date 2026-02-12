'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';

const TABS = ['Produits', 'Avis', 'À propos', 'Certifications'] as const;

export default function ShopTabsClient({
  products,
  reviews,
  about,
  certifications,
}: {
  products: any[];
  reviews: any[];
  about?: string | null;
  certifications: any[];
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Produits');

  return (
    <div>
      <div className="flex gap-2 border-b border-slate-200 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-t-xl font-bold text-sm transition-colors ${
              tab === t
                ? 'bg-brand-vert text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Produits' && (
        <div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p: any) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="block p-4 rounded-xl border border-slate-200 hover:border-brand-vert/30 hover:bg-slate-50/50"
                >
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-32 object-cover rounded-lg mb-2" />
                  ) : (
                    <div className="w-full h-32 bg-slate-200 rounded-lg flex items-center justify-center text-slate-500 font-black text-2xl mb-2">
                      {p.name?.[0]?.toUpperCase() || 'P'}
                    </div>
                  )}
                  <h3 className="font-bold text-slate-900">{p.name}</h3>
                  <p className="text-brand-vert font-black">{Number(p.price || 0).toLocaleString()} {p.currency || 'FCFA'}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 font-medium">Aucun produit pour le moment.</p>
          )}
        </div>
      )}

      {tab === 'Avis' && (
        <div>
          {reviews.length > 0 ? (
            <ul className="space-y-4">
              {reviews.map((r: any) => (
                <li key={r.id} className="py-3 border-b border-slate-100 last:border-0">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} size={14} className={n <= (r.rating || 0) ? 'text-brand-or fill-current' : 'text-slate-200'} />
                    ))}
                  </div>
                  {r.comment && <p className="text-slate-600 text-sm">{r.comment}</p>}
                  <p className="text-slate-400 text-xs mt-1">{new Date(r.created_at).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 font-medium">Aucun avis pour le moment.</p>
          )}
        </div>
      )}

      {tab === 'À propos' && (
        <div>
          {about ? <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">{about}</p> : <p className="text-slate-500">Aucune description.</p>}
        </div>
      )}

      {tab === 'Certifications' && (
        <div>
          {certifications.length > 0 ? (
            <ul className="space-y-2">
              {certifications.map((c: any, i: number) => (
                <li key={i} className="text-slate-600 font-medium">{typeof c === 'string' ? c : c?.label ?? c?.name ?? 'Certification'}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 font-medium">Aucune certification renseignée.</p>
          )}
        </div>
      )}
    </div>
  );
}
