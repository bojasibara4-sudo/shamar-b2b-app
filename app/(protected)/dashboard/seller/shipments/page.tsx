import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * Suivi expéditions vendeur — même contenu que /dashboard/seller/deliveries
 * Redirection pour cohérence avec la spec (route /dashboard/seller/shipments).
 */
export default async function SellerShipmentsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  redirect('/dashboard/seller/deliveries');
}
