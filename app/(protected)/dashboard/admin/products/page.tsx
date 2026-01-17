import { requireAdmin } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { productsDB, usersDB } from '@/lib/mock-data';
import DeleteAdminProductButton from '@/components/DeleteAdminProductButton';
import { Package } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  requireAdmin();

  const products = productsDB.getAll();
  const allUsers = usersDB.getAll();
  const userMap = new Map(allUsers.map((u) => [u.id, u.email]));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                Gestion des <span className="text-orange-600">Produits</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium">
                Gérez tous les produits de la plateforme
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-900">Liste des produits ({products.length})</h2>
            <Link
              href="/dashboard/seller/products/new"
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
            >
              <Package size={20} />
              Ajouter un produit
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Aucun produit</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                      Vendeur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-slate-900">
                        {p.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                        {p.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-slate-900">
                        {p.price.toFixed(2)} €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                        {userMap.get(p.sellerId) || p.sellerId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <DeleteAdminProductButton
                          productId={p.id}
                          productName={p.name}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
