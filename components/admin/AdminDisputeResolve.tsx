'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDisputeResolve({ disputeId }: { disputeId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<'resolved' | 'rejected'>('resolved');
  const [resolutionNote, setResolutionNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!resolutionNote.trim()) {
      setError('Indiquez la décision (résolution).');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/disputes/resolve', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dispute_id: disputeId,
          status,
          resolution_note: resolutionNote.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Décision</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as 'resolved' | 'rejected')}
          className="w-full px-4 py-2 border border-slate-200 rounded-xl"
        >
          <option value="resolved">Résolu (en faveur du plaignant / remboursement)</option>
          <option value="rejected">Rejeté (en faveur du vendeur)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Note de résolution *</label>
        <textarea
          value={resolutionNote}
          onChange={(e) => setResolutionNote(e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl min-h-[100px]"
          placeholder="Décision et motif..."
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 rounded-xl bg-rose-600 text-white font-bold disabled:opacity-50"
      >
        {loading ? 'Envoi...' : 'Enregistrer la décision'}
      </button>
    </form>
  );
}
