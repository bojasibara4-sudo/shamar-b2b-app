import { requireAdmin, checkUserStatus } from '@/lib/auth-guard';
import AdminSidebar from '@/components/AdminSidebar';
import { getThemeForSegment } from '@/lib/theme-mapping';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  checkUserStatus(user);

  return (
    <div className={`${getThemeForSegment('admin')} app-bg flex min-h-screen`}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
    </div>
  );
}

