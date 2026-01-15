import { redirect } from 'next/navigation';
import { requireSeller } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import ProductFormClient from '@/components/ProductFormClient';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireSeller();

  const supabase = await createSupabaseServerClient();
  
  if (!supabase) {
    redirect('/dashboard/seller/products');
  }

  // Charger le produit depuis Supabase
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !product) {
    redirect('/dashboard/seller/products');
  }

  // Vérifier que le produit appartient au seller connecté
  if (product.seller_id !== user.id) {
    redirect('/dashboard/seller/products');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Modifier le produit
            </h1>
            <p className="mt-2 text-gray-600">{product.name}</p>
          </div>
          <LogoutButton />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <ProductFormClient
          initialData={{
            name: product.name,
            description: product.description || '',
            price: Number(product.price),
          }}
          productId={params.id}
        />
      </div>
    </div>
  );
}

