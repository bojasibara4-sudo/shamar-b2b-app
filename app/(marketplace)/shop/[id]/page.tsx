import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ShopTabsClient from '@/components/marketplace/ShopTabsClient';
import { ReportButton } from '@/components/security/ReportButton';
import { Star } from 'lucide-react';
import { getVendorBadges } from '@/services/badge.service';
import { getVendorAverageRating } from '@/services/review.service';

export const dynamic = 'force-dynamic';

export default async function ShopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: shop, error } = await (supabase as any)
    .from('shops')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !shop) {
    notFound();
  }

  const vendorId = shop.vendor_id;
  const { data: vendor } = vendorId
    ? await (supabase as any).from('vendors').select('user_id').eq('id', vendorId).single()
    : { data: null };
  const sellerId = vendor?.user_id;

  const { data: products } = sellerId
    ? await (supabase as any)
        .from('products')
        .select('id, name, price, currency, image_url')
        .or(`seller_id.eq.${sellerId},shop_id.eq.${id}`)
        .limit(50)
    : { data: [] };

  const { data: reviews } = sellerId
    ? await (supabase as any)
        .from('reviews')
        .select('id, rating, comment, created_at')
        .eq('vendor_id', sellerId)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(20)
    : { data: [] };

  const badges = vendorId ? await getVendorBadges(vendorId) : [];
  const avgRating = sellerId ? await getVendorAverageRating(sellerId) : 0;

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <Link href="/shop" className="text-shamar-small font-medium text-gray-500 hover:text-primary-600">
          ← Retour aux boutiques
        </Link>
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft overflow-hidden">
          {shop.banner_url ? (
            <div className="h-32 bg-gray-200">
              <img src={shop.banner_url} alt="" className="w-full h-full object-cover" />
            </div>
          ) : null}
          <div className="p-shamar-32">
            <div className="flex items-center gap-shamar-16 mb-shamar-16">
              {shop.logo_url ? (
                <img src={shop.logo_url} alt="" className="w-20 h-20 rounded-shamar-md object-cover border border-gray-200" />
              ) : (
                <div className="w-20 h-20 rounded-shamar-md bg-primary-600 flex items-center justify-center text-white text-shamar-h1">
                  {shop.name?.[0]?.toUpperCase() || 'S'}
                </div>
              )}
              <div>
                <h1 className="text-shamar-h1 text-gray-900 tracking-tight">{shop.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  {(shop.is_verified || shop.status === 'verified') && (
                    <span className="px-3 py-1 bg-primary-100 text-primary-600 text-shamar-caption font-medium rounded-shamar-sm">Vérifié</span>
                  )}
                  {badges.length > 0 && (
                    <span className="text-gray-500 text-shamar-small font-medium">{badges[0]?.badge?.label}</span>
                  )}
                  {avgRating > 0 && (
                    <span className="flex items-center gap-1 text-gray-600 text-shamar-small">
                      <Star className="text-amber-500 fill-current" size={16} />
                      {avgRating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {shop.description && (
              <p className="text-gray-600 font-medium leading-relaxed mb-shamar-24 text-shamar-body">{shop.description}</p>
            )}
            {sellerId && (
              <div className="mb-4">
                <ReportButton reportType="vendor" targetId={sellerId} />
              </div>
            )}

            <ShopTabsClient
              products={products || []}
              reviews={reviews || []}
              about={shop.description}
              certifications={[]}
            />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
