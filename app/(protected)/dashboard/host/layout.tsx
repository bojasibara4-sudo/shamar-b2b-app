import { requireAuth } from '@/lib/auth-guard';
import HostSidebar from '@/components/host/HostSidebar';

export default async function HostDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <HostSidebar />
      <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
    </div>
  );
}
