'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  counter_offer: 'Contre-offre',
  accepted: 'Accepté',
  rejected: 'Rejeté',
  expired: 'Expiré',
};

export default function NegociationClient({
  offerId,
  initialOffer,
  currentUserId,
}: {
  offerId: string;
  initialOffer: any;
  currentUserId: string;
}) {
  const router = useRouter();
  const [offer, setOffer] = useState(initialOffer);
  const [action, setAction] = useState<'accept' | 'reject' | 'counter' | null>(null);
  const [counterPrice, setCounterPrice] = useState(String(offer?.price || 0));
  const [counterQty, setCounterQty] = useState(String(offer?.quantity || 1));
  const [counterMessage, setCounterMessage] = useState(offer?.message || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const product = offer?.product;
  const isSeller = currentUserId && offer?.seller_id === currentUserId;
  const isBuyer = currentUserId && offer?.buyer_id === currentUserId;
  const isPending = offer?.status === 'pending';
  const isCounter = offer?.status === 'counter_offer';
  const isClosed = offer?.status === 'accepted' || offer?.status === 'rejected';

  const runAction = async (act: 'accept' | 'reject' | 'counter') => {
    setError('');
    setLoading(true);
    try {
      const body: Record<string, unknown> = { action: act };
      if (act === 'counter') {
        body.price = parseFloat(counterPrice) || 0;
        body.quantity = parseInt(counterQty, 10) || 1;
        body.message = counterMessage || undefined;
      }
      const res = await fetch(`/api/offers/${offerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      setOffer(data.offer);
      setAction(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <span className="px-3 py-1 rounded-full text-sm font-bold bg-slate-100 text-slate-700">
            {STATUS_LABELS[offer?.status] || offer?.status}
          </span>
          {product && (
            <Link href={`/products/${offer?.product_id}`} className="text-sm text-brand-vert hover:underline">
              Voir le produit
            </Link>
          )}
        </div>
        {product && (
          <div className="mt-4 flex gap-4">
            {product.image_url ? (
              <img src={product.image_url} alt="" className="w-24 h-24 object-cover rounded-xl" />
            ) : (
              <div className="w-24 h-24 bg-slate-200 rounded-xl flex items-center justify-center text-slate-500 font-black text-2xl">
                {product.name?.[0] || 'P'}
              </div>
            )}
            <div>
              <h2 className="text-xl font-black text-slate-900">{product.name}</h2>
              <p className="text-slate-600 text-sm mt-1">
                Offre : {Number(offer?.price || 0).toLocaleString()} {offer?.currency || 'FCFA'} × {offer?.quantity || 0}
              </p>
              {offer?.message && <p className="text-slate-500 text-sm mt-2">{offer.message}</p>}
            </div>
          </div>
        )}
        <div className="mt-4 text-sm text-slate-500">
          Acheteur : {offer?.buyer?.company_name || offer?.buyer?.full_name || offer?.buyer?.email}
          <br />
          Vendeur : {offer?.seller?.company_name || offer?.seller?.full_name || offer?.seller?.email}
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {!isClosed && (
        <div className="p-6 space-y-4">
          {action === 'counter' && (
            <div className="p-4 bg-slate-50 rounded-xl space-y-3">
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Prix"
                value={counterPrice}
                onChange={(e) => setCounterPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
              <input
                type="number"
                min="1"
                placeholder="Quantité"
                value={counterQty}
                onChange={(e) => setCounterQty(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
              <textarea
                placeholder="Message (optionnel)"
                value={counterMessage}
                onChange={(e) => setCounterMessage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => runAction('counter')}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-brand-vert text-white font-bold disabled:opacity-50"
                >
                  Envoyer contre-offre
                </button>
                <button type="button" onClick={() => setAction(null)} className="px-4 py-2 rounded-xl border border-slate-200">
                  Annuler
                </button>
              </div>
            </div>
          )}
          {!action && (
            <div className="flex flex-wrap gap-2">
              {isSeller && isPending && (
                <>
                  <button
                    type="button"
                    onClick={() => runAction('accept')}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold disabled:opacity-50"
                  >
                    Accepter
                  </button>
                  <button
                    type="button"
                    onClick={() => runAction('reject')}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold disabled:opacity-50"
                  >
                    Refuser
                  </button>
                  <button
                    type="button"
                    onClick={() => setAction('counter')}
                    className="px-4 py-2 rounded-xl bg-slate-200 text-slate-800 font-bold"
                  >
                    Contre-proposer
                  </button>
                </>
              )}
              {isBuyer && isCounter && (
                <>
                  <button
                    type="button"
                    onClick={() => runAction('accept')}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold disabled:opacity-50"
                  >
                    Accepter la contre-offre
                  </button>
                  <button
                    type="button"
                    onClick={() => runAction('reject')}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold disabled:opacity-50"
                  >
                    Refuser
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
