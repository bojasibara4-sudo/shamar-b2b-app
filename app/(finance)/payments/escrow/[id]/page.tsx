'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CreditCard, Shield } from 'lucide-react';
import type { NegoceOffer } from '@/lib/negoce-offers';
import { getNegoceOffer } from '@/lib/negoce-offers';

export default function NegoceEscrowPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [offer, setOffer] = useState<NegoceOffer | null>(null);

  useEffect(() => {
    fetch(`/api/negoce/offers/${id}`)
      .then((res) => res.json())
      .then((data) => setOffer(data.offer ?? null))
      .catch(() => setOffer(getNegoceOffer(id) ?? null));
  }, [id]);

  const handlePay = async () => {
    await new Promise((r) => setTimeout(r, 1000));
    router.push(`/negoce/tracking/${id}`);
  };

  if (!offer) return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto py-shamar-48 px-4 text-center text-gray-500 text-shamar-body font-medium">Chargement...</div>
    </div>
  );
  const amount = offer.price_indicator * offer.moq;
  const commission = Math.round(amount * 0.02);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto py-shamar-24 px-4">
        <Link href={`/negoce/contract/${id}`} className="inline-flex gap-2 text-gray-600 font-medium mb-shamar-24 hover:text-primary-600 text-shamar-body">← Retour</Link>
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">Paiement escrow</h1>
          <p className="text-gray-600 text-shamar-body font-medium mb-shamar-24">{offer.product}</p>
          <div className="space-y-shamar-16 mb-shamar-32">
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600 text-shamar-body font-medium">Montant</span>
              <span className="font-semibold text-gray-900 text-shamar-body">{amount.toLocaleString()} {offer.currency}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600 text-shamar-body font-medium">Commission (2%)</span>
              <span className="font-semibold text-gray-900 text-shamar-body">{commission.toLocaleString()} {offer.currency}</span>
            </div>
          </div>
          <p className="text-shamar-small text-gray-500 mb-shamar-24 flex gap-2 items-center font-medium"><Shield size={18} className="text-primary-600" /> Argent bloqué jusqu'à livraison confirmée</p>
          <button onClick={handlePay} className="inline-flex gap-2 px-shamar-24 py-3 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700 text-shamar-body">
            <CreditCard size={22} /> Payer sécurisé
          </button>
        </div>
      </div>
    </div>
  );
}
