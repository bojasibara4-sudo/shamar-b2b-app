import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import LandingPage from '@/components/layout/LandingPage';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Si l'utilisateur est authentifié, rediriger immédiatement vers le dashboard
  if (session) {
    redirect('/dashboard');
  }

  // Sinon, afficher la landing page
  return <LandingPage />;
}
