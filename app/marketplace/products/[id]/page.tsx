import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, DollarSign, ShoppingCart } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const user = await getCurrentUser();

  // Récupérer le produit avec les infos du vendeur
  const { data: product, error } = await (supabase as any)
    .from('products')
    .select(`
      *,
      seller:users!products_seller_id_fkey(id, email, full_name, company_name, phone),
      shop:shops(id, name, status)
    `)
    .eq('id', params.id)
    .eq('is_active', true)
    .single();

  if (error || !product) {
    notFound();
  }

  const price = Number(product.price || 0);
  const currency = product.currency || 'FCFA';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <Link
          href="/marketplace/products"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Retour au catalogue
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-auto rounded-[1.5rem]"
              />
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-slate-100 to-slate-200 rounded-[1.5rem] flex items-center justify-center">
                <Package className="h-24 w-24 text-slate-400" />
              </div>
            )}
          </div>

          {/* Détails */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-3">{product.name}</h1>
              <p className="text-3xl text-emerald-600 font-black mb-4">
                {price.toLocaleString()} {currency}
              </p>
              {product.category && (
                <span className="inline-block px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-black">
                  {product.category}
                </span>
              )}
            </div>

            <div className="bg-slate-50 rounded-[1.5rem] border border-slate-100 p-6">
              <h2 className="font-black text-slate-900 mb-3 text-lg">Description</h2>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">{product.description || 'Aucune description'}</p>
            </div>

            {product.seller && (
              <div className="bg-slate-50 rounded-[1.5rem] border border-slate-100 p-6">
                <h2 className="font-black text-slate-900 mb-3 text-lg">Vendeur</h2>
                <p className="text-slate-900 font-bold text-lg">{product.seller.company_name || product.seller.full_name || product.seller.email}</p>
                {product.seller.phone && (
                  <p className="text-sm text-slate-600 mt-1 font-medium">{product.seller.phone}</p>
                )}
                {product.shop && (
                  <Link
                    href={`/marketplace/shop/${product.shop.id}`}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-black mt-3 inline-flex items-center gap-1 transition-colors"
                  >
                    Voir la boutique →
                  </Link>
                )}
              </div>
            )}

            {user && user.role === 'buyer' && (
              <div className="flex gap-4 pt-4">
                <button className="flex-1 bg-emerald-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20">
                  <ShoppingCart size={20} />
                  Ajouter au panier
                </button>
                <Link
                  href={`/messages?user=${product.seller?.id || ''}`}
                  className="px-6 py-4 border-2 border-slate-200 rounded-2xl font-black text-slate-900 hover:bg-slate-50 transition-all"
                >
                  Contacter
                </Link>
              </div>
            )}

            {!user && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-[1.5rem] p-6">
                <p className="text-sm text-blue-800 font-medium">
                  <Link href="/auth/login" className="font-black underline">
                    Connectez-vous
                  </Link>{' '}
                  pour ajouter ce produit à votre panier ou contacter le vendeur.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
