'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Download, Upload } from 'lucide-react';
import type { InternationalOffer } from '@/lib/international-offers';
import { getInternationalOffer } from '@/lib/international-offers';

const DOCS = [
  { id: 'invoice', label: 'Facture commerciale', status: 'disponible' },
  { id: 'packing', label: 'Packing list', status: 'disponible' },
  { id: 'bl', label: 'Bill of Lading', status: 'en attente' },
  { id: 'origin', label: 'Certificat d\'origine', status: 'en attente' },
];

export default function InternationalDocumentsPage() {
  const params = useParams();
  const id = params.id as string;
  const [offer, setOffer] = useState<InternationalOffer | undefined | null>(undefined);

  useEffect(() => {
    fetch(`/api/international/offers/${id}`)
      .then((res) => res.json())
      .then((data) => setOffer(data.offer ?? null))
      .catch(() => setOffer(getInternationalOffer(id) ?? null));
  }, [id]);

  if (offer === undefined) return <div className="p-shamar-32 text-center text-shamar-body text-gray-500">Chargement...</div>;
  if (!offer) {
    return (
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 py-shamar-48 text-center">
          <h2 className="text-shamar-h3 text-gray-900 mb-shamar-16">Documents introuvables</h2>
          <Link href="/international" className="text-primary-600 font-semibold hover:underline">Retour</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <Link href={`/international/tracking/${id}`} className="inline-flex items-center gap-2 text-shamar-body text-gray-500 hover:text-primary-600 mb-shamar-24">
          <ArrowLeft size={20} /> Retour au suivi
        </Link>
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <h1 className="text-shamar-h2 text-gray-900 mb-2">Documents douane</h1>
          <p className="text-shamar-body text-gray-600 mb-shamar-32">{offer.product} — {offer.supplier_name}</p>

          <div className="space-y-shamar-16">
            {DOCS.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-shamar-16 bg-gray-50 rounded-shamar-md">
                <div className="flex items-center gap-shamar-12">
                  <FileText className="text-gray-500" size={24} />
                  <div>
                    <p className="font-semibold text-gray-900">{doc.label}</p>
                    <p className={`text-shamar-small ${doc.status === 'disponible' ? 'text-primary-600' : 'text-gray-500'}`}>
                      {doc.status === 'disponible' ? 'Télécharger' : 'En attente'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {doc.status === 'disponible' && (
                    <button className="p-2 rounded-shamar-md bg-primary-100 text-primary-600 hover:bg-primary-200">
                      <Download size={18} />
                    </button>
                  )}
                  <button className="p-2 rounded-shamar-md bg-gray-100 text-gray-600 hover:bg-gray-200">
                    <Upload size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
