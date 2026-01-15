import { requireBuyer } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import ProductsGrid from '@/components/products/ProductsGrid';

export const dynamic = 'force-dynamic';

export default async function BuyerProductsPage() {
  await requireBuyer();

  const supabase = createSupabaseServerClient();
  
  // Récupérer les produits actifs depuis Supabase
  let products: any[] = [];
  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        seller:users!products_seller_id_fkey(id, email, full_name, company_name)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (!error && data) {
      products = data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        currency: product.currency || 'FCFA',
        category: product.category,
        image_url: product.image_url,
        stock_quantity: product.stock_quantity || 0,
        min_order_quantity: product.min_order_quantity || 1,
        status: product.status,
        seller_id: product.seller_id,
        sellerEmail: product.seller?.email || product.seller?.company_name || 'Vendeur',
        sellerName: product.seller?.company_name || product.seller?.full_name || product.seller?.email || 'Vendeur',
      }));
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Catalogue Produits</h1>
            <p className="mt-2 text-gray-600">
              Parcourez et commandez les produits disponibles
            </p>
          </div>
          <LogoutButton />
        </div>
      </div>

      <ProductsGrid products={products} />
    </div>
  );
}

