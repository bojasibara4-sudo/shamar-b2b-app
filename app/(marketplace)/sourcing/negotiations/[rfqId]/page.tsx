import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function SourcingNegotiationPage({ params }: { params: Promise<{ rfqId: string }> }) {
  const { rfqId } = await params;
  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <Link href="/sourcing/rfq" className="inline-flex items-center gap-2 text-shamar-small font-medium text-gray-500 hover:text-primary-600 mb-shamar-16">
            <ArrowLeft size={16} /> Retour aux RFQ
          </Link>
          <h1 className="text-shamar-h2 text-gray-900">Négociation — RFQ {rfqId.slice(0, 8)}</h1>
          <p className="text-shamar-body text-gray-500">Chat fournisseur, traduction, pièces jointes, devis comparés, contre-offre, assistant IA.</p>
          <div className="p-shamar-24 rounded-shamar-md border border-gray-200 bg-gray-0 shadow-shamar-soft">
            <Link href={`/rfq/${rfqId}`} className="text-primary-600 font-semibold hover:underline">Ouvrir RFQ produit</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
