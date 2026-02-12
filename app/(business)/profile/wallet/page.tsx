import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import WalletCard from '@/components/profile/WalletCard';

export const dynamic = 'force-dynamic';

export default async function ProfileWalletPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  return (
    <div className="max-w-shamar-container mx-auto px-4 py-shamar-24">
      <Link href="/profile" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 mb-shamar-24">← Retour Pour moi</Link>
      <h1 className="text-shamar-h2 text-gray-900">Wallet</h1>
      <p className="text-shamar-body text-gray-500 mt-1">Solde, escrow bloqué, disponible, retraits.</p>
      <div className="mt-shamar-24">
        <WalletCard showPayout={user.role === 'seller' || user.role === 'admin'} />
      </div>
    </div>
  );
}
