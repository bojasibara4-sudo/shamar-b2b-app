import { requireAdmin, checkUserStatus } from '@/lib/auth-guard';
import AdminSidebar from '@/components/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = requireAdmin();
  checkUserStatus(user);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

