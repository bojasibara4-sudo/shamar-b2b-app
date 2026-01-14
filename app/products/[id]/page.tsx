'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  shop_id: string;
  image_url?: string;
  stock_quantity?: number;
  shop?: {
    name: string;
    owner_id: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { profile, isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('products')
        .select(`
          *,
          shop:shops(name, owner_id)
        `)
        .eq('id', productId)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated || !profile) {
      router.push('/auth/login');
      return;
    }

    if (!product || !product.shop) {
      alert('Erreur: informations produit manquantes');
      return;
    }

    try {
      // Créer une commande
      const { data: order, error: orderError } = await supabaseClient
        .from('orders')
        .insert({
          buyer_id: profile.id,
          seller_id: product.shop.owner_id,
          total_amount: product.price * quantity,
          currency: product.currency,
          status: 'PENDING',
        } as any)
        .select()
        .single();

      if (orderError) throw orderError;

      // Ajouter le produit à la commande
      const { error: itemError } = await supabaseClient
        .from('order_items')
        .insert({
          order_id: (order as any).id,
          product_id: product.id,
          quantity: quantity,
          price: product.price,
        } as any);

      if (itemError) throw itemError;

      router.push(`/dashboard/orders/${(order as any).id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Erreur lors de la création de la commande');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8 text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        <div className="text-center py-8 text-gray-500">Produit non trouvé</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Aucune image</span>
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          {product.shop && (
            <p className="text-sm text-gray-500 mb-4">Boutique: {product.shop.name}</p>
          )}
          {product.description && (
            <p className="text-gray-600 mb-6">{product.description}</p>
          )}
          <div className="mb-6">
            <p className="text-3xl font-bold text-emerald-600 mb-2">
              {product.price.toLocaleString()} {product.currency}
            </p>
            {product.stock_quantity !== undefined && (
              <p className="text-sm text-gray-500">
                Stock disponible: {product.stock_quantity}
              </p>
            )}
          </div>
          {/* Afficher les contrôles de commande uniquement pour les buyers */}
          {profile?.role === 'buyer' && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantité
                </label>
                <input
                  type="number"
                  min="1"
                  max={product.stock_quantity || 999}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-md hover:bg-emerald-700 text-lg font-semibold"
              >
                Commander
              </button>
            </>
          )}
          {!profile && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-sm text-gray-600 mb-3">
                Connectez-vous en tant qu&apos;acheteur pour passer une commande
              </p>
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 text-sm font-semibold"
              >
                Se connecter
              </button>
            </div>
          )}
          {profile && profile.role !== 'buyer' && (
            <div className="mb-6 p-4 bg-amber-50 rounded-md border border-amber-200">
              <p className="text-sm text-amber-800">
                Seuls les acheteurs peuvent passer des commandes. Accédez à votre espace vendeur pour gérer vos produits.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

