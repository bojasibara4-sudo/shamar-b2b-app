'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NewRfqPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get('product_id') || searchParams.get('product');
  const [product, setProduct] = useState<{ id: string; name: string } | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/products/search?ids=${productId}&limit=1`)
      .then((r) => r.json())
      .then((d) => {
        const p = d.products?.[0];
        if (p) setProduct({ id: p.id, name: p.name });
      })
      .catch(() => setProduct(null));
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !quantity || parseInt(quantity, 10) < 1) {
      setError('Quantité requise');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/product-rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          quantity: parseInt(quantity, 10),
          message: message || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      router.push(`/rfq/${data.rfq.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  if (!productId) {
    return (
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 py-shamar-48">
          <p className="text-gray-500 text-shamar-body">Produit non spécifié.</p>
          <Link href="/products" className="mt-shamar-16 inline-block text-primary-600 font-semibold hover:underline text-shamar-body">
            Voir le catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full">
    <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <Link href={productId ? `/products/${productId}` : '/products'} className="text-shamar-small font-medium text-gray-500 hover:text-primary-600">
        ← Retour
      </Link>
      <h1 className="text-shamar-h2 text-gray-900 mt-shamar-16 mb-shamar-24">
        Demande de devis {product ? `— ${product.name}` : ''}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-shamar-16 bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft max-w-lg">
        {error && <p className="text-danger-500 text-shamar-small">{error}</p>}
        <div>
          <label className="block text-shamar-small font-semibold text-gray-700 mb-2">Quantité</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-shamar-16 py-3 border border-gray-200 rounded-shamar-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-600"
            required
          />
        </div>
        <div>
          <label className="block text-shamar-small font-semibold text-gray-700 mb-2">Message (optionnel)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-shamar-16 py-3 border border-gray-200 rounded-shamar-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-600"
            rows={3}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-shamar-md bg-primary-600 text-gray-0 font-semibold disabled:opacity-50 hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-shamar-body"
        >
          {loading ? 'Envoi...' : 'Envoyer la demande'}
        </button>
      </form>
    </div>
    </div>
  );
}
