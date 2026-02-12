import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ProfileKycPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  const supabase = await createClient();
  const { data: profile } = await (supabase as any).from('users').select('kyc_status, identity_verified, face_verified').eq('id', user.id).single();
  const status = profile?.kyc_status || 'non vérifié';

  return (
    <div className="max-w-shamar-container mx-auto px-4 py-shamar-24">
      <Link href="/profile" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 mb-shamar-24">← Retour Pour moi</Link>
      <h1 className="text-shamar-h2 text-gray-900">Vérification identité (KYC)</h1>
      <p className="text-shamar-body text-gray-500 mt-1">Carte identité / passeport, selfie, reconnaissance faciale. Obligatoire pour ouvrir boutique, paiements élevés, sourcing.</p>
      <div className="mt-shamar-24 bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
        <p className="font-medium text-gray-700 text-shamar-body">Statut : <span className="capitalize">{status}</span></p>
        <p className="text-gray-500 text-shamar-small mt-2">Documents à déposer dans l’onboarding vendeur ou la section documents.</p>
        {user.role === 'seller' && (
          <Link href="/dashboard/seller/kyc" className="inline-block mt-shamar-16 text-primary-600 font-medium hover:underline text-shamar-body">Accéder à la vérification vendeur →</Link>
        )}
        {user.role !== 'seller' && (
          <Link href="/onboarding" className="inline-block mt-shamar-16 text-primary-600 font-medium hover:underline text-shamar-body">Compléter mon profil →</Link>
        )}
      </div>
    </div>
  );
}
