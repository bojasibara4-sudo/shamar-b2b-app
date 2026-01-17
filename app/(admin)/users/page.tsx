import { requireAdmin } from '@/lib/auth-guard';
import { createClient } from '@/lib/supabase/server';
import { Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  await requireAdmin();

  const supabase = await createClient();
  
  const { data: users } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
              Gestion des <span className="text-orange-600">Utilisateurs</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium">
              Gérez tous les utilisateurs de la plateforme
            </p>
          </div>
        </div>

        {users && users.length > 0 ? (
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                      Date création
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {users.map((user: any) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-slate-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-black ${
                          user.role === 'admin'
                            ? 'bg-orange-100 text-orange-800'
                            : user.role === 'seller'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-12 text-center">
            <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Aucun utilisateur</p>
          </div>
        )}
      </div>
    </div>
  );
}
