import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { ArrowLeft, Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ChinaEscrowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const { id } = await params;

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32">
          <Link href="/china/wallet" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 font-medium">
            <ArrowLeft size={16} /> Retour au portefeuille
          </Link>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight flex items-center gap-2">
              <Shield className="text-primary-600" size={28} /> Escrow {id.slice(0, 8)}
            </h1>
            <p className="text-shamar-body text-gray-500 mt-1">Montant, conditions, release manuel, historique.</p>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <p className="text-gray-600 mb-shamar-24">Détail escrow à connecter (API escrow par commande).</p>
            <Link href={`/payments/escrow/${id}`} className="text-primary-600 font-semibold hover:underline">
              Voir la page escrow existante →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
