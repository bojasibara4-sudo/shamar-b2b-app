import { requireAdmin } from '@/lib/auth-guard';
import { createClient } from '@/lib/supabase/server';
import { Users, Package, ShoppingBag } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
              Vue d'ensemble <span className="text-orange-600">Admin</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium">
              Statistiques globales de la plateforme
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500">Utilisateurs</h3>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-4xl font-black text-slate-900">
              {usersCount.count || 0}
            </p>
          </div>
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500">Produits</h3>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-4xl font-black text-slate-900">
              {productsCount.count || 0}
            </p>
          </div>
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500">Commandes</h3>
              <ShoppingBag className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-4xl font-black text-slate-900">
              {ordersCount.count || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
