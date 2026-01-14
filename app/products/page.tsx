'use client';

import { useState, useEffect } from 'react';
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
  shop?: {
    name: string;
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('products')
        .select(`
          *,
          shop:shops(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Catalogue des produits</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Chargement...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Aucun produit trouvé</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
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
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>
              )}
              {product.shop && (
                <p className="text-xs text-gray-500 mb-2">Boutique: {product.shop.name}</p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-emerald-600">
                  {product.price.toLocaleString()} {product.currency}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

