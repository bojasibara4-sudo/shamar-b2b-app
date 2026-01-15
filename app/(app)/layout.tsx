import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import GlobalUserMenu from '@/components/GlobalUserMenu';

export const dynamic = 'force-dynamic';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user;
  
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      redirect('/auth/login');
    }

    user = await getCurrentUser();
    if (!user) {
      redirect('/auth/login');
    }
  } catch (error) {
    // En cas d'erreur (ex: Supabase indisponible), rediriger vers login
    console.error('Error in AppLayout:', error);
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a href="/app/dashboard" className="text-xl font-bold text-emerald-600">
                SHAMAR B2B
              </a>
            </div>
            <div className="flex items-center gap-4">
              <GlobalUserMenu user={user} />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
