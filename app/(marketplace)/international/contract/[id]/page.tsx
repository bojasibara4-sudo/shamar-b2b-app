'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileSignature, CreditCard } from 'lucide-react';
import type { InternationalOffer } from '@/lib/international-offers';
import { getInternationalOffer } from '@/lib/international-offers';
import { useAuth } from '@/hooks/useAuth';

export default function InternationalContractPage() {
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

  if (loading) return <div className="p-shamar-32 text-center text-shamar-body text-gray-500">Chargement...</div>;
  if (!user) {
    router.push('/auth/login?redirect=/international/contract/' + id);
    return null;
  }

  if (offer === undefined) return <div className="p-shamar-32 text-center text-shamar-body text-gray-500">Chargement...</div>;
  if (!offer) {
    return (
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 py-shamar-48 text-center">
          <h2 className="text-shamar-h3 text-gray-900 mb-shamar-16">Contrat introuvable</h2>
          <Link href="/international" className="text-primary-600 font-semibold hover:underline">Retour</Link>
        </div>
      </div>
    );
  }

  const totalEst = offer.price_bulk * offer.moq;

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <Link href={`/international/${id}`} className="inline-flex items-center gap-2 text-shamar-body text-gray-500 hover:text-primary-600 mb-shamar-24">
          <ArrowLeft size={20} /> Retour
        </Link>
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <h1 className="text-shamar-h2 text-gray-900 mb-shamar-24">Contrat commercial</h1>

          <div className="space-y-shamar-24 mb-shamar-32">
            <div className="grid grid-cols-2 gap-shamar-16">
              <div className="bg-gray-50 rounded-shamar-md p-shamar-16">
                <p className="text-shamar-caption text-gray-500 font-medium">Acheteur</p>
                <p className="font-semibold text-gray-900">Votre entreprise</p>
              </div>
              <div className="bg-gray-50 rounded-shamar-md p-shamar-16">
                <p className="text-shamar-caption text-gray-500 font-medium">Fournisseur</p>
                <p className="font-semibold text-gray-900">{offer.supplier_name}</p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-shamar-24">
              <p className="text-shamar-body text-gray-600 mb-2"><strong>Produit :</strong> {offer.product}</p>
              <p className="text-shamar-body text-gray-600 mb-2"><strong>Quantité :</strong> {offer.moq.toLocaleString()} {offer.moq_unit}</p>
              <p className="text-shamar-body text-gray-600 mb-2"><strong>Prix total (est.) :</strong> {totalEst.toLocaleString()} {offer.currency}</p>
              <p className="text-shamar-body text-gray-600 mb-2"><strong>Incoterm :</strong> {offer.incoterm}</p>
              <p className="text-shamar-body text-gray-600 mb-2"><strong>Délai livraison :</strong> {offer.lead_time_days} jours</p>
              <p className="text-shamar-small text-gray-500 mt-shamar-16">Pénalités de retard : selon conditions générales Shamar</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-shamar-16 pt-shamar-24 border-t border-gray-200">
            <button
              onClick={() => {}}
              className="inline-flex items-center gap-2 px-shamar-24 py-3 bg-gray-900 text-gray-0 font-semibold rounded-shamar-md hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <FileSignature size={20} /> Signer le contrat
            </button>
            <Link
              href={`/payments/international/${id}`}
              className="inline-flex items-center gap-2 px-shamar-24 py-3 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <CreditCard size={20} /> Payer escrow
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
