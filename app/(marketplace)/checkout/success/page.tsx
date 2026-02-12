'use client';

import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-80">
      <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-48 shadow-shamar-soft text-center animate-in fade-in zoom-in duration-500 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary-600 rounded-t-shamar-md" />

        <div className="w-24 h-24 bg-success-500/20 rounded-full flex items-center justify-center mx-auto mb-shamar-32">
          <CheckCircle className="text-success-500" size={48} strokeWidth={2} />
        </div>

        <h1 className="text-shamar-h1 text-gray-900 mb-shamar-16 tracking-tight">
          Commande confirmée !
        </h1>
        <p className="text-shamar-body text-gray-500 font-medium mb-shamar-40 max-w-md mx-auto leading-relaxed">
          Merci pour votre confiance. Vous recevrez un email de confirmation avec les détails de votre commande.
        </p>

        <div className="flex flex-col sm:flex-row gap-shamar-16 justify-center">
          <Link
            href="/dashboard/buyer/orders"
            className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white py-shamar-16 px-shamar-32 rounded-shamar-md font-semibold hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all"
          >
            Suivre ma commande
            <ArrowRight size={20} />
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-gray-0 border-2 border-gray-200 text-gray-700 py-shamar-16 px-shamar-32 rounded-shamar-md font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            Continuer mes achats
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
