import { createClient } from '@/lib/supabase/server';
import ProductFilters from '@/components/marketplace/ProductFilters';

export const dynamic = 'force-dynamic';

const COUNTRIES: { code: string; label: string }[] = [
  { code: '', label: 'Tous les pays' },
  { code: 'CI', label: "Côte d'Ivoire" },
  { code: 'SN', label: 'Sénégal' },
  { code: 'CM', label: 'Cameroun' },
  { code: 'GA', label: 'Gabon' },
  { code: 'CG', label: 'Congo' },
  { code: 'NG', label: 'Nigeria' },
  { code: 'KE', label: 'Kenya' },
  { code: 'TZ', label: 'Tanzanie' },
  { code: 'CN', label: 'Chine' },
  { code: 'FR', label: 'France' },
  { code: 'BE', label: 'Belgique' },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string; city?: string; region?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;
  const country = params?.country?.trim() || '';
  const city = params?.city?.trim() || '';
  const region = params?.region?.trim() || '';

  let sellerIds: string[] | null = null;
  if (country || city || region) {
    const fromUsers: string[] = [];
    let q = (supabase as any).from('users').select('id');
    if (country) q = q.eq('country', country);
    if (city) q = q.eq('city', city);
    if (region) q = q.eq('region', region);
    const { data: users } = await q.limit(5000);
    if (Array.isArray(users)) users.forEach((u: any) => u.id && fromUsers.push(u.id));

    let sq = (supabase as any).from('shops').select('vendor_id');
    if (country) sq = sq.eq('country', country);
    if (city) sq = sq.eq('city', city);
    if (region) sq = sq.eq('region', region);
    const { data: shops } = await sq.limit(5000);
    const fromShops: string[] = [];
    if (Array.isArray(shops) && shops.length > 0) {
      const vIds = [...new Set(shops.map((s: any) => s.vendor_id).filter(Boolean))];
      const { data: vList } = await (supabase as any).from('vendors').select('user_id').in('id', vIds);
      if (Array.isArray(vList)) vList.forEach((v: any) => v.user_id && fromShops.push(v.user_id));
    }
    sellerIds = [...new Set([...fromUsers, ...fromShops])];
  }

  let productsList: any[] = [];
  if (sellerIds !== null && sellerIds.length === 0) {
    productsList = [];
  } else {
    let productsQuery = (supabase as any)
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(50);
    if (sellerIds && sellerIds.length > 0) productsQuery = productsQuery.in('seller_id', sellerIds);
    const { data } = await productsQuery;
    productsList = data || [];
  }
  const products = productsList;

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-shamar-16">
          <div>
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
              Catalogue <span className="text-primary-600">Produits</span>
            </h1>
            <p className="text-shamar-body text-gray-500 font-medium">
              Découvrez tous nos produits disponibles
            </p>
          </div>
        </div>

        <ProductFilters country={country} city={city} region={region} countries={COUNTRIES} />

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-shamar-24">
            {products.map((product: any) => (
              <a
                key={product.id}
                href={`/products/${product.id}`}
                className="group bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden hover:shadow-shamar-medium hover:border-primary-600/30 transition-all flex flex-col h-full shadow-shamar-soft"
              >
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-shamar-h1 text-gray-400">{product.name?.[0]?.toUpperCase() || 'P'}</span>
                  )}
                </div>
                <div className="p-shamar-24 flex-1 flex flex-col">
                  <h3 className="text-shamar-h3 text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-500 text-shamar-small mb-shamar-16 line-clamp-2 leading-relaxed flex-1">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mt-auto pt-shamar-16 border-t border-gray-200">
                    <span className="text-primary-600 font-semibold text-shamar-body">
                      {product.price} {product.currency || 'FCFA'}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-shamar-48 bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft">
            <p className="text-gray-500 font-medium text-shamar-body">Aucun produit disponible pour le moment</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
