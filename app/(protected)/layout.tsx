import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) redirect('/auth/login');

    const user = await getCurrentUser();
    if (!user) redirect('/auth/login');
  } catch {
    redirect('/auth/login');
  }

  // IMPORTANT : AUCUN WRAPPER CLIENT ICI
  return <>{children}</>;
}