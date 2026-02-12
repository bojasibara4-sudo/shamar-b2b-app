'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';
import type { NegoceOffer } from '@/lib/negoce-offers';
import { getNegoceOffer } from '@/lib/negoce-offers';

export default function NegoceRFQPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [offer, setOffer] = useState<NegoceOffer | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(`/api/negoce/offers/${id}`)
      .then((res) => res.json())
      .then((data) => setOffer(data.offer ?? null))
      .catch(() => setOffer(getNegoceOffer(id) ?? null));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      const res = await fetch('/api/negoce/rfq', {
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
      if (res.ok) router.push(`/negoce/negociation/${id}`);
      else alert((await res.json()).error || 'Erreur');
    } catch { alert('Erreur'); }
    setSending(false);
  };

  if (!offer) return <div className="py-shamar-48 text-center text-shamar-body text-gray-500">Chargement...</div>;

  return (
    <div className="space-y-shamar-32">
      <Link href={`/negoce/${id}`} className="inline-flex gap-2 text-shamar-body text-gray-500 hover:text-primary-600"><ArrowLeft size={20} /> Retour</Link>
      <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
        <h1 className="text-shamar-h2 text-gray-900 mb-2">Demande de devis (RFQ)</h1>
        <p className="text-shamar-body text-gray-500 mb-shamar-24">{offer.product} — {offer.supplier_name}</p>
        <form onSubmit={handleSubmit} className="space-y-shamar-24">
          <div>
            <label className="block text-shamar-small font-medium text-gray-700 mb-2">Quantité ({offer.moq_unit})</label>
            <input name="quantity" type="number" required min={offer.moq} defaultValue={offer.moq} className="w-full px-4 py-3 rounded-shamar-md border border-gray-200 bg-gray-0 text-gray-900 focus:ring-2 focus:ring-primary-500/20" />
          </div>
          <div>
            <label className="block text-shamar-small font-medium text-gray-700 mb-2">Port livraison</label>
            <input name="port" type="text" placeholder="Ex: Abidjan" className="w-full px-4 py-3 rounded-shamar-md border border-gray-200 bg-gray-0 text-gray-900" />
          </div>
          <div>
            <label className="block text-shamar-small font-medium text-gray-700 mb-2">Incoterm</label>
            <select name="incoterm" className="w-full px-4 py-3 rounded-shamar-md border border-gray-200 bg-gray-0 text-gray-900">
              <option value="FOB">FOB</option>
              <option value="CIF">CIF</option>
              <option value="EXW">EXW</option>
            </select>
          </div>
          <div>
            <label className="block text-shamar-small font-medium text-gray-700 mb-2">Message</label>
            <textarea name="message" rows={3} required className="w-full px-4 py-3 rounded-shamar-md border border-gray-200 bg-gray-0 text-gray-900" />
          </div>
          <button type="submit" disabled={sending} className="inline-flex gap-2 px-shamar-24 py-3 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700 disabled:opacity-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
            <Send size={18} /> {sending ? 'Envoi...' : 'Envoyer RFQ'}
          </button>
        </form>
      </div>
    </div>
  );
}
