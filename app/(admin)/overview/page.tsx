import { requireAdmin } from '@/lib/auth-guard';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  await requireAdmin();

  const supabase = await createClient();
  
  // Statistiques globales
  const [usersCount, productsCount, ordersCount] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Vue d'ensemble Admin
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Utilisateurs</h3>
          <p className="text-3xl font-bold text-gray-900">
            {usersCount.count || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Produits</h3>
          <p className="text-3xl font-bold text-gray-900">
            {productsCount.count || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Commandes</h3>
          <p className="text-3xl font-bold text-gray-900">
            {ordersCount.count || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
