import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function ProfileBadgesPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  return (
    <div className="max-w-shamar-container mx-auto px-4 py-shamar-24">
      <Link href="/profile" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 mb-shamar-24">← Retour Pour moi</Link>
      <h1 className="text-shamar-h2 text-gray-900">Badges & confiance</h1>
      <p className="text-shamar-body text-gray-500 mt-1">Bronze, silver, gold, diamond, score, critères obtention.</p>
      <div className="mt-shamar-24 bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
        <Link href="/badges" className="text-primary-600 font-medium hover:underline text-shamar-body">Voir les badges Shamar →</Link>
        {user.role === 'seller' && (
          <>
            <span className="mx-2 text-gray-400">|</span>
            <Link href="/dashboard/seller/badge" className="text-primary-600 font-medium hover:underline text-shamar-body">Mon badge vendeur</Link>
          </>
        )}
      </div>
    </div>
  );
}
