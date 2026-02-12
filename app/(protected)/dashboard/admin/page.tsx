import { requireAdmin } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import AdminDashboardClient from '@/components/dashboard/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  await requireAdmin();

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 py-shamar-24 lg:py-shamar-40">
        <div className="flex items-center justify-between mb-shamar-32">
          <div>
            <h1 className="text-shamar-h1 text-gray-900">
              Admin
            </h1>
            <p className="text-shamar-body text-gray-500 mt-1">
              Vue d&apos;ensemble de la plateforme
            </p>
          </div>
          <LogoutButton />
        </div>
        <div className="space-y-shamar-24">
          <AdminDashboardClient />
        </div>
      </div>
    </div>
  );
}

