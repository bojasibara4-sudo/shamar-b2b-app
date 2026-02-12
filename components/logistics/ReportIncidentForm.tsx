'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const TYPES = [
  { value: 'delay', label: 'Retard' },
  { value: 'lost', label: 'Colis perdu' },
  { value: 'damaged', label: 'Endommagé' },
  { value: 'wrong_item', label: 'Mauvais article' },
  { value: 'other', label: 'Autre' },
] as const;

export default function ReportIncidentForm({ deliveryId }: { deliveryId: string }) {
  const router = useRouter();
  const [type, setType] = useState<string>('delay');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/delivery/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delivery_id: deliveryId, type, description, photo_urls: [] }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push(`/profile/deliveries/${deliveryId}`);
        router.refresh();
      } else {
        alert(data.error || 'Erreur');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Type d&apos;incident</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:ring-2 focus:ring-brand-vert/30 focus:border-brand-vert outline-none"
        >
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Commentaire</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Décrivez le problème..."
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:ring-2 focus:ring-brand-vert/30 focus:border-brand-vert outline-none"
        />
      </div>
      <p className="text-slate-500 text-xs">Un ticket sera créé. Un litige peut être ouvert si nécessaire ; l&apos;escrow restera bloqué.</p>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-brand-vert text-white rounded-xl font-medium text-sm hover:bg-brand-vert/90 disabled:opacity-50"
      >
        {loading ? 'Envoi…' : 'Envoyer'}
      </button>
    </form>
  );
}
