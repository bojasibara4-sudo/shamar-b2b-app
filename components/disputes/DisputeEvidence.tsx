'use client';

import { useState, useEffect } from 'react';

export default function DisputeEvidence({ disputeId, canAdd }: { disputeId: string; canAdd: boolean }) {
  const [evidence, setEvidence] = useState<{ id: string; file_url: string; type: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState('');
  const [adding, setAdding] = useState(false);

  const load = () => {
    fetch(`/api/disputes/${disputeId}/evidence`)
      .then((r) => r.json())
      .then((d) => setEvidence(d.evidence || []))
      .catch(() => setEvidence([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [disputeId]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileUrl.trim() || !canAdd || adding) return;
    setAdding(true);
    try {
      await fetch(`/api/disputes/${disputeId}/evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_url: fileUrl.trim(), type: 'image' }),
      });
      setFileUrl('');
      load();
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="p-4 text-slate-500 text-sm">Chargement des preuves...</div>;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="p-3 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 text-sm">Preuves / Pièces jointes</div>
      <div className="p-4 space-y-2">
        {evidence.length === 0 && <p className="text-slate-500 text-sm">Aucune preuve.</p>}
        {evidence.map((e) => (
          <a key={e.id} href={e.file_url} target="_blank" rel="noopener noreferrer" className="block text-brand-vert font-medium text-sm hover:underline">
            {e.type} — {new Date(e.created_at).toLocaleDateString('fr-FR')}
          </a>
        ))}
      </div>
      {canAdd && (
        <form onSubmit={add} className="p-3 border-t border-slate-200 flex gap-2">
          <input
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            placeholder="URL d’une image ou pièce jointe"
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
          />
          <button type="submit" disabled={adding || !fileUrl.trim()} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold disabled:opacity-50">
            Ajouter
          </button>
        </form>
      )}
    </div>
  );
}
