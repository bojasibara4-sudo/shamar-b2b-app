'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OpenDisputeForm({
  orderId,
  reasons,
  maxAmount,
  currency,
}: {
  orderId: string;
  reasons: { value: string; label: string }[];
  maxAmount: number;
  currency: string;
}) {
  const router = useRouter();
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [amountRequested, setAmountRequested] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!reason.trim()) {
      setError('Choisissez un motif');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/disputes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          reason: reason.trim(),
          description: description.trim() || undefined,
          amount_requested: amountRequested ? Math.min(maxAmount, Math.max(0, parseFloat(amountRequested))) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      router.push(`/disputes/${data.dispute.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Motif *</label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl"
          required
        >
          <option value="">— Choisir —</option>
          {reasons.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl min-h-[120px]"
          placeholder="Décrivez le problème..."
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Montant demandé ({currency}) — optionnel</label>
        <input
          type="number"
          min="0"
          max={maxAmount}
          step="1"
          value={amountRequested}
          onChange={(e) => setAmountRequested(e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl"
          placeholder={`Max ${maxAmount.toLocaleString()}`}
        />
      </div>
      <p className="text-xs text-slate-500">Vous pourrez ajouter des photos et un chat une fois le litige créé.</p>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-amber-600 text-white font-bold disabled:opacity-50"
      >
        {loading ? 'Envoi...' : 'Soumettre le litige'}
      </button>
    </form>
  );
}
