'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  image_url?: string;
  seller_id?: string;
}

export default function PanierPage() {
  const { items, add, update, remove, count, mounted } = useCart();
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);

  const idsParam = items.map((i) => i.productId).sort().join(',');
  useEffect(() => {
    if (!mounted || items.length === 0) {
      setLoading(false);
      return;
    }
    fetch(`/api/products/search?ids=${idsParam}&limit=100`)
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, Product> = {};
        (data.products || []).forEach((p: Product) => {
          map[p.id] = p;
        });
        setProducts(map);
      })
      .catch(() => setProducts({}))
      .finally(() => setLoading(false));
  }, [mounted, idsParam]);

  const cartLines = items
    .map((item) => {
      const p = products[item.productId];
      if (!p) return null;
      return {
        ...item,
        product: p,
        subtotal: Number(p.price || 0) * item.quantity,
      };
    })
    .filter(Boolean) as Array<{ productId: string; quantity: number; product: Product; subtotal: number }>;

  const total = cartLines.reduce((acc, l) => acc + l.subtotal, 0);
  const currency = cartLines[0]?.product?.currency || 'FCFA';

  if (!mounted) {
    return (
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
          <div className="text-center py-shamar-48 text-gray-500 text-shamar-body">Chargement du panier...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary-100 rounded-shamar-md">
              <ShoppingBag className="text-primary-600" size={32} />
            </div>
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight">
              Votre <span className="text-primary-600">Panier</span>
            </h1>
          </div>
          <p className="text-shamar-body text-gray-500 font-medium">
            Révisez vos articles avant de passer commande
          </p>
        </div>

        {cartLines.length === 0 ? (
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-48 text-center shadow-shamar-soft">
            <p className="text-gray-500 font-medium mb-shamar-16 text-shamar-body">Votre panier est vide</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-shamar-24 py-3 bg-primary-600 text-white font-semibold rounded-shamar-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Voir les produits <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-shamar-24">
            <div className="lg:col-span-2 space-y-shamar-16">
              {loading ? (
                <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft text-gray-500">Chargement...</div>
              ) : (
                cartLines.map((line) => (
                  <div
                    key={line.productId}
                    className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium transition-all flex flex-col sm:flex-row items-stretch sm:items-center gap-shamar-16"
                  >
                    <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-shamar-md flex-shrink-0 overflow-hidden">
                      {line.product.image_url ? (
                        <img
                          src={line.product.image_url}
                          alt={line.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-shamar-h3 text-gray-400">
                          {line.product.name?.[0]?.toUpperCase() || 'P'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${line.productId}`}
                        className="font-semibold text-shamar-body text-gray-900 hover:text-primary-600 block truncate"
                      >
                        {line.product.name}
                      </Link>
                      <p className="text-primary-600 font-semibold text-shamar-body mt-1">
                        {Number(line.product.price).toLocaleString()} {line.product.currency || 'FCFA'}
                      </p>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center gap-3">
                      <button
                        onClick={() => remove(line.productId)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-shamar-md"
                        aria-label="Supprimer"
                      >
                        <Trash2 size={20} />
                      </button>
                      <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-shamar-md">
                        <button
                          onClick={() => update(line.productId, line.quantity - 1)}
                          className="p-1.5 hover:bg-gray-0 rounded-shamar-sm transition-all"
                        >
                          <Minus size={16} className="text-gray-600" />
                        </button>
                        <span className="font-semibold text-shamar-body text-gray-900 min-w-[2rem] text-center">
                          {line.quantity}
                        </span>
                        <button
                          onClick={() => update(line.productId, line.quantity + 1)}
                          className="p-1.5 hover:bg-gray-0 rounded-shamar-sm transition-all"
                        >
                          <Plus size={16} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-shamar-24">
              <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-24 space-y-shamar-24">
                <h3 className="text-shamar-h2 text-gray-900">Récapitulatif</h3>
                <div className="space-y-shamar-12">
                  <div className="flex justify-between text-gray-600 font-medium text-shamar-body">
                    <span>Sous-total</span>
                    <span>{total.toLocaleString()} {currency}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 font-medium text-shamar-body">
                    <span>Livraison</span>
                    <span className="text-primary-600 font-semibold">Gratuit</span>
                  </div>
                  <div className="pt-shamar-16 border-t-2 border-gray-200 flex justify-between text-shamar-h3 font-semibold text-gray-900">
                    <span>Total</span>
                    <span>{total.toLocaleString()} {currency}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="w-full bg-primary-600 text-white py-shamar-16 rounded-shamar-md font-semibold text-shamar-body hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                >
                  Passer la commande <ArrowRight size={22} />
                </Link>
                <Link
                  href="/products"
                  className="block text-center text-gray-500 hover:text-primary-600 font-medium text-shamar-small"
                >
                  Continuer mes achats
                </Link>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
