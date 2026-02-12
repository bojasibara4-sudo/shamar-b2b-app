import { requireBuyer, checkUserStatus } from '@/lib/auth-guard';
import BuyerSidebar from '@/components/BuyerSidebar';
import { getThemeForSegment } from '@/lib/theme-mapping';

export default async function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireBuyer();
  checkUserStatus(user);

  return (
    <div className={`${getThemeForSegment('buyer')} app-bg flex min-h-screen`}>
      <BuyerSidebar />
      <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
    </div>
  );
}

