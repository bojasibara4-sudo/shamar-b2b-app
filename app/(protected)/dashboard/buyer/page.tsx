import { requireBuyer } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import BuyerDashboardClient from '@/components/dashboard/BuyerDashboardClient';

export const dynamic = 'force-dynamic';

export default async function BuyerDashboardPage() {
  await requireBuyer();

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 py-shamar-24">
        <div className="flex items-center justify-between mb-shamar-24">
          <h1 className="text-shamar-h2 text-gray-900">
            Tableau de bord
          </h1>
          <LogoutButton />
        </div>
        <BuyerDashboardClient />
      </div>
    </div>
  );
}
