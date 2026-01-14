'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import { supabaseClient } from '@/lib/supabaseClient';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  shop_id: string;
  image_url?: string;
  stock_quantity?: number;
  created_at: string;
}

export default function ShopProductsPage() {
  const params = useParams();
  const shopId = params.id as string;
  const { profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'FCFA',
    stock_quantity: '',
  });

  useEffect(() => {
    if (shopId) {
      loadProducts();
    }
  }, [shopId]);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('products')
        .select('*')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const { data, error } = await supabaseClient
        .from('products')
        .insert({
          name: formData.name,
          description: formData.description || null,
          price: parseFloat(formData.price),
          currency: formData.currency,
          shop_id: shopId,
          stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : 0,
        } as any)
        .select()
        .single();

      if (error) throw error;

      setProducts([data, ...products]);
      setShowCreateModal(false);
      setFormData({
        name: '',
        description: '',
        price: '',
        currency: 'FCFA',
        stock_quantity: '',
      });
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Erreur lors de la création du produit');
    }
  };

  return (
    <AuthGuard requiredRole="seller">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Produits de la boutique</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
          >
            Ajouter un produit
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Chargement...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucun produit. Ajoutez-en un pour commencer.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-emerald-600">
                    {product.price.toLocaleString()} {product.currency}
                  </span>
                  {product.stock_quantity !== undefined && (
                    <span className="text-sm text-gray-500">
                      Stock: {product.stock_quantity}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Nouveau produit</h2>
              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Devise
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="FCFA">FCFA</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock (optionnel)
                  </label>
                  <input
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700"
                  >
                    Créer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setFormData({
                        name: '',
                        description: '',
                        price: '',
                        currency: 'FCFA',
                        stock_quantity: '',
                      });
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}

