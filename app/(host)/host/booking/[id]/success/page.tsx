'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function HostBookingSuccessPage() {
  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 py-shamar-64 text-center">
        <div className="w-20 h-20 bg-success-500/20 rounded-full flex items-center justify-center mx-auto mb-shamar-24">
          <CheckCircle className="text-success-500" size={48} />
        </div>
        <h1 className="text-shamar-h2 text-gray-900 mb-2">Réservation confirmée !</h1>
        <p className="text-shamar-body text-gray-600 mb-shamar-32">
          Votre paiement a été sécurisé par Escrow. L&apos;hôte va confirmer votre réservation.
        </p>
        <div className="flex flex-col sm:flex-row gap-shamar-16 justify-center">
          <Link
            href="/dashboard/guest"
            className="px-shamar-24 py-3 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700 transition-colors"
          >
            Mes réservations
          </Link>
          <Link
            href="/host"
            className="px-shamar-24 py-3 border border-gray-200 font-medium text-gray-700 rounded-shamar-md hover:bg-gray-50 transition-colors"
          >
            Découvrir d&apos;autres logements
          </Link>
        </div>
      </div>
    </div>
  );
}
