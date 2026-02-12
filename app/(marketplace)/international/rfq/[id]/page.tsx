'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';
import type { InternationalOffer } from '@/lib/international-offers';
import { getInternationalOffer } from '@/lib/international-offers';
import { useAuth } from '@/hooks/useAuth';

export default function InternationalRFQPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const id = params.id as string;
  const [offer, setOffer] = useState<InternationalOffer | undefined | null>(undefined);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(`/api/international/offers/${id}`)
      .then((res) => res.json())
      .then((data) => setOffer(data.offer ?? null))
      .catch(() => setOffer(getInternationalOffer(id) ?? null));
  }, [id]);

  if (loading) return <div className="p-shamar-32 text-center text-shamar-body text-gray-500">Chargement...</div>;
  if (!user) {
    router.push('/auth/login?redirect=/international/rfq/' + id);
    return null;
  }

  if (offer === undefined) return <div className="p-shamar-32 text-center text-shamar-body text-gray-500">Chargement...</div>;
  if (!offer) {
    return (
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 py-shamar-48 text-center">
          <h2 className="text-shamar-h3 text-gray-900 mb-shamar-16">Offre introuvable</h2>
          <Link href="/international" className="text-primary-600 font-semibold hover:underline">Retour</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      const res = await fetch('/api/international/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offer_id: id,
          quantity: Number(formData.get('quantity')),
          port_destination: formData.get('port') || undefined,
          incoterm: formData.get('incoterm') || 'FOB',
          specs: formData.get('specs') || undefined,
          message: formData.get('message') || undefined,
        }),
      });
      if (res.ok) {
        router.push('/international/contract/' + id);
      } else {
        const data = await res.json();
        alert(data.error || 'Erreur');
      }
    } catch {
      alert('Erreur de connexion');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <Link href={`/international/${id}`} className="inline-flex items-center gap-2 text-shamar-body text-gray-500 hover:text-primary-600 mb-shamar-24">
          <ArrowLeft size={20} /> Retour
        </Link>
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <h1 className="text-shamar-h2 text-gray-900 mb-2">Demande de devis (RFQ)</h1>
          <p className="text-shamar-body text-gray-600 mb-shamar-24">{offer.product} — {offer.supplier_name}</p>

          <form onSubmit={handleSubmit} className="space-y-shamar-24">
            <div>
              <label className="block text-shamar-small font-medium text-gray-700 mb-2">Quantité ({offer.moq_unit})</label>
              <input
                name="quantity"
                type="number"
                required
                min={offer.moq}
                defaultValue={offer.moq}
                className="w-full px-4 py-3 rounded-shamar-md border border-gray-200 text-gray-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-shamar-small font-medium text-gray-700 mb-2">Port destination</label>
              <input name="port" type="text" required placeholder="Ex: Abidjan, Dakar" className="w-full px-4 py-3 rounded-shamar-md border border-gray-200 text-gray-900 focus:ring-2 focus:ring-primary-500/20" />
            </div>
            <div>
              <label className="block text-shamar-small font-medium text-gray-700 mb-2">Incoterm souhaité</label>
              <select name="incoterm" className="w-full px-4 py-3 rounded-shamar-md border border-gray-200 text-gray-900">
                <option value="FOB">FOB</option>
                <option value="CIF">CIF</option>
                <option value="EXW">EXW</option>
              </select>
            </div>
            <div>
              <label className="block text-shamar-small font-medium text-gray-700 mb-2">Spécifications</label>
              <textarea name="specs" rows={3} className="w-full px-4 py-3 rounded-shamar-md border border-gray-200 text-gray-900" placeholder="Détails techniques, emballage..." />
            </div>
            <div>
              <label className="block text-shamar-small font-medium text-gray-700 mb-2">Message</label>
              <textarea name="message" rows={3} required className="w-full px-4 py-3 rounded-shamar-md border border-gray-200 text-gray-900" placeholder="Votre message au fournisseur..." />
            </div>
            <p className="text-shamar-small text-gray-500">Pièces jointes (bientôt)</p>
            <div className="flex gap-shamar-16 pt-shamar-16">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 px-shamar-24 py-3 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700 disabled:opacity-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <Send size={18} /> {sending ? 'Envoi...' : 'Envoyer RFQ'}
              </button>
              <Link href={`/international/${id}`} className="px-shamar-24 py-3 border border-gray-200 rounded-shamar-md font-medium text-gray-700 hover:bg-gray-50">
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
