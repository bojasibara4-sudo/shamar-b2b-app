import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import ProfileForm from '@/components/ProfileForm';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ProfileEditPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const supabase = await createClient();
  const { data: profile } = await (supabase as any)
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32">
        <div className="flex items-center gap-4">
          <Link href="/profile" className="text-shamar-small text-gray-500 hover:text-primary-600 font-medium">
            ← Retour au profil
          </Link>
        </div>
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-24">
          <h1 className="text-shamar-h2 text-gray-900 mb-shamar-24">Informations du compte</h1>
          <ProfileForm user={user} profile={profile || {}} />
        </div>
      </div>
    </div>
  );
}
