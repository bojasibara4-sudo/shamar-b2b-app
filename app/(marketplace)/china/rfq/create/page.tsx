'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const INCOTERMS = ['FOB', 'CIF', 'EXW', 'DDP'];
const DESTINATION_COUNTRIES = ['Sénégal', "Côte d'Ivoire", 'Mali', 'Burkina Faso', 'Nigeria', 'Ghana', 'Cameroun', 'Autre'];

export default function ChinaRfqCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supplierId = searchParams.get('supplier') || '';
  const productIdFromUrl = searchParams.get('product_id') || '';

  const [product, setProduct] = useState(productIdFromUrl);
  const [quantity, setQuantity] = useState('1');
  const [budget, setBudget] = useState('');
  const [incoterm, setIncoterm] = useState('FOB');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [desiredDate, setDesiredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!product.trim() || !quantity || parseInt(quantity, 10) < 1) {
      setError('Produit et quantité requis.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/product-rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product || undefined,
          quantity: parseInt(quantity, 10),
          message: [notes, `Incoterm: ${incoterm}`, destinationCountry && `Pays: ${destinationCountry}`, desiredDate && `Date souhaitée: ${desiredDate}`, budget && `Budget cible: ${budget}`].filter(Boolean).join(' | '),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      router.push(`/china/rfq/${data.rfq?.id || data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="max-w-2xl">
          <Link href={supplierId ? `/china/supplier/${supplierId}` : '/china/suppliers'} className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 font-medium mb-shamar-24">
            <ArrowLeft size={16} /> Retour
          </Link>
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Créer une demande de devis</h1>
          <p className="text-shamar-body text-gray-500 mt-1">Produit, quantité, budget, incoterm, pays destination, date souhaitée.</p>

          <form onSubmit={handleSubmit} className="mt-shamar-32 space-y-shamar-24 bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            {error && <p className="text-danger-500 text-shamar-small font-medium">{error}</p>}

            <div>
              <label className="block text-shamar-small font-semibold text-gray-900 mb-2">ID Produit (catalogue) *</label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="UUID du produit"
                className="w-full px-shamar-16 py-shamar-12 border border-gray-200 rounded-shamar-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <p className="text-shamar-small text-gray-500 mt-1">
                <Link href="/china/categories" className="text-primary-600 hover:underline">Catalogue Chine</Link> — utilisez « Demander un devis » sur une fiche produit pour préremplir l’ID.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-shamar-24">
              <div>
                <label className="block text-shamar-small font-semibold text-gray-900 mb-2">Quantité *</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-shamar-16 py-shamar-12 border border-gray-200 rounded-shamar-md text-gray-900 focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-shamar-small font-semibold text-gray-900 mb-2">Budget cible (devise)</label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Ex: 5000 USD"
                  className="w-full px-shamar-16 py-shamar-12 border border-gray-200 rounded-shamar-md text-gray-900 focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-shamar-24">
              <div>
                <label className="block text-shamar-small font-semibold text-gray-900 mb-2">Incoterm</label>
                <select
                  value={incoterm}
                  onChange={(e) => setIncoterm(e.target.value)}
                  className="w-full px-shamar-16 py-shamar-12 border border-gray-200 rounded-shamar-md text-gray-900 focus:ring-2 focus:ring-primary-500"
                >
                  {INCOTERMS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-shamar-small font-semibold text-gray-900 mb-2">Pays destination</label>
                <select
                  value={destinationCountry}
                  onChange={(e) => setDestinationCountry(e.target.value)}
                  className="w-full px-shamar-16 py-shamar-12 border border-gray-200 rounded-shamar-md text-gray-900 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">—</option>
                  {DESTINATION_COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-shamar-small font-semibold text-gray-900 mb-2">Date livraison souhaitée</label>
              <input
                type="date"
                value={desiredDate}
                onChange={(e) => setDesiredDate(e.target.value)}
                className="w-full px-shamar-16 py-shamar-12 border border-gray-200 rounded-shamar-md text-gray-900 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-shamar-small font-semibold text-gray-900 mb-2">Notes / Spécifications</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Détails, normes, certifications..."
                className="w-full px-shamar-16 py-shamar-12 border border-gray-200 rounded-shamar-md text-gray-900 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <p className="text-shamar-small text-gray-500">Upload de fichiers (spécifications, plans) à brancher sur l’API.</p>

            <div className="flex gap-shamar-16 pt-shamar-16">
              <button
                type="submit"
                disabled={loading}
                className="px-shamar-32 py-shamar-12 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Envoi...' : 'Envoyer la demande'}
              </button>
              <Link href="/china/rfqs" className="px-shamar-32 py-shamar-12 border border-gray-200 text-gray-700 font-semibold rounded-shamar-md hover:bg-gray-50">
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
