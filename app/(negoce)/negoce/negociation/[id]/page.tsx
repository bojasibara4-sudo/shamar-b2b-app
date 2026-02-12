'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { NegoceOffer } from '@/lib/negoce-offers';
import { getNegoceOffer } from '@/lib/negoce-offers';

const ROWS = [
  { role: 'Fournisseur', qty: '—', price: '2 800 USD/t', delay: '14 j', status: 'open' },
  { role: 'Acheteur', qty: '25 t', price: '2 650 USD/t', delay: '21 j', status: 'counter' },
  { role: 'Fournisseur', qty: '25 t', price: '2 700 USD/t', delay: '14 j', status: 'counter' },
];

export default function NegoceNegociationPage() {
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

  return (
    <div className="space-y-shamar-32">
      <Link href={`/negoce/${id}`} className="inline-flex gap-2 text-shamar-body text-gray-500 hover:text-primary-600">← Retour</Link>
      <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
        <h1 className="text-shamar-h2 text-gray-900 mb-2">Négociation</h1>
        <p className="text-shamar-body text-gray-500 mb-shamar-32">{offer.product} — {offer.supplier_name}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-shamar-body">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-shamar-16 text-primary-600 font-semibold">Partie</th>
                <th className="pb-shamar-16 text-primary-600 font-semibold">Quantité</th>
                <th className="pb-shamar-16 text-primary-600 font-semibold">Prix unitaire</th>
                <th className="pb-shamar-16 text-primary-600 font-semibold">Délais</th>
                <th className="pb-shamar-16 text-primary-600 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-shamar-16 text-gray-900 font-medium">{r.role}</td>
                  <td className="py-shamar-16 text-gray-600">{r.qty}</td>
                  <td className="py-shamar-16 text-gray-600">{r.price}</td>
                  <td className="py-shamar-16 text-gray-600">{r.delay}</td>
                  <td className="py-shamar-16"><span className="px-2 py-1 rounded-shamar-sm text-shamar-small font-semibold bg-warning-500/20 text-gray-800">{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-shamar-16 mt-shamar-32 pt-shamar-32 border-t border-gray-200">
          <Link href={`/negoce/contract/${id}`} className="px-shamar-24 py-3 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700">Accepter & Signer</Link>
          <Link href="/messages" className="px-shamar-24 py-3 border border-gray-200 text-gray-700 font-medium rounded-shamar-md hover:bg-gray-50">Message</Link>
        </div>
      </div>
    </div>
  );
}
