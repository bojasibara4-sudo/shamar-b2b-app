import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { CreditCard, Smartphone, Building2, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

/**
 * Moyens de paiement — sous « Pour moi » (spec: /wallet/methods)
 * Mobile Money, Carte, Banque, Ajouter méthode.
 */
export default async function ProfileWalletMethodsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  return (
    <div className="max-w-shamar-container mx-auto px-4 py-shamar-24">
      <Link href="/profile/wallet" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 mb-shamar-24">← Retour Wallet</Link>
      <h1 className="text-shamar-h2 text-gray-900">Moyens de paiement</h1>
      <p className="text-shamar-body text-gray-500 mt-1">Mobile Money, Carte, Banque. Ajouter une méthode.</p>

      <div className="mt-shamar-24 bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden shadow-shamar-soft">
        <div className="p-shamar-16 border-b border-gray-200 flex items-center gap-3">
          <Smartphone size={24} className="text-primary-600" />
          <div>
            <p className="font-semibold text-gray-900 text-shamar-body">Mobile Money</p>
            <p className="text-gray-500 text-shamar-small">Orange Money, MTN, Moov… (à brancher)</p>
          </div>
        </div>
        <div className="p-shamar-16 border-b border-gray-200 flex items-center gap-3">
          <CreditCard size={24} className="text-primary-600" />
          <div>
            <p className="font-semibold text-gray-900 text-shamar-body">Carte bancaire</p>
            <p className="text-gray-500 text-shamar-small">Visa, Mastercard (à brancher)</p>
          </div>
        </div>
        <div className="p-shamar-16 border-b border-gray-200 flex items-center gap-3">
          <Building2 size={24} className="text-primary-600" />
          <div>
            <p className="font-semibold text-gray-900 text-shamar-body">Virement bancaire</p>
            <p className="text-gray-500 text-shamar-small">IBAN, compte (à brancher)</p>
          </div>
        </div>
        <div className="p-shamar-16">
          <Link
            href="/profile/wallet"
            className="inline-flex items-center gap-2 text-primary-600 font-medium hover:underline text-shamar-body"
          >
            <Plus size={18} /> Ajouter une méthode (à brancher)
          </Link>
        </div>
      </div>
    </div>
  );
}
