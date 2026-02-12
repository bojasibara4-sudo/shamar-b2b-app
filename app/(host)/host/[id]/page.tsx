'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Star, Users, MessageCircle, Shield, ChevronRight } from 'lucide-react';
import { getHostProperty } from '@/lib/host-properties';

const BADGE_COLORS: Record<string, string> = {
  bronze: 'bg-amber-800 text-amber-100',
  argent: 'bg-slate-400 text-slate-900',
  or: 'bg-amber-500 text-amber-950',
  diamant: 'bg-indigo-400 text-indigo-950',
};

export default function HostPropertyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const property = getHostProperty(id);

  if (!property) {
    return (
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 py-shamar-48 text-center">
          <h2 className="text-shamar-h2 text-gray-900 mb-2">Logement introuvable</h2>
          <Link href="/host" className="text-primary-600 font-semibold hover:underline text-shamar-body">Retour au catalogue</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32">
        <div className="rounded-shamar-md overflow-hidden bg-gray-200 h-[400px]">
          <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-shamar-32">
          <div className="lg:col-span-2 space-y-shamar-24">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-shamar-md text-shamar-caption font-bold uppercase ${BADGE_COLORS[property.host_badge]}`}>
                  Host {property.host_badge}
                </span>
                <span className="flex items-center gap-1 text-gray-600 text-shamar-small">
                  <Star size={16} className="fill-amber-500 text-amber-500" /> {property.rating}
                </span>
              </div>
              <h1 className="text-shamar-h1 text-gray-900">{property.title}</h1>
              <p className="text-gray-600 flex items-center gap-1 mt-1 text-shamar-body">
                <MapPin size={16} /> {property.city}
              </p>
            </div>

            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-shamar-16">Description</h2>
              <p className="text-gray-600 text-shamar-body">{property.description}</p>
            </div>

            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-shamar-16">Équipements</h2>
              <ul className="grid grid-cols-2 gap-2">
                {property.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-gray-600 text-shamar-body">
                    <span className="w-2 h-2 bg-primary-600 rounded-full" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="sticky top-8 bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-24">
              <div className="flex justify-between items-baseline mb-shamar-24">
                <span className="text-shamar-h2 font-semibold text-gray-900">
                  {property.price_per_night.toLocaleString()} <span className="text-shamar-body font-medium text-gray-500">FCFA</span>
                </span>
                <span className="text-gray-500 text-shamar-small">/ nuit</span>
              </div>
              <div className="space-y-3 mb-shamar-24">
                <div className="p-3 bg-gray-50 rounded-shamar-md text-shamar-small text-gray-600">Dates : Sélectionnez</div>
                <div className="p-3 bg-gray-50 rounded-shamar-md text-shamar-small text-gray-600">Voyageurs : 1</div>
              </div>
              <p className="text-shamar-caption text-gray-500 mb-shamar-16">Prix total calculé automatiquement</p>
              <Link
                href={`/host/booking/${property.id}`}
                className="block w-full py-shamar-16 bg-primary-600 text-white text-center font-semibold rounded-shamar-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Réserver
              </Link>
              <Link
                href="/messages"
                className="mt-3 flex items-center justify-center gap-2 text-gray-600 font-medium hover:text-primary-600 transition-colors text-shamar-body"
              >
                <MessageCircle size={18} />
                Contacter l&apos;hôte
              </Link>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
