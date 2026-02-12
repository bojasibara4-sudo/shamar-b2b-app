'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HostPropertyForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      title: formData.get('title'),
      description: formData.get('description'),
      city: formData.get('city'),
      price_per_night: Number(formData.get('price_per_night')),
      capacity: Number(formData.get('capacity')) || 1,
      type: formData.get('type') || 'Logement',
      amenities: (formData.get('amenities') as string)?.split(',').map((s) => s.trim()).filter(Boolean) ?? [],
      rules: formData.get('rules') || undefined,
      images: [],
    };

    try {
      const res = await fetch('/api/host/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Erreur lors de la création');
        setLoading(false);
        return;
      }
      router.push('/dashboard/host/properties');
      router.refresh();
    } catch {
      setError('Erreur de connexion');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-brand-bleu-ardoise/50 rounded-2xl border border-brand-anthracite/50 p-8 space-y-6">
      {error && <p className="text-rose-400 text-sm">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Photos</label>
        <div className="border-2 border-dashed border-brand-anthracite/50 rounded-xl p-8 text-center text-slate-500">
          Glissez vos photos ou cliquez pour importer (bientôt)
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Titre</label>
        <input name="title" type="text" required className="w-full px-4 py-3 bg-brand-bleu-nuit border border-brand-anthracite/50 rounded-xl text-white" placeholder="Ex: Villa Emeraude - Assinie" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
        <textarea name="description" rows={4} required className="w-full px-4 py-3 bg-brand-bleu-nuit border border-brand-anthracite/50 rounded-xl text-white" placeholder="Décrivez votre logement..." />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Prix / nuit (FCFA)</label>
          <input name="price_per_night" type="number" required min={1} className="w-full px-4 py-3 bg-brand-bleu-nuit border border-brand-anthracite/50 rounded-xl text-white" placeholder="85000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Capacité (voyageurs)</label>
          <input name="capacity" type="number" required min={1} className="w-full px-4 py-3 bg-brand-bleu-nuit border border-brand-anthracite/50 rounded-xl text-white" placeholder="4" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Ville / Localisation</label>
        <input name="city" type="text" required className="w-full px-4 py-3 bg-brand-bleu-nuit border border-brand-anthracite/50 rounded-xl text-white" placeholder="Assinie Mafia, CI" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
        <input name="type" type="text" className="w-full px-4 py-3 bg-brand-bleu-nuit border border-brand-anthracite/50 rounded-xl text-white" placeholder="Villa, Appartement, Chambre..." />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Équipements (séparés par des virgules)</label>
        <input name="amenities" type="text" className="w-full px-4 py-3 bg-brand-bleu-nuit border border-brand-anthracite/50 rounded-xl text-white" placeholder="WiFi, Piscine, Climatisation, Cuisine" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Règles de la maison</label>
        <textarea name="rules" rows={2} className="w-full px-4 py-3 bg-brand-bleu-nuit border border-brand-anthracite/50 rounded-xl text-white" placeholder="Pas de fêtes, pas d'animaux..." />
      </div>
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Publier'}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-brand-anthracite/50 text-slate-400 rounded-xl hover:bg-brand-anthracite/20">
          Annuler
        </button>
      </div>
    </form>
  );
}
