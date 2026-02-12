import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AdminChinaEscrowsPage() {
  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-24">
          <Link href="/admin/china/dashboard" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 font-medium">
            <ArrowLeft size={16} /> Admin Chine
          </Link>
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight flex items-center gap-2">
            <Shield size={28} className="text-primary-600" /> Gestion escrows
          </h1>
          <p className="text-shamar-body text-gray-500">Paiements bloqués, libération, litiges.</p>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <p className="text-gray-600">Liste des escrows à connecter (API escrow / finance).</p>
            <Link href="/dashboard/admin/payments" className="inline-block mt-shamar-16 text-primary-600 font-semibold hover:underline">
              Voir les paiements admin →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
