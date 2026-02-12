import { requireAdmin } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { getUsersForAdmin } from '@/services/user.service';
import DeleteUserButton from '@/components/DeleteUserButton';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await getUsersForAdmin();

  return (
    <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-shamar-16">
            <div>
              <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
                Gestion des <span className="text-primary-600">Utilisateurs</span>
              </h1>
              <p className="text-shamar-body text-gray-500 font-medium">
                Gérez tous les utilisateurs de la plateforme
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-24">
          {users.length === 0 ? (
            <p className="text-gray-500 text-center py-shamar-48 font-medium text-shamar-body">Aucun utilisateur</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-shamar-caption font-semibold text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-shamar-caption font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-shamar-caption font-semibold text-gray-700 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-shamar-caption font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-0 divide-y divide-gray-200">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-shamar-small font-medium text-gray-900">
                        {u.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-shamar-small font-medium text-gray-900">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-shamar-small">
                        <span className="px-3 py-1 text-shamar-caption font-semibold rounded-shamar-sm bg-primary-100 text-primary-800">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-shamar-small">
                        <DeleteUserButton userId={u.id} userEmail={u.email} />
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
