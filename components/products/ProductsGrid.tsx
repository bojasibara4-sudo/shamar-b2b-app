'use client';

import React from 'react';
import { Heart, ShoppingCart, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import CreateOrderButton from '@/components/CreateOrderButton';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sellerId: string;
  sellerEmail?: string;
}

interface ProductsGridProps {
  products: Product[];
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const userRole = profile?.role;

  const handleAddProductClick = () => {
    if (userRole !== 'seller') {
      router.push('/auth/login');
      return;
    }
    router.push('/dashboard/seller/products');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900">Produits disponibles</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <div key={product.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all">
            <div className="relative aspect-square bg-slate-100">
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <ShoppingCart size={48} />
              </div>
              <button className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-400 hover:text-rose-500 transition-colors">
                <Heart size={18} />
              </button>
              <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded">B2B</span>
            </div>
            <div className="p-4">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Produit</p>
              <h3 className="font-bold text-slate-900 truncate mt-1">{product.name}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{product.description}</p>
              <p className="text-emerald-600 font-black text-lg mt-2">{product.price.toLocaleString()} FCFA</p>
              {/* Afficher le bouton de commande uniquement pour les buyers */}
              {!authLoading && userRole === 'buyer' && (
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <CreateOrderButton productId={product.id} />
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Placeholder for Manual Upload - Visible uniquement pour les sellers */}
        {!authLoading && userRole === 'seller' && (
          <div 
            onClick={handleAddProductClick}
            className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-3 hover:border-emerald-300 transition-colors cursor-pointer group"
          >
            <div className="p-4 bg-slate-100 rounded-full text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all">
              <Upload size={32} />
            </div>
            <div>
              <p className="font-bold text-slate-900">Ajouter un produit</p>
              <p className="text-xs text-slate-500">Upload manuel d&apos;images</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

