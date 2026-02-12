import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

const CATEGORIES = [
  { slug: 'electronique', label: 'Électronique' },
  { slug: 'textile', label: 'Textile' },
  { slug: 'machines', label: 'Machines & équipements' },
  { slug: 'mobilier', label: 'Mobilier' },
  { slug: 'emballage', label: 'Emballage' },
  { slug: 'autre', label: 'Autres' },
];

export default async function ChinaCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const { cat, q } = await searchParams;
  const supabase = await createClient();

  let query = (supabase as any)
    .from('products')
    .select('id, name, description, price, currency, category, image_url')
    .eq('status', 'active');

  const terms = ['chine', 'china', 'chinois'];
  if (cat) {
    query = query.eq('category', cat);
  }
  if (q && q.trim()) {
    query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
  }
  const { data: products } = await query.order('created_at', { ascending: false }).limit(48);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32">
          <div>
            <Link href="/china" className="text-shamar-small text-gray-500 hover:text-primary-600 font-medium mb-shamar-16 inline-block">
              ← Retour Sourcing Chine
            </Link>
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Catégories produits Chine</h1>
            <p className="text-shamar-body text-gray-500 mt-1">Électronique, textile, machines, mobilier, emballage et plus.</p>
          </div>

          {/* Filtres */}
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
            <h2 className="text-shamar-body font-semibold text-gray-900 mb-shamar-16">Filtres</h2>
            <div className="flex flex-wrap gap-shamar-12">
              <Link
                href="/china/categories"
                className={`px-shamar-16 py-2 rounded-shamar-md text-shamar-small font-medium ${!cat ? 'bg-primary-600 text-gray-0' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Toutes
              </Link>
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/china/categories?cat=${c.slug}`}
                  className={`px-shamar-16 py-2 rounded-shamar-md text-shamar-small font-medium ${cat === c.slug ? 'bg-primary-600 text-gray-0' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {c.label}
                </Link>
              ))}
            </div>
            <form className="mt-shamar-16 flex gap-2" action="/china/categories" method="get">
              {cat && <input type="hidden" name="cat" value={cat} />}
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Recherche..."
                className="flex-1 px-shamar-16 py-2 border border-gray-200 rounded-shamar-md text-shamar-body text-gray-900"
              />
              <button type="submit" className="px-shamar-24 py-2 bg-primary-600 text-gray-0 font-medium rounded-shamar-md hover:bg-primary-700">
                Rechercher
              </button>
            </form>
          </div>

          {/* Grille produits */}
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-shamar-24">
              {products.map((p: any) => (
                <div key={p.id} className="bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden shadow-shamar-soft hover:border-primary-600/30 transition-all flex flex-col">
                  <Link href={`/products/${p.id}`} className="flex flex-col flex-1">
                    <div className="h-40 bg-gray-100 flex items-center justify-center">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="text-gray-400" size={48} />
                      )}
                    </div>
                    <div className="p-shamar-16 flex-1 flex flex-col">
                      <h3 className="font-semibold text-gray-900 text-shamar-body line-clamp-2">{p.name}</h3>
                      <p className="text-shamar-small text-gray-500 mt-1 line-clamp-2 flex-1">{p.description}</p>
                      <p className="text-primary-600 font-semibold text-shamar-body mt-shamar-16">
                        {Number(p.price || 0).toLocaleString()} {p.currency || 'FCFA'}
                      </p>
                    </div>
                  </Link>
                  <div className="px-shamar-16 pb-shamar-16">
                    <Link
                      href={`/china/rfq/create?product_id=${p.id}`}
                      className="block w-full text-center py-2 text-shamar-small font-semibold text-primary-600 border border-primary-600 rounded-shamar-md hover:bg-primary-50"
                    >
                      Demander un devis
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-48 text-center shadow-shamar-soft">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-shamar-16" />
              <p className="text-gray-500 font-medium">Aucun produit dans cette catégorie.</p>
              <Link href="/china/categories" className="inline-block mt-shamar-16 text-primary-600 font-semibold hover:underline">
                Voir toutes les catégories
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
