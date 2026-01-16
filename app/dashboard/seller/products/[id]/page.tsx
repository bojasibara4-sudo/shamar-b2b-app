import { requireSeller } from '@/lib/auth-guard';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ProductFormClient from '@/components/ProductFormClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const user = await requireSeller();
  const supabase = await createClient();

  // Récupérer le produit
  const { data: product, error } = await (supabase as any)
    .from('products')
    .select('*')
    .eq('id', params.id)
    .eq('seller_id', user.id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/dashboard/seller/products"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Retour aux produits
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Modifier le produit</h1>
        <ProductFormClient
          productId={product.id}
          initialData={{
            name: product.name,
            description: product.description || '',
            price: Number(product.price || 0),
          }}
        />
      </div>
    </div>
  );
}
