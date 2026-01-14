import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth-guard';

export default async function DashboardPage() {
  const user = requireAuth();

  // Rediriger selon le rôle
  switch (user.role) {
    case 'admin':
      redirect('/dashboard/admin');
    case 'seller':
      redirect('/dashboard/seller');
    case 'buyer':
      redirect('/dashboard/buyer');
    default:
      redirect('/auth/login');
  }
}
