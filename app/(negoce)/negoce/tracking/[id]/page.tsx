'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Ship, MapPin, FileText, AlertTriangle } from 'lucide-react';
import type { NegoceOffer } from '@/lib/negoce-offers';
import { getNegoceOffer } from '@/lib/negoce-offers';

const STEPS = [
  { id: 'prep', label: 'Préparation', icon: Package },
  { id: 'loaded', label: 'Chargement', icon: Package },
  { id: 'transport', label: 'Transport', icon: Ship },
  { id: 'port', label: 'Port', icon: MapPin },
  { id: 'customs', label: 'Douane', icon: FileText },
  { id: 'delivered', label: 'Livraison', icon: Package },
];

export default function NegoceTrackingPage() {
  const params = useParams();
  const id = params.id as string;
  const [offer, setOffer] = useState<NegoceOffer | null>(null);
  const currentStep = 2;

  useEffect(() => {
    fetch(`/api/negoce/offers/${id}`)
      .then((res) => res.json())
      .then((data) => setOffer(data.offer ?? null))
      .catch(() => setOffer(getNegoceOffer(id) ?? null));
  }, [id]);

  if (!offer) return <div className="py-shamar-48 text-center text-shamar-body text-gray-500">Chargement...</div>;

  return (
    <div className="space-y-shamar-32">
      <Link href={`/negoce/${id}`} className="inline-flex gap-2 text-shamar-body text-gray-500 hover:text-primary-600">← Retour</Link>
      <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
        <h1 className="text-shamar-h2 text-gray-900 mb-2">Suivi logistique</h1>
        <p className="text-shamar-body text-gray-500 mb-shamar-32">{offer.product} — {offer.supplier_name}</p>
        <div className="space-y-shamar-24">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isDone = i < currentStep;
            const isCurrent = i === currentStep;
            return (
              <div key={step.id} className="flex gap-shamar-16">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-gray-0 ${
                  isDone ? 'bg-success-500' :
                  isCurrent ? 'bg-primary-600 ring-4 ring-primary-500/30' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className={`font-semibold ${isCurrent ? 'text-primary-600' : 'text-gray-900'}`}>{step.label}</p>
                  {isCurrent && <p className="text-shamar-small text-gray-500">En cours</p>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-shamar-16 mt-shamar-32 pt-shamar-32 border-t border-gray-200">
          <Link href="/messages" className="px-shamar-24 py-3 border border-gray-200 text-gray-700 font-medium rounded-shamar-md hover:bg-gray-50">Contacter transitaire</Link>
          <Link href="/dashboard/negoce/disputes" className="inline-flex gap-2 px-shamar-24 py-3 text-warning-500 font-medium hover:underline"><AlertTriangle size={18} /> Signaler problème</Link>
        </div>
      </div>
    </div>
  );
}
