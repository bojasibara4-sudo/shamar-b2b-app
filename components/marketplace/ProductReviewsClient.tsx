'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

type Distribution = { 1: number; 2: number; 3: number; 4: number; 5: number };

export default function ProductReviewsClient({
  productId,
  initialReviews,
  initialAverage,
  initialTotal,
  distribution,
}: {
  productId: string;
  initialReviews: any[];
  initialAverage: number;
  initialTotal: number;
  distribution: Distribution;
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [average, setAverage] = useState(initialAverage);
  const [total, setTotal] = useState(initialTotal);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/product-reviews/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, rating, comment: comment || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      setReviews([{ id: '', buyer_id: '', rating, comment: comment || null, created_at: new Date().toISOString() }, ...reviews]);
      setTotal(total + 1);
      setAverage(Math.round((average * total + rating) / (total + 1) * 10) / 10);
      setShowForm(false);
      setRating(0);
      setComment('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de l\'envoi');
    } finally {
      setSubmitting(false);
    }
  };

  const maxDist = Math.max(1, ...Object.values(distribution));

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Star className="text-brand-or fill-current" size={32} />
            <span className="text-3xl font-black text-slate-900">{average.toFixed(1)}</span>
          </div>
          <span className="text-slate-500 font-medium">{total} avis</span>
        </div>
        <div className="mt-4 space-y-1">
          {([5, 4, 3, 2, 1] as const).map((star) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600 w-8">{star} ★</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-or rounded-full"
                  style={{ width: `${(distribution[star] / maxDist) * 100}%` }}
                />
              </div>
              <span className="text-sm text-slate-500 w-8">{distribution[star]}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-slate-900">Commentaires</h2>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-xl bg-brand-vert text-white font-bold hover:opacity-90"
          >
            Écrire un avis
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmitReview} className="mb-6 p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-500 mb-2">Connectez-vous en tant qu&apos;acheteur pour laisser un avis.</p>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className="p-1"
                >
                  <Star
                    size={28}
                    className={n <= rating ? 'text-brand-or fill-current' : 'text-slate-300'}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Votre avis (optionnel)"
              className="w-full p-3 rounded-xl border border-slate-200 mb-4 min-h-[80px]"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting || rating < 1}
                className="px-4 py-2 rounded-xl bg-brand-vert text-white font-bold disabled:opacity-50"
              >
                {submitting ? 'Envoi...' : 'Publier'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl border border-slate-200">
                Annuler
              </button>
            </div>
          </form>
        )}

        <ul className="space-y-4">
          {reviews.map((r: any) => (
            <li key={r.id || r.created_at} className="py-3 border-b border-slate-100 last:border-0">
              <div className="flex gap-2 mb-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={14}
                    className={n <= (r.rating || 0) ? 'text-brand-or fill-current' : 'text-slate-200'}
                  />
                ))}
              </div>
              {r.comment && <p className="text-slate-600 text-sm">{r.comment}</p>}
            </li>
          ))}
        </ul>
        {reviews.length === 0 && !showForm && (
          <p className="text-slate-500 font-medium">Aucun avis pour le moment.</p>
        )}
      </div>
    </div>
  );
}
