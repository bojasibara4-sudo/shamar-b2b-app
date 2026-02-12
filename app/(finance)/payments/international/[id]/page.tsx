'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Shield } from 'lucide-react';
import type { InternationalOffer } from '@/lib/international-offers';
import { getInternationalOffer } from '@/lib/international-offers';
import { useAuth } from '@/hooks/useAuth';

export default function InternationalPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const id = params.id as string;
  const [offer, setOffer] = useState<InternationalOffer | undefined | null>(undefined);

  useEffect(() => {
    fetch(`/api/international/offers/${id}`)
      .then((res) => res.json())
      .then((data) => setOffer(data.offer ?? null))
      .catch(() => setOffer(getInternationalOffer(id) ?? null));
  }, [id]);

  if (loading) return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto py-shamar-48 px-4 text-center text-gray-500 text-shamar-body font-medium">Chargement...</div>
    </div>
  );
  if (!user) {
    router.push('/auth/login?redirect=/payments/international/' + id);
    return null;
  }

  if (offer === undefined) return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto py-shamar-48 px-4 text-center text-gray-500 text-shamar-body font-medium">Chargement...</div>
    </div>
  );
  if (!offer) {
    return (
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 py-shamar-48 text-center">
          <h2 className="text-shamar-h2 text-gray-900 mb-shamar-16 font-semibold">Paiement introuvable</h2>
          <Link href="/international" className="text-primary-600 font-semibold hover:underline text-shamar-body">Retour</Link>
        </div>
      </div>
    );
  }

  const amount = offer.price_bulk * offer.moq;
  const commission = Math.round(amount * 0.02);
  const total = amount + commission;

  const handlePay = async () => {
    await new Promise((r) => setTimeout(r, 1000));
    router.push('/international/tracking/' + id);
  };

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <Link href={`/international/contract/${id}`} className="inline-flex items-center gap-2 text-gray-600 font-medium hover:text-primary-600 mb-shamar-24 text-shamar-body">
          <ArrowLeft size={20} /> Retour
        </Link>
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">Paiement escrow international</h1>
          <p className="text-gray-600 text-shamar-body font-medium mb-shamar-24">{offer.product} — {offer.supplier_name}</p>

          <div className="space-y-shamar-16 mb-shamar-32">
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600 text-shamar-body font-medium">Montant</span>
              <span className="font-semibold text-gray-900 text-shamar-body">{amount.toLocaleString()} {offer.currency}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600 text-shamar-body font-medium">Commission Shamar (2%)</span>
              <span className="font-semibold text-gray-900 text-shamar-body">{commission.toLocaleString()} {offer.currency}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="font-semibold text-gray-900 text-shamar-body">Total</span>
              <span className="font-bold text-primary-600 text-shamar-body">{total.toLocaleString()} {offer.currency}</span>
            </div>
          </div>

          <p className="text-shamar-small text-gray-500 mb-shamar-24 flex items-center gap-2 font-medium">
            <Shield size={18} className="text-primary-600" /> Paiement sécurisé — L'argent est bloqué jusqu'à livraison confirmée
          </p>

          <div className="flex flex-wrap gap-shamar-16">
            <button
              onClick={handlePay}
              className="inline-flex items-center gap-2 px-shamar-24 py-3 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700 text-shamar-body"
            >
              <CreditCard size={22} /> Payer sécurisé
            </button>
            <Link href={`/international/contract/${id}`} className="px-shamar-24 py-3 border border-gray-200 rounded-shamar-md font-semibold text-gray-700 hover:bg-gray-50 text-shamar-body">
              Annuler
            </Link>
          </div>

          <p className="text-shamar-caption text-gray-400 mt-shamar-24 font-medium">États : escrow_locked → shipped → delivered → released</p>
        </div>
      </div>
    </div>
  );
}
