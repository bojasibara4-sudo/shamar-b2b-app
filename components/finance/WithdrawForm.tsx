'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WithdrawForm() {
  const router = useRouter();
  const [available, setAvailable] = useState(0);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/wallet')
      .then((r) => r.json())
      .then((d) => setAvailable(Number(d.available || 0)))
      .catch(() => setAvailable(0));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      setError('Montant invalide');
      return;
    }
    if (num > available) {
      setError('Montant supérieur au solde disponible');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/seller/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: num,
          method,
          currency: 'FCFA',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      router.push('/dashboard/wallet');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la demande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="p-4 bg-slate-50 rounded-xl">
        <p className="text-sm text-slate-500">Solde disponible</p>
        <p className="text-2xl font-black text-slate-900">{available.toLocaleString()} FCFA</p>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Montant (FCFA)</label>
        <input
          type="number"
          min="1"
          max={available}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl"
          placeholder="0"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Méthode</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl"
        >
          <option value="bank">Virement bancaire</option>
          <option value="mobile_money">Mobile Money</option>
        </select>
      </div>
      <p className="text-xs text-slate-500">
        KYC et coordonnées bancaires à renseigner dans votre profil. Les versements sont traités sous 2–5 jours ouvrés.
      </p>
      <button
        type="submit"
        disabled={loading || available <= 0}
        className="w-full py-3 rounded-xl bg-brand-vert text-white font-bold disabled:opacity-50"
      >
        {loading ? 'Envoi...' : 'Demander le retrait'}
      </button>
    </form>
  );
}
