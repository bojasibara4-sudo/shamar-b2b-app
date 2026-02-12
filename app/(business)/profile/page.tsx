import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import ProfileHub from '@/components/profile/ProfileHub';
import ProfileDashboardCards from '@/components/profile/ProfileDashboardCards';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function BusinessProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }
  const supabase = await createClient();
  const { data: profile } = await (supabase as any).from('users').select('full_name, phone, country, city, region, kyc_status').eq('id', user.id).single();

  const isSeller = user.role === 'seller' || user.role === 'admin';

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-shamar-24 lg:py-shamar-32">
      <ProfileDashboardCards isSeller={isSeller} />
      <ProfileHub user={user} profile={profile ?? null} />
    </div>
  );
}
