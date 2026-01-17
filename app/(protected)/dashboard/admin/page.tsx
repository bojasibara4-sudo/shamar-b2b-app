import { requireAdmin } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const user = await requireAdmin();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                Tableau de bord <span className="text-orange-600">Administrateur</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium">
                Bienvenue, <span className="font-black text-slate-900">{user.email}</span>
              </p>
              <p className="text-sm text-slate-400 mt-1 font-medium">
                Vue d'ensemble de la plateforme SHAMAR B2B
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <AdminDashboardClient />
      </div>
    </div>
  );
}

