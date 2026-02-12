'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente de devis',
  quoted: 'Devis proposé',
  accepted: 'Accepté',
  rejected: 'Refusé',
};

export default function RfqClient({
  rfqId,
  initialRfq,
  currentUserId,
}: {
  rfqId: string;
  initialRfq: any;
  currentUserId: string;
}) {
  const router = useRouter();
  const [rfq, setRfq] = useState(initialRfq);
  const [showQuote, setShowQuote] = useState(false);
  const [quotePrice, setQuotePrice] = useState(String(rfq?.quote_price || ''));
  const [quoteMessage, setQuoteMessage] = useState(rfq?.quote_message || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const product = rfq?.product;
  const isSeller = currentUserId && rfq?.seller_id === currentUserId;
  const isBuyer = currentUserId && rfq?.buyer_id === currentUserId;
  const isPending = rfq?.status === 'pending';
  const isQuoted = rfq?.status === 'quoted';
  const isClosed = rfq?.status === 'accepted' || rfq?.status === 'rejected';

  const runAction = async (action: 'quote' | 'accept' | 'reject') => {
    setError('');
    setLoading(true);
    try {
      const body: Record<string, unknown> = { action };
      if (action === 'quote') {
        body.quote_price = parseFloat(quotePrice) || 0;
        body.quote_message = quoteMessage || undefined;
      }
      const res = await fetch(`/api/product-rfq/${rfqId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      setRfq(data.rfq);
      setShowQuote(false);
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
            {STATUS_LABELS[rfq?.status] || rfq?.status}
          </span>
          {product && (
            <Link href={`/products/${rfq?.product_id}`} className="text-sm text-brand-vert hover:underline">
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
                Quantité demandée : {rfq?.quantity || 0}
              </p>
              {rfq?.message && <p className="text-slate-500 text-sm mt-2">{rfq.message}</p>}
              {rfq?.specifications && Object.keys(rfq.specifications).length > 0 && (
                <p className="text-slate-500 text-sm mt-1">
                  Specs : {JSON.stringify(rfq.specifications)}
                </p>
              )}
              {isQuoted && rfq?.quote_price != null && (
                <p className="text-brand-vert font-bold mt-2">
                  Devis : {Number(rfq.quote_price).toLocaleString()} {product.currency || 'FCFA'}
                  {rfq.quote_message && ` — ${rfq.quote_message}`}
                </p>
              )}
            </div>
          </div>
        )}
        <div className="mt-4 text-sm text-slate-500">
          Acheteur : {rfq?.buyer?.company_name || rfq?.buyer?.full_name || rfq?.buyer?.email}
          <br />
          Vendeur : {rfq?.seller?.company_name || rfq?.seller?.full_name || rfq?.seller?.email}
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {!isClosed && (
        <div className="p-6 space-y-4">
          {showQuote && (
            <div className="p-4 bg-slate-50 rounded-xl space-y-3">
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Prix proposé (FCFA)"
                value={quotePrice}
                onChange={(e) => setQuotePrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
              <textarea
                placeholder="Message (optionnel)"
                value={quoteMessage}
                onChange={(e) => setQuoteMessage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => runAction('quote')}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-brand-vert text-white font-bold disabled:opacity-50"
                >
                  Envoyer le devis
                </button>
                <button type="button" onClick={() => setShowQuote(false)} className="px-4 py-2 rounded-xl border border-slate-200">
                  Annuler
                </button>
              </div>
            </div>
          )}
          {!showQuote && (
            <div className="flex flex-wrap gap-2">
              {isSeller && isPending && (
                <button
                  type="button"
                  onClick={() => setShowQuote(true)}
                  className="px-4 py-2 rounded-xl bg-brand-vert text-white font-bold"
                >
                  Proposer un devis
                </button>
              )}
              {isBuyer && isQuoted && (
                <>
                  <button
                    type="button"
                    onClick={() => runAction('accept')}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold disabled:opacity-50"
                  >
                    Accepter le devis
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
