'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Package, Shield, FileText, MessageCircle, AlertTriangle } from 'lucide-react';
import type { InternationalOffer } from '@/lib/international-offers';
import { getInternationalOffer } from '@/lib/international-offers';

const BADGE_STYLES: Record<string, string> = {
  gold: 'bg-warning-500/20 text-gray-800 border-warning-500/30',
  verified: 'bg-success-500/20 text-gray-800 border-success-500/30',
  '': '',
};

export default function InternationalOfferDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [offer, setOffer] = useState<InternationalOffer | undefined | null>(undefined);

  useEffect(() => {
    fetch(`/api/international/offers/${id}`)
      .then((res) => res.json())
      .then((data) => setOffer(data.offer ?? null))
      .catch(() => setOffer(getInternationalOffer(id) ?? null));
  }, [id]);

  if (offer === undefined) {
    return (
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 py-shamar-48 text-center text-gray-500 text-shamar-body">Chargement...</div>
      </div>
    );
  }
  if (!offer) {
    return (
      <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 py-shamar-48 text-center">
        <h2 className="text-shamar-h2 text-gray-900 mb-2">Offre introuvable</h2>
        <Link href="/international" className="text-primary-600 font-semibold hover:underline text-shamar-body">
          Retour au catalogue
        </Link>
      </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full">
    <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden shadow-shamar-soft">
          <div className="h-48 bg-gray-100 flex items-center justify-center">
            <span className="text-shamar-h1 text-gray-400">{offer.supplier_name[0]}</span>
          </div>
          <div className="p-shamar-32">
            <div className="flex flex-wrap items-center gap-2 mb-shamar-16">
              <span className={`px-3 py-1 rounded-shamar-sm text-shamar-caption font-semibold border ${BADGE_STYLES[offer.badge] || ''}`}>
                {offer.badge === 'gold' ? 'Gold Exporter' : offer.badge === 'verified' ? 'Verified Exporter' : ''}
              </span>
              <span className="flex items-center gap-1 text-gray-500 text-shamar-small">
                <MapPin size={16} /> {offer.country}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600 text-shamar-small">{offer.product_category}</span>
            </div>
            <h1 className="text-shamar-h1 text-gray-900 mb-2">{offer.product}</h1>
            <p className="text-gray-600 font-medium mb-shamar-24 text-shamar-body">{offer.supplier_name}</p>
            <p className="text-gray-600 leading-relaxed mb-shamar-32 text-shamar-body">{offer.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-shamar-16 mb-shamar-32">
              <div className="bg-gray-50 rounded-shamar-md p-shamar-16">
                <p className="text-shamar-caption text-gray-500 font-medium">MOQ</p>
                <p className="font-semibold text-gray-900 text-shamar-body">{offer.moq.toLocaleString()} {offer.moq_unit}</p>
              </div>
              <div className="bg-gray-50 rounded-shamar-md p-shamar-16">
                <p className="text-shamar-caption text-gray-500 font-medium">Prix bulk</p>
                <p className="font-semibold text-primary-600 text-shamar-body">{offer.price_bulk} {offer.currency}/{offer.moq_unit}</p>
              </div>
              <div className="bg-gray-50 rounded-shamar-md p-shamar-16">
                <p className="text-shamar-caption text-gray-500 font-medium">Incoterm</p>
                <p className="font-semibold text-gray-900 text-shamar-body">{offer.incoterm}</p>
              </div>
              <div className="bg-gray-50 rounded-shamar-md p-shamar-16">
                <p className="text-shamar-caption text-gray-500 font-medium">Délai</p>
                <p className="font-semibold text-gray-900 text-shamar-body">{offer.lead_time_days} jours</p>
              </div>
            </div>

            {offer.certifications.length > 0 && (
              <div className="mb-shamar-32">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-shamar-body">
                  <Shield size={18} /> Certifications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {offer.certifications.map((c) => (
                    <span key={c} className="px-3 py-1 bg-success-500/20 text-gray-800 rounded-shamar-sm text-shamar-small font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-shamar-16 pt-shamar-16 border-t border-gray-200">
              <Link
                href={`/international/rfq/${offer.id}`}
                className="inline-flex items-center gap-2 px-shamar-24 py-3 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-shamar-body"
              >
                <FileText size={20} /> Demander devis
              </Link>
              <Link
                href="/messages"
                className="inline-flex items-center gap-2 px-shamar-24 py-3 border border-gray-200 text-gray-700 font-semibold rounded-shamar-md hover:bg-gray-50 text-shamar-body"
              >
                <MessageCircle size={20} /> Contacter
              </Link>
              <Link
                href="/dashboard/international/disputes"
                className="inline-flex items-center gap-2 px-shamar-24 py-3 text-warning-500 font-medium hover:underline text-shamar-body"
              >
                <AlertTriangle size={18} /> Signaler fraude
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
