import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminLoginClient from './AdminLoginClient';

export const dynamic = 'force-dynamic';

/**
 * Page de connexion administration.
 * Route : /admin/login
 * Si déjà connecté et admin → redirect /dashboard/admin (nouveau écran redesigné).
 * Sinon affiche le formulaire (ou redirect vers auth avec returnUrl).
 */
export default async function AdminLoginPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    const { data: profile } = await (supabase as any)
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();
    if (profile?.role === 'admin') {
      redirect('/dashboard/admin');
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <AdminLoginClient returnUrl="/dashboard/admin" />
    </div>
  );
}
