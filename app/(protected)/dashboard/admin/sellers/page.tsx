import { requireAdmin } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { usersDB } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export default async function AdminSellersPage() {
  requireAdmin();

  const sellers = usersDB.getByRole('seller');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                Gestion des <span className="text-orange-600">Vendeurs</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium">
                Gérez les comptes vendeurs de la plateforme
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
          {sellers.length === 0 ? (
            <p className="text-slate-500 text-center py-12 font-medium">Aucun vendeur</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                      Rôle
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {sellers.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-slate-900">
                        {s.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-slate-900">
                        {s.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-3 py-1 text-xs font-black rounded-full bg-emerald-100 text-emerald-800">
                          {s.role}
                        </span>
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
