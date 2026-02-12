import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * Historique transactions — sous « Pour moi » (spec: /wallet/history)
 * Redirige vers l’historique wallet existant.
 */
export default async function ProfileWalletHistoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  redirect('/dashboard/wallet/history');
}
