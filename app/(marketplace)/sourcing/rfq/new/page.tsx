'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

/**
 * /sourcing/rfq/new — Nouvelle demande de devis (sourcing).
 * Formulaire : produit, quantité, budget cible, spécifications, fichiers, date limite, pays livraison.
 * Envoyer à plusieurs fournisseurs, suggestion IA (Perplexity).
 */
export default function SourcingRfqNewPage() {
  const router = useRouter();

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <Link href="/sourcing/rfq" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 text-shamar-small font-medium mb-shamar-24">
          <ArrowLeft size={16} /> Retour aux RFQ
        </Link>
        <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Nouvelle demande de devis</h1>
        <p className="mt-1 text-shamar-body text-gray-500 font-medium">Produit, quantité, budget cible, spécifications, fichiers, date limite, pays livraison. Envoi à plusieurs fournisseurs, suggestion IA.</p>

        <div className="mt-shamar-32 p-shamar-24 rounded-shamar-md border border-gray-200 bg-gray-0 shadow-shamar-soft space-y-shamar-16">
          <p className="text-shamar-body text-gray-600 font-medium">Formulaire complet à connecter (champs + API RFQ sourcing).</p>
          <button
            type="button"
            onClick={() => router.push('/rfq/new')}
            className="px-shamar-16 py-2 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-shamar-body"
          >
            Utiliser la demande devis produit (RFQ existant)
          </button>
        </div>
      </div>
    </div>
  );
}
