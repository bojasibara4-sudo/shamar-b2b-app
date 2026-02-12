'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Shield, FileText, MessageCircle } from 'lucide-react';
import type { NegoceOffer } from '@/lib/negoce-offers';
import { getNegoceOffer } from '@/lib/negoce-offers';

const BADGE_STYLES: Record<string, string> = {
  bronze: 'bg-amber-500/20 text-gray-800 border-amber-500/30',
  silver: 'bg-gray-200 text-gray-700 border-gray-300',
  gold: 'bg-warning-500/20 text-gray-800 border-warning-500/30',
  diamond: 'bg-primary-500/20 text-primary-700 border-primary-500/30',
};

export default function NegoceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [offer, setOffer] = useState<NegoceOffer | undefined | null>(undefined);

  useEffect(() => {
    fetch(`/api/negoce/offers/${id}`)
      .then((res) => res.json())
      .then((data) => setOffer(data.offer ?? null))
      .catch(() => setOffer(getNegoceOffer(id) ?? null));
  }, [id]);

  if (offer === undefined) return <div className="py-shamar-48 text-center text-shamar-body text-gray-500">Chargement...</div>;
  if (!offer) {
    return (
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 py-shamar-48 text-center">
          <h2 className="text-shamar-h3 text-gray-900 mb-shamar-16">Offre introuvable</h2>
          <Link href="/negoce" className="text-primary-600 font-semibold hover:underline">Retour au catalogue</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-shamar-32">
      <Link href="/negoce" className="inline-flex gap-2 text-shamar-body text-gray-500 hover:text-primary-600">← Retour</Link>
      <div className="bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden shadow-shamar-soft">
        <div className="h-48 bg-primary-500/10 flex items-center justify-center">
          <span className="text-5xl font-bold text-primary-600">{offer.supplier_name[0]}</span>
        </div>
        <div className="p-shamar-32">
          <div className="flex flex-wrap gap-2 mb-shamar-16">
            <span className={`px-3 py-1 rounded-shamar-md text-shamar-small font-semibold border ${BADGE_STYLES[offer.badge] || 'bg-gray-100 text-gray-700'}`}>{offer.badge}</span>
            <span className="flex items-center gap-1 text-gray-500"><MapPin size={16} /> {offer.country}</span>
          </div>
          <h1 className="text-shamar-h2 text-gray-900 mb-2">{offer.product}</h1>
          <p className="text-shamar-body text-gray-500 mb-shamar-24">{offer.supplier_name}</p>
          <p className="text-gray-600 mb-shamar-32">{offer.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-shamar-16 mb-shamar-32">
            <div className="bg-gray-50 rounded-shamar-md p-shamar-16">
              <p className="text-shamar-caption text-gray-500">Stock</p>
              <p className="font-semibold text-gray-900">{offer.stock_available.toLocaleString()} {offer.stock_unit}</p>
            </div>
            <div className="bg-gray-50 rounded-shamar-md p-shamar-16">
              <p className="text-shamar-caption text-gray-500">MOQ</p>
              <p className="font-semibold text-gray-900">{offer.moq} {offer.moq_unit}</p>
            </div>
            <div className="bg-gray-50 rounded-shamar-md p-shamar-16">
              <p className="text-shamar-caption text-gray-500">Prix indicatif</p>
              <p className="font-semibold text-primary-600">{offer.price_indicator} {offer.currency}/{offer.moq_unit}</p>
            </div>
            <div className="bg-gray-50 rounded-shamar-md p-shamar-16">
              <p className="text-shamar-caption text-gray-500">Incoterm</p>
              <p className="font-semibold text-gray-900">{offer.incoterm}</p>
            </div>
          </div>

          {Object.keys(offer.specifications).length > 0 && (
            <div className="mb-shamar-32">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><Shield size={18} className="text-primary-600" /> Spécifications</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(offer.specifications).map(([k, v]) => (
                  <span key={k} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-shamar-md text-shamar-small">{k}: {v}</span>
                ))}
              </div>
            </div>
          )}

          {offer.certifications.length > 0 && (
            <div className="mb-shamar-32">
              <h3 className="font-semibold text-gray-900 mb-2">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {offer.certifications.map((c) => (
                  <span key={c} className="px-3 py-1 bg-success-500/20 text-gray-800 rounded-shamar-md text-shamar-small font-medium">{c}</span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-shamar-16 pt-shamar-24 border-t border-gray-200">
            <Link href={`/negoce/rfq/${offer.id}`} className="inline-flex gap-2 px-shamar-24 py-3 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
              <FileText size={20} /> Demander devis
            </Link>
            <Link href="/messages" className="inline-flex gap-2 px-shamar-24 py-3 border border-gray-200 text-gray-700 font-medium rounded-shamar-md hover:bg-gray-50">
              <MessageCircle size={20} /> Contacter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
