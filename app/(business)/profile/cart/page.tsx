import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function ProfileCartPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  return (
    <div className="max-w-shamar-container mx-auto px-4 py-shamar-24">
      <Link href="/profile" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 mb-shamar-24">← Retour Pour moi</Link>
      <h1 className="text-shamar-h2 text-gray-900">Panier</h1>
      <div className="mt-shamar-24 bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
        <Link href="/cart" className="text-primary-600 font-medium hover:underline text-shamar-body">Ouvrir le panier →</Link>
      </div>
    </div>
  );
}
