import { requireAdmin } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { getProductsForAdmin } from '@/services/product.service';
import { getUsersForAdmin } from '@/services/user.service';
import DeleteAdminProductButton from '@/components/DeleteAdminProductButton';
import { Package } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  await requireAdmin();

  const [products, allUsers] = await Promise.all([
    getProductsForAdmin(),
    getUsersForAdmin(),
  ]);
  const userMap = new Map(allUsers.map((u) => [u.id, u.email]));

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-shamar-16">
            <div className="flex items-center gap-shamar-16">
              <div className="p-3 bg-primary-100 rounded-shamar-md">
                <Package className="text-primary-600" size={28} />
              </div>
              <div>
                <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-1">
                  Gestion des <span className="text-primary-600">Produits</span>
                </h1>
                <p className="text-shamar-body text-gray-500 font-medium">
                  Gérez tous les produits de la plateforme
                </p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-32">
          <div className="flex items-center justify-between mb-shamar-24">
            <h2 className="text-shamar-h3 font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary-500 rounded-full block"></span>
              Liste des produits <span className="text-primary-600 text-shamar-small bg-primary-100 px-2 py-0.5 rounded-shamar-sm font-semibold">{products.length}</span>
            </h2>
            <Link
              href="/dashboard/seller/products"
              className="flex items-center gap-2 bg-primary-600 text-white px-shamar-16 py-2 rounded-shamar-md font-semibold hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <Package size={20} />
              Voir les produits vendeurs
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-shamar-48 bg-gray-50 rounded-shamar-md border border-gray-200">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-shamar-16">
                <Package className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium text-shamar-body">Aucun produit disponible</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-shamar-md border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-700 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-700 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-700 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-700 uppercase tracking-wider">
                      Vendeur
                    </th>
                    <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-0 divide-y divide-gray-200">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-shamar-24 py-shamar-16 whitespace-nowrap text-shamar-small font-semibold text-gray-900">
                        {p.name}
                      </td>
                      <td className="px-shamar-24 py-shamar-16 text-shamar-small text-gray-600 font-medium truncate max-w-xs">
                        {p.description}
                      </td>
                      <td className="px-shamar-24 py-shamar-16 whitespace-nowrap text-shamar-small font-semibold text-gray-900">
                        {p.price.toFixed(2)} €
                      </td>
                      <td className="px-shamar-24 py-shamar-16 whitespace-nowrap text-shamar-small text-gray-600 font-medium">
                        {userMap.get(p.seller_id) || p.seller_id}
                      </td>
                      <td className="px-shamar-24 py-shamar-16 whitespace-nowrap text-shamar-small">
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
    </div>
  );
}
