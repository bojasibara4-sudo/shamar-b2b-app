import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import ProfileOrdersList from '@/components/profile/ProfileOrdersList';

export const dynamic = 'force-dynamic';

export default async function ProfileOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const supabase = await createClient();
  const isBuyer = user.role === 'buyer';
  const column = isBuyer ? 'buyer_id' : 'seller_id';
  const { data: orders } = await (supabase as any)
    .from('orders')
    .select('id, total_amount, currency, status, created_at')
    .eq(column, user.id)
    .order('created_at', { ascending: false })
    .limit(100);

  const list = orders || [];

  return (
    <div className="max-w-shamar-container mx-auto px-4 py-shamar-24">
      <Link href="/profile" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 mb-shamar-24">
        ← Retour Pour moi
      </Link>
      <h1 className="text-shamar-h2 text-gray-900">Mes commandes</h1>
      <p className="text-shamar-body text-gray-500 mt-1">Filtres : en cours, livrées, annulées, litiges.</p>

      <div className="mt-shamar-24">
        <ProfileOrdersList orders={list} />
      </div>

      <p className="mt-shamar-24 text-shamar-small text-gray-500">
        Vue complète :{' '}
        <Link
          href={user.role === 'seller' ? '/dashboard/seller/orders' : user.role === 'admin' ? '/dashboard/admin/orders' : '/dashboard/buyer/orders'}
          className="text-primary-600 hover:underline font-medium"
        >
          Ouvrir le dashboard commandes →
        </Link>
      </p>
    </div>
  );
}
