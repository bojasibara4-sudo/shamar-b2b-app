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
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="mb-6">
          <Link
            href="/dashboard/seller/products"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Retour aux produits
          </Link>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
            Modifier le <span className="text-indigo-600">produit</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium mb-8">
            {product.name}
          </p>
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
    </div>
  );
}
