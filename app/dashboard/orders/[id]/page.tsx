import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login');
  }
  
  // Rediriger selon le rôle vers la route groupée correspondante
  if (user.role === 'buyer') {
    redirect(`/dashboard/buyer/orders/${params.id}`);
  } else if (user.role === 'seller') {
    redirect(`/dashboard/seller/orders/${params.id}`);
  } else if (user.role === 'admin') {
    redirect(`/dashboard/admin/orders`);
  }
  
  redirect('/dashboard/orders');
}
