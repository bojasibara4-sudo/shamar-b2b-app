import { requireBuyer } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import BuyerDashboardClient from '@/components/buyer/BuyerDashboardClient';

export const dynamic = 'force-dynamic';

export default async function BuyerDashboardPage() {
  const user = await requireBuyer();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                Tableau de bord <span className="text-emerald-600">Acheteur</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium">
                Bienvenue, <span className="font-black text-slate-900">{user.email}</span>
              </p>
              <p className="text-sm text-slate-400 mt-1 font-medium">
                Parcourez les produits et suivez vos commandes
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <BuyerDashboardClient />
      </div>
    </div>
  );
}

