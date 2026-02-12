import { requireAdmin } from '@/lib/auth-guard';
import { getHostProperties } from '@/lib/host-properties';
import Link from 'next/link';
import { Home } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminHostPropertiesPage() {
  await requireAdmin();

  const properties = getHostProperties();

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <Link href="/dashboard/admin/host" className="text-shamar-small font-medium text-gray-500 hover:text-primary-600 mb-shamar-16 inline-block">
              ← Administration Host
            </Link>
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight">
              Modération <span className="text-primary-600">annonces Host</span>
            </h1>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft overflow-hidden">
            {properties.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-700 uppercase tracking-wider">Photo</th>
                      <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-700 uppercase tracking-wider">Titre</th>
                      <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-700 uppercase tracking-wider">Ville</th>
                      <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-700 uppercase tracking-wider">Prix</th>
                      <th className="px-shamar-24 py-shamar-16 text-left text-shamar-caption font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-0 divide-y divide-gray-200">
                    {properties.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-shamar-24 py-shamar-16">
                          <img src={p.images[0]} alt="" className="w-16 h-12 object-cover rounded-shamar-md" />
                        </td>
                        <td className="px-shamar-24 py-shamar-16 font-medium text-gray-900 text-shamar-body">{p.title}</td>
                        <td className="px-shamar-24 py-shamar-16 text-gray-600 text-shamar-body font-medium">{p.city}</td>
                        <td className="px-shamar-24 py-shamar-16 text-gray-600 text-shamar-body font-medium">{p.price_per_night.toLocaleString()} FCFA</td>
                        <td className="px-shamar-24 py-shamar-16">
                          <Link href={`/host/${p.id}`} className="text-primary-600 hover:underline text-shamar-small font-semibold">
                            Voir
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-shamar-48">
                <Home className="h-16 w-16 text-gray-400 mx-auto mb-shamar-16" />
                <p className="text-gray-500 font-medium text-shamar-body">Aucune annonce à modérer</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
