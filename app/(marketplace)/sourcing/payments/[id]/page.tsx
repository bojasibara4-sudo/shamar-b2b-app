import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function SourcingPaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <Link href="/sourcing/payments" className="inline-flex items-center gap-2 text-shamar-small font-medium text-gray-500 hover:text-primary-600 mb-shamar-16">
            <ArrowLeft size={16} /> Retour aux paiements
          </Link>
          <h1 className="text-shamar-h2 text-gray-900">Paiement {id.slice(0, 8)}</h1>
          <p className="text-shamar-body text-gray-500">Montant, commission, statut escrow, libérer fonds, litige.</p>
          <div className="p-shamar-24 rounded-shamar-md border border-gray-200 bg-gray-0 shadow-shamar-soft text-gray-600">
            Détail à connecter. <Link href={`/payments/escrow/${id}`} className="text-primary-600 font-semibold hover:underline">Page escrow existante</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}
