'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, Ship, MapPin, FileText, AlertTriangle } from 'lucide-react';
import type { InternationalOffer } from '@/lib/international-offers';
import { getInternationalOffer } from '@/lib/international-offers';

const STEPS = [
  { id: 'prep', label: 'Préparation', icon: Package },
  { id: 'factory', label: 'En usine', icon: Package },
  { id: 'loaded', label: 'Chargé container', icon: Ship },
  { id: 'sea', label: 'En mer', icon: Ship },
  { id: 'port', label: 'Port arrivée', icon: MapPin },
  { id: 'customs', label: 'Douane', icon: FileText },
  { id: 'delivered', label: 'Livraison finale', icon: Package },
];

export default function InternationalTrackingPage() {
  const params = useParams();
  const id = params.id as string;
  const [offer, setOffer] = useState<InternationalOffer | undefined | null>(undefined);

  useEffect(() => {
    fetch(`/api/international/offers/${id}`)
      .then((res) => res.json())
      .then((data) => setOffer(data.offer ?? null))
      .catch(() => setOffer(getInternationalOffer(id) ?? null));
  }, [id]);

  const currentStep = 2;

  if (offer === undefined) return <div className="p-shamar-32 text-center text-shamar-body text-gray-500">Chargement...</div>;
  if (!offer) {
    return (
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 py-shamar-48 text-center">
          <h2 className="text-shamar-h3 text-gray-900 mb-shamar-16">Suivi introuvable</h2>
          <Link href="/international" className="text-primary-600 font-semibold hover:underline">Retour</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <Link href={`/international/${id}`} className="inline-flex items-center gap-2 text-shamar-body text-gray-500 hover:text-primary-600 mb-shamar-24">
          <ArrowLeft size={20} /> Retour
        </Link>
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <h1 className="text-shamar-h2 text-gray-900 mb-2">Suivi logistique</h1>
          <p className="text-shamar-body text-gray-600 mb-shamar-32">{offer.product} — {offer.supplier_name}</p>

          <div className="relative">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isDone = i < currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={step.id} className="flex gap-shamar-16 mb-shamar-32 last:mb-0">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    isDone ? 'bg-success-500 text-gray-0' :
                    isCurrent ? 'bg-primary-600 text-gray-0 ring-4 ring-primary-200' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${isCurrent ? 'text-primary-600' : 'text-gray-900'}`}>{step.label}</p>
                    {isCurrent && <p className="text-shamar-small text-gray-500 mt-1">En cours</p>}
                    {isDone && <p className="text-shamar-small text-success-500 mt-1">Terminé</p>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-shamar-16 pt-shamar-32 border-t border-gray-200 mt-shamar-32">
            <Link
              href={`/international/documents/${id}`}
              className="inline-flex items-center gap-2 px-shamar-24 py-3 bg-gray-100 text-gray-700 font-semibold rounded-shamar-md hover:bg-gray-200"
            >
              <FileText size={20} /> Documents douane
            </Link>
            <Link href="/messages" className="inline-flex items-center gap-2 px-shamar-24 py-3 border border-gray-200 rounded-shamar-md font-medium text-gray-700 hover:bg-gray-50">
              Contacter transitaire
            </Link>
            <Link href="/dashboard/international/disputes" className="inline-flex items-center gap-2 px-shamar-24 py-3 text-warning-500 font-medium hover:underline">
              <AlertTriangle size={18} /> Ouvrir litige
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
