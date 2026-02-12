'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import Checkout from '@/components/buyer/Checkout';

interface Product {
  id: string;
  name: string;
  price: number;
  currency?: string;
  image_url?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const { items, clear, mounted } = useCart();
  const [address, setAddress] = useState('');
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderCurrency, setOrderCurrency] = useState('FCFA');
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    if (!mounted) return;
    if (!profile || profile.role !== 'buyer') {
      setCreateError(profile ? 'Seuls les acheteurs peuvent passer commande.' : '');
      setLoading(false);
      return;
    }
    if (items.length === 0) {
      setLoading(false);
      return;
    }
    const ids = items.map((i) => i.productId).join(',');
    fetch(`/api/products/search?ids=${ids}&limit=100`)
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, Product> = {};
        (data.products || []).forEach((p: Product) => {
          map[p.id] = p;
        });
        setProducts(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [mounted, profile, items.map((i) => i.productId).join(',')]);

  const cartLines = items
    .map((item) => {
      const p = products[item.productId];
      if (!p) return null;
      return { ...item, product: p, subtotal: Number(p.price || 0) * item.quantity };
    })
    .filter(Boolean) as Array<{ productId: string; quantity: number; product: Product; subtotal: number }>;

  const total = cartLines.reduce((acc, l) => acc + l.subtotal, 0);
  const currency = cartLines[0]?.product?.currency || 'FCFA';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCreateError('');
    if (!profile || profile.role !== 'buyer' || cartLines.length === 0) return;

    try {
      const res = await fetch('/api/buyer/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: cartLines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
          shipping_address: address || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || 'Erreur lors de la création de la commande');
        return;
      }

      setOrderId(data.order?.id);
      setOrderTotal(total);
      setOrderCurrency(currency);
    } catch {
      setCreateError('Erreur réseau. Réessayez.');
    }
  }

  const handlePaymentSuccess = () => {
    clear();
    router.push('/checkout/success');
  };

  if (!mounted) {
    return (
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
          <div className="text-center py-shamar-48 text-gray-500 text-shamar-body">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
          <div className="text-center py-shamar-48">
            <p className="text-gray-500 mb-shamar-16 text-shamar-body">Connectez-vous pour passer commande.</p>
            <Link href={`/auth/login?redirect=${encodeURIComponent('/checkout')}`} className="text-primary-600 font-semibold text-shamar-body">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartLines.length === 0 && !orderId) {
    return (
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
          <div className="text-center py-shamar-48">
            <p className="text-gray-500 mb-shamar-16 text-shamar-body">Votre panier est vide.</p>
            <Link href="/products" className="text-primary-600 font-semibold text-shamar-body">
              Voir les produits
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orderId) {
    return (
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div>
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-3">
              Paiement <span className="text-primary-600">sécurisé</span>
            </h1>
            <p className="text-shamar-body text-gray-500 font-medium">Commande créée. Procédez au paiement.</p>
          </div>
          <div className="max-w-md">
            <Checkout
              orderId={orderId}
              amount={orderTotal}
              currency={orderCurrency}
              onSuccess={handlePaymentSuccess}
              onError={setCreateError}
            />
            {createError && (
              <p className="mt-shamar-16 text-red-600 text-shamar-small">{createError}</p>
            )}
            <Link href="/cart" className="mt-shamar-24 inline-block text-gray-500 hover:text-primary-600 font-medium text-shamar-small">
              ← Retour au panier
            </Link>
          </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 font-semibold mb-shamar-24 transition-colors group text-shamar-body"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Retour au panier
        </Link>
        <div>
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-3">
            Finaliser la <span className="text-primary-600">commande</span>
          </h1>
          <p className="text-shamar-body text-gray-500 font-medium max-w-xl">
            Vérifiez vos informations de livraison et procédez au paiement.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-shamar-32">
          <div className="lg:col-span-2 space-y-shamar-24">
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
              <h2 className="text-shamar-h2 text-gray-900 mb-shamar-24 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white text-shamar-small font-semibold">1</span>
                Adresse de livraison
              </h2>
              <div className="space-y-shamar-16">
                <label className="block text-shamar-small font-semibold text-gray-700 ml-1">Adresse complète</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-shamar-20 py-shamar-16 bg-gray-50 border border-gray-200 rounded-shamar-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 transition-all min-h-[120px] resize-y font-medium placeholder-gray-400"
                  rows={4}
                  placeholder="Rue, Code postal, Ville, Pays..."
                  required
                />
              </div>
            </div>

            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
              <h2 className="text-shamar-h2 text-gray-900 mb-shamar-24 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 text-shamar-small font-semibold">2</span>
                Moyen de paiement
              </h2>
              <div className="bg-gray-50 rounded-shamar-md p-shamar-24 border border-gray-200 flex items-center gap-shamar-16">
                <div className="p-3 bg-gray-0 rounded-shamar-md shadow-shamar-soft text-gray-400">
                  <CreditCard size={24} />
                </div>
                <div>
                  <p className="text-gray-900 font-semibold text-shamar-body">Paiement sécurisé (escrow)</p>
                  <p className="text-shamar-small text-gray-500 font-medium">Stripe, Mobile Money. L&apos;étape de paiement s&apos;effectuera après validation.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft sticky top-8">
              <h3 className="text-shamar-h3 text-gray-900 mb-shamar-24 border-b border-gray-200 pb-shamar-16">Récapitulatif</h3>
              <div className="space-y-2 mb-shamar-16">
                {loading ? (
                  <p className="text-gray-400 text-shamar-small">Chargement...</p>
                ) : (
                  cartLines.map((l) => (
                    <div key={l.productId} className="flex justify-between text-shamar-small">
                      <span className="text-gray-600 truncate flex-1 mr-2">{l.product.name} x{l.quantity}</span>
                      <span className="font-semibold text-gray-900">{(l.subtotal).toLocaleString()} {l.product.currency || 'FCFA'}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="space-y-shamar-16 text-gray-600 font-medium mb-shamar-32 text-shamar-body">
                <div className="flex justify-between items-center">
                  <span>Sous-total</span>
                  <span className="font-semibold text-gray-900">{total.toLocaleString()} {currency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Livraison</span>
                  <span className="text-primary-600 font-semibold bg-primary-100 px-3 py-1 rounded-shamar-sm text-shamar-small">Gratuit</span>
                </div>
                <div className="pt-shamar-24 border-t-2 border-dashed border-gray-200 flex justify-between items-end">
                  <span className="text-shamar-body font-semibold">Total</span>
                  <div className="text-right">
                    <span className="text-shamar-h2 font-semibold text-gray-900 block leading-none">{total.toLocaleString()}</span>
                    <span className="text-shamar-caption text-gray-400 font-medium">{currency} (TVA incluse)</span>
                  </div>
                </div>
              </div>
              {createError && <p className="text-red-600 text-shamar-small mb-shamar-16">{createError}</p>}
              <button
                type="submit"
                disabled={loading || cartLines.length === 0}
                className="w-full bg-primary-600 text-white py-shamar-16 rounded-shamar-md font-semibold text-shamar-body hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                Confirmer et payer
              </button>
              <p className="text-shamar-caption text-center text-gray-400 mt-shamar-16 font-medium">Paiement 100% sécurisé (escrow)</p>
            </div>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
