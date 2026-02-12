import { requireSeller } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { createClient } from '@/lib/supabase/server';
import ProductFormClient from '@/components/ProductFormClient';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SellerProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireSeller();
  const supabase = await createClient();

  const { data: product, error } = await (supabase as any)
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('seller_id', user.id)
    .single();

  if (error || !product) {
    notFound();
  }

  const initialData = {
    name: product.name || '',
    description: product.description || '',
    price: Number(product.price || 0),
    category: product.category || 'other',
    min_order_quantity: product.min_order_quantity ?? 1,
    specifications: product.specifications && typeof product.specifications === 'object' ? product.specifications as Record<string, unknown> : undefined,
    price_tiers: Array.isArray(product.price_tiers) ? product.price_tiers as { min_quantity: number; price: number }[] : undefined,
  };

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-shamar-16">
              <div className="flex items-center gap-shamar-16">
                <div className="p-3 bg-primary-100 rounded-shamar-md">
                  <Package className="text-primary-600" size={28} />
                </div>
                <div>
                  <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-1">
                    Modifier le <span className="text-primary-600">produit</span>
                  </h1>
                  <p className="text-shamar-body text-gray-500 font-medium">
                    {product.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-shamar-16">
                <Link
                  href="/dashboard/seller/products"
                  className="inline-flex items-center gap-2 text-shamar-body font-medium text-gray-500 hover:text-primary-600 transition-colors"
                >
                  <ArrowLeft size={20} /> Retour aux produits
                </Link>
                <LogoutButton />
              </div>
            </div>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-24 md:p-shamar-32">
            <ProductFormClient
              productId={id}
              initialData={initialData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
