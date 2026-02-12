'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

const INCIDENT_TYPES = [
  { value: 'delay', label: 'Retard' },
  { value: 'damaged', label: 'Marchandise endommagée' },
  { value: 'lost', label: 'Perte / non livré' },
  { value: 'wrong_item', label: 'Mauvais article' },
  { value: 'other', label: 'Autre' },
];

export default function ChinaIncidentCreatePage() {
  const searchParams = useSearchParams();
  const shipmentId = searchParams.get('shipment') || searchParams.get('order') || '';

  const [type, setType] = useState('delay');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipmentId) return;
    setLoading(true);
    try {
      const res = await fetch('/api/delivery/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          delivery_id: shipmentId,
          type,
          description: description.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error('Erreur');
      setSent(true);
    } catch {
      setSent(false);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
          <div className="max-w-lg mx-auto bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft text-center">
            <div className="w-14 h-14 rounded-full bg-success-500/20 text-success-500 flex items-center justify-center mx-auto mb-shamar-24">
              <AlertTriangle size={28} />
            </div>
            <h1 className="text-shamar-h2 text-gray-900">Signalement envoyé</h1>
            <p className="text-shamar-body text-gray-500 mt-2">Notre équipe traitera votre incident sous 48 h.</p>
            <Link href="/china/shipments" className="inline-block mt-shamar-24 text-primary-600 font-semibold hover:underline">
              Retour aux expéditions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="max-w-2xl">
          <Link href="/china/shipments" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 font-medium mb-shamar-24">
            <ArrowLeft size={16} /> Retour aux expéditions
          </Link>
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight flex items-center gap-2">
            <AlertTriangle className="text-warning-500" size={28} /> Signaler un problème
          </h1>
          <p className="text-shamar-body text-gray-500 mt-1">Type, photos (à brancher), description.</p>

          <form onSubmit={handleSubmit} className="mt-shamar-32 space-y-shamar-24 bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <div>
              <label className="block text-shamar-small font-semibold text-gray-900 mb-2">Type d’incident *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-shamar-16 py-shamar-12 border border-gray-200 rounded-shamar-md text-gray-900 focus:ring-2 focus:ring-primary-500"
              >
                {INCIDENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-shamar-small font-semibold text-gray-900 mb-2">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                placeholder="Décrivez le problème..."
                className="w-full px-shamar-16 py-shamar-12 border border-gray-200 rounded-shamar-md text-gray-900 focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <p className="text-shamar-small text-gray-500">Upload de photos à connecter (API evidence).</p>
            <div className="flex gap-shamar-16">
              <button
                type="submit"
                disabled={loading || !shipmentId}
                className="px-shamar-32 py-shamar-12 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Envoi...' : 'Envoyer'}
              </button>
              <Link href="/china/shipments" className="px-shamar-32 py-shamar-12 border border-gray-200 text-gray-700 font-semibold rounded-shamar-md hover:bg-gray-50">
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
