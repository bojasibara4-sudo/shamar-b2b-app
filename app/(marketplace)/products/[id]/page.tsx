import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddToCartButton } from '@/components/AddToCartButton';
import { ReportButton } from '@/components/security/ReportButton';
import { getVendorByUserId } from '@/services/vendor.service';
import { getVendorBadges } from '@/services/badge.service';
import { getVendorAverageRating } from '@/services/review.service';
import { Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await (supabase as any)
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    notFound();
  }

  const sellerId = product.seller_id;
  const vendor = sellerId ? await getVendorByUserId(sellerId) : null;
  const badges = vendor ? await getVendorBadges(vendor.id) : [];
  const vendorRating = sellerId ? await getVendorAverageRating(sellerId) : 0;
  const shopId = product.shop_id;
  let shop: any = null;
  if (shopId) {
    const { data } = await (supabase as any).from('shops').select('id, name').eq('id', shopId).single();
    shop = data;
  }

  const specs = product.specifications && typeof product.specifications === 'object'
    ? product.specifications
    : {};
  const specEntries = Object.entries(specs).filter(([, v]) => v != null && v !== '');
  const moq = product.min_order_quantity ?? product.moq ?? 1;
  const priceTiers = Array.isArray(product.price_tiers) ? product.price_tiers : [];

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <Link
          href="/products"
          className="text-shamar-small font-medium text-gray-500 hover:text-primary-600"
        >
          ← Retour au catalogue
        </Link>
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden shadow-shamar-soft">
          <div className="h-64 bg-gray-100 flex items-center justify-center">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-shamar-h1 text-gray-400">
                {product.name?.[0]?.toUpperCase() || 'P'}
              </span>
            )}
          </div>
          <div className="p-shamar-32">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {badges.length > 0 && (
                <span className="px-3 py-1 rounded-shamar-sm bg-primary-100 text-primary-600 text-shamar-caption font-medium">
                  {badges[0]?.badge?.label || 'Vendeur'}
                </span>
              )}
              {vendorRating > 0 && (
                <span className="flex items-center gap-1 text-gray-600 text-shamar-small">
                  <Star className="text-amber-500 fill-current" size={16} />
                  {vendorRating.toFixed(1)}
                </span>
              )}
            </div>
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-shamar-16">
              {product.name}
            </h1>
            <p className="text-gray-600 font-medium leading-relaxed mb-shamar-16 text-shamar-body">
              {product.description || 'Aucune description.'}
            </p>
            {moq > 1 && (
              <p className="text-gray-500 text-shamar-small mb-2">
                Quantité minimum : <strong>{moq}</strong> {product.stock_unit || 'unité(s)'}
              </p>
            )}
            {specEntries.length > 0 && (
              <dl className="mb-shamar-16 text-shamar-small">
                {specEntries.map(([k, v]) => (
                  <div key={k} className="flex gap-2 py-1">
                    <dt className="font-medium text-gray-500">{k}</dt>
                    <dd className="text-gray-700">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            )}
            {priceTiers.length > 0 && (
              <div className="mb-shamar-16 p-shamar-16 bg-gray-50 rounded-shamar-md">
                <p className="text-shamar-small font-semibold text-gray-700 mb-2">Paliers B2B</p>
                <ul className="space-y-1 text-shamar-small text-gray-600">
                  {priceTiers.map((t: any, i: number) => (
                    <li key={i}>
                      À partir de {t.min_quantity ?? 0} : {Number(t.price ?? 0).toLocaleString()} {product.currency || 'FCFA'}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-shamar-12 pt-shamar-16 border-t border-gray-200">
              <span className="text-shamar-h2 font-semibold text-primary-600">
                {Number(product.price || 0).toLocaleString()} {product.currency || 'FCFA'}
              </span>
              <AddToCartButton productId={product.id} />
              <Link
                href={`/products/${id}/reviews`}
                className="px-shamar-16 py-2 rounded-shamar-md border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 text-shamar-small"
              >
                Voir les avis
              </Link>
              <Link
                href={`/dashboard/buyer/offers?product=${id}`}
                className="px-shamar-16 py-2 rounded-shamar-md bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 text-shamar-small"
              >
                Négocier (B2B)
              </Link>
              <Link
                href={`/rfq/new?product_id=${id}`}
                className="px-shamar-16 py-2 rounded-shamar-md bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 text-shamar-small"
              >
                Demander un devis (RFQ)
              </Link>
              {shop?.id && (
                <Link
                  href={`/shop/${shop.id}`}
                  className="text-shamar-small font-medium text-primary-600 hover:underline"
                >
                  Voir la boutique
                </Link>
              )}
              <ReportButton reportType="product" targetId={product.id} className="ml-auto" />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
