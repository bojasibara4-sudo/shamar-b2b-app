import { requireSeller, checkSellerStatus } from '@/lib/auth-guard';
import SellerSidebar from '@/components/SellerSidebar';
import { getThemeForSegment } from '@/lib/theme-mapping';

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSeller();
  checkSellerStatus(user);

  return (
    <div className={`${getThemeForSegment('seller')} app-bg flex min-h-screen`}>
      <SellerSidebar />
      <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
    </div>
  );
}
