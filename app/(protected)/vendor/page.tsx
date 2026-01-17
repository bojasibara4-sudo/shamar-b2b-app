import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { Package, ShoppingCart, TrendingUp, Store } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function VendorPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  if (user.role !== 'seller') {
    redirect('/dashboard');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
              Espace <span className="text-indigo-600">Vendeur</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium">
              Gérez vos produits, commandes et statistiques
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/dashboard/seller/products"
            className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 hover:shadow-xl hover:-translate-y-2 transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-emerald-100 rounded-xl">
                <Package className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Mes produits</h3>
            <p className="text-sm text-slate-500 font-medium">Gérer mes produits</p>
          </Link>

          <Link
            href="/dashboard/seller/orders"
            className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 hover:shadow-xl hover:-translate-y-2 transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-blue-100 rounded-xl">
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Mes commandes</h3>
            <p className="text-sm text-slate-500 font-medium">Voir mes ventes</p>
          </Link>

          <Link
            href="/dashboard/seller/analytics"
            className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 hover:shadow-xl hover:-translate-y-2 transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-purple-100 rounded-xl">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Analytiques</h3>
            <p className="text-sm text-slate-500 font-medium">Statistiques de vente</p>
          </Link>

          <Link
            href="/dashboard/seller/onboarding"
            className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 hover:shadow-xl hover:-translate-y-2 transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-orange-100 rounded-xl">
                <Store className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Ma boutique</h3>
            <p className="text-sm text-slate-500 font-medium">Gérer ma boutique</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
