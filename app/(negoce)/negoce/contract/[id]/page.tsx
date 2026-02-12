'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileSignature, CreditCard } from 'lucide-react';
import type { NegoceOffer } from '@/lib/negoce-offers';
import { getNegoceOffer } from '@/lib/negoce-offers';

export default function NegoceContractPage() {
  const params = useParams();
  const id = params.id as string;
  const [offer, setOffer] = useState<NegoceOffer | null>(null);

  useEffect(() => {
    fetch(`/api/negoce/offers/${id}`)
      .then((res) => res.json())
      .then((data) => setOffer(data.offer ?? null))
      .catch(() => setOffer(getNegoceOffer(id) ?? null));
  }, [id]);

  if (!offer) return <div className="py-shamar-48 text-center text-shamar-body text-gray-500">Chargement...</div>;
  const total = offer.price_indicator * offer.moq;

  return (
    <div className="space-y-shamar-32">
      <Link href={`/negoce/${id}`} className="inline-flex gap-2 text-shamar-body text-gray-500 hover:text-primary-600">← Retour</Link>
      <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
        <h1 className="text-shamar-h2 text-gray-900 mb-shamar-24">Contrat officiel</h1>
        <div className="space-y-shamar-16 mb-shamar-32 text-gray-600">
          <p>Fournisseur : {offer.supplier_name}</p>
          <p>Produit : {offer.product} • Quantité : {offer.moq} {offer.moq_unit}</p>
          <p>Prix total : {total.toLocaleString()} {offer.currency} • {offer.incoterm}</p>
        </div>
        <div className="flex gap-shamar-16">
          <button className="inline-flex gap-2 px-shamar-24 py-3 bg-gray-800 text-gray-0 font-semibold rounded-shamar-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            <FileSignature size={20} /> Signer
          </button>
          <Link href={`/payments/escrow/${id}`} className="inline-flex gap-2 px-shamar-24 py-3 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
            <CreditCard size={20} /> Payer escrow
          </Link>
        </div>
      </div>
    </div>
  );
}
