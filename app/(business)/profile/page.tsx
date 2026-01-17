import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import ProfileForm from '@/components/ProfileForm';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function BusinessProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const supabase = await createClient();
  
  // Récupérer le profil complet
  const { data: profile } = await (supabase as any)
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
            Mon <span className="text-emerald-600">Profil</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Gérez vos informations personnelles et professionnelles
          </p>
        </div>
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
          <ProfileForm user={user} profile={profile || {}} />
        </div>
      </div>
    </div>
  );
}
