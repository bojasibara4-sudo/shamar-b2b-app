import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CheckCircle, MapPin, Package, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ChinaSupplierProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: shop } = await (supabase as any)
    .from('shops')
    .select('id, name, description, city, country, region, status, image_url, category, created_at')
    .eq('id', id)
    .maybeSingle();

  if (!shop) notFound();

  const { data: products } = await (supabase as any)
    .from('products')
    .select('id, name, price, currency, image_url')
    .eq('shop_id', id)
    .eq('status', 'active')
    .limit(12);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32">
          <Link href="/china/suppliers" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 font-medium mb-shamar-16">
            <ArrowLeft size={16} /> Annuaire fournisseurs
          </Link>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden shadow-shamar-soft">
            <div className="p-shamar-32 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-start gap-shamar-24">
                <div className="w-24 h-24 rounded-shamar-md bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {shop.image_url ? (
                    <img src={shop.image_url} alt={shop.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="text-gray-400" size={48} />
                  )}
                </div>
                <div>
                  <h1 className="text-shamar-h1 text-gray-900 tracking-tight">{shop.name}</h1>
                  {(shop.city || shop.country) && (
                    <p className="text-shamar-body text-gray-500 flex items-center gap-2 mt-1">
                      <MapPin size={18} /> {[shop.region, shop.city, shop.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                  {shop.status === 'verified' && (
                    <span className="inline-flex items-center gap-1 mt-shamar-12 text-shamar-small font-medium text-primary-600">
                      <CheckCircle size={16} /> Fournisseur vérifié
                    </span>
                  )}
                  <Link
                    href={`/china/rfq/create?supplier=${shop.id}`}
                    className="inline-flex items-center gap-2 mt-shamar-24 px-shamar-24 py-shamar-12 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700"
                  >
                    <FileText size={20} /> Demander un devis
                  </Link>
                </div>
              </div>
              {shop.description && (
                <p className="mt-shamar-24 text-shamar-body text-gray-600 leading-relaxed">{shop.description}</p>
              )}
            </div>

            {/* Infos entreprise (placeholder structure) */}
            <div className="p-shamar-32 border-b border-gray-200">
              <h2 className="text-shamar-h3 text-gray-900 mb-shamar-16">Informations entreprise</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-shamar-16 text-shamar-body text-gray-600">
                <div><span className="font-medium text-gray-900">Catégorie</span> : {shop.category || '—'}</div>
                <div><span className="font-medium text-gray-900">Pays</span> : {shop.country || '—'}</div>
                <div><span className="font-medium text-gray-900">Ville / Province</span> : {shop.city || shop.region || '—'}</div>
              </div>
              <p className="text-shamar-small text-gray-500 mt-shamar-16">Certificats, photos usine, MOQ et capacité production à renseigner par le fournisseur.</p>
            </div>

            {/* Catalogue */}
            {products && products.length > 0 && (
              <div className="p-shamar-32">
                <h2 className="text-shamar-h3 text-gray-900 mb-shamar-24">Catalogue</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-shamar-16">
                  {products.map((p: any) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.id}`}
                      className="block rounded-shamar-md border border-gray-200 overflow-hidden hover:border-primary-600/30 transition-colors"
                    >
                      <div className="h-28 bg-gray-100 flex items-center justify-center">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={24} className="text-gray-400" />
                        )}
                      </div>
                      <div className="p-shamar-12">
                        <p className="font-medium text-gray-900 text-shamar-small line-clamp-2">{p.name}</p>
                        <p className="text-primary-600 font-semibold text-shamar-caption">
                          {Number(p.price || 0).toLocaleString()} {p.currency || 'FCFA'}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
