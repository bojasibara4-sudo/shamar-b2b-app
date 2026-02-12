'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Shield } from 'lucide-react';
import { getHostProperty } from '@/lib/host-properties';
import { useAuth } from '@/hooks/useAuth';

export default function HostBookingPage() {
  const params = useParams();
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [nights, setNights] = useState(2);

  const id = params.id as string;
  const property = getHostProperty(id);

  useEffect(() => {
    if (!authLoading && !profile) {
      router.push('/auth/login?redirect=/host/booking/' + id);
    }
  }, [profile, authLoading, router, id]);

  if (!property) {
    return (
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 py-shamar-48 text-center">
          <h2 className="text-shamar-h3 text-gray-900 mb-shamar-16">Logement introuvable</h2>
          <Link href="/host" className="text-primary-600 font-semibold hover:underline">Retour au catalogue</Link>
        </div>
      </div>
    );
  }

  const subtotal = property.price_per_night * nights;
  const commission = Math.round(subtotal * 0.05);
  const total = subtotal + commission;

  const handlePay = () => {
    router.push('/host/booking/' + id + '/success');
  };

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <Link href={`/host/${id}`} className="inline-flex items-center gap-2 text-shamar-body font-medium text-gray-500 hover:text-primary-600 mb-shamar-32">
          <ArrowLeft size={20} /> Retour à la fiche
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-shamar-32">
          <div>
            <h1 className="text-shamar-h1 text-gray-900 mb-shamar-24">Finaliser la réservation</h1>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 mb-shamar-24 shadow-shamar-soft">
              <div className="flex gap-shamar-16">
                <img src={property.images[0]} alt="" className="w-24 h-24 object-cover rounded-shamar-md" />
                <div>
                  <h2 className="font-semibold text-gray-900">{property.title}</h2>
                  <p className="text-shamar-small text-gray-500">{property.city}</p>
                  <p className="text-primary-600 font-semibold mt-1">{property.price_per_night.toLocaleString()} FCFA/nuit</p>
                </div>
              </div>
              <div className="mt-shamar-16 pt-shamar-16 border-t border-gray-200">
                <label className="block text-shamar-small font-medium text-gray-700 mb-2">Nombre de nuits</label>
                <input
                  type="number"
                  min={1}
                  value={nights}
                  onChange={(e) => setNights(parseInt(e.target.value) || 1)}
                  className="w-24 px-3 py-2 border border-gray-200 rounded-shamar-md text-gray-900"
                />
              </div>
            </div>
            <div className="bg-primary-50/50 rounded-shamar-md p-shamar-16 flex items-center gap-shamar-12 border border-primary-500/20">
              <Shield className="text-primary-600 flex-shrink-0" size={24} />
              <p className="text-shamar-small text-gray-700">
                Paiement sécurisé par <strong>Escrow Shamar</strong>. L&apos;argent est bloqué jusqu&apos;à la fin du séjour.
              </p>
            </div>
          </div>

          <div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-24 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-shamar-16">Récapitulatif</h3>
              <div className="space-y-2 mb-shamar-16">
                <div className="flex justify-between text-shamar-body text-gray-600">
                  <span>{property.price_per_night.toLocaleString()} FCFA × {nights} nuit(s)</span>
                  <span>{subtotal.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-shamar-body text-gray-600">
                  <span>Commission plateforme (5%)</span>
                  <span>{commission.toLocaleString()} FCFA</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-shamar-16 flex justify-between font-semibold text-shamar-body">
                <span className="text-gray-900">Total</span>
                <span className="text-primary-600">{total.toLocaleString()} FCFA</span>
              </div>
              <button
                onClick={handlePay}
                className="w-full mt-shamar-24 py-4 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <CreditCard size={20} />
                Payer sécurisé (Escrow)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
