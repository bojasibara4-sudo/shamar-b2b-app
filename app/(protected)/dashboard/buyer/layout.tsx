import { requireBuyer, checkUserStatus } from '@/lib/auth-guard';
import BuyerSidebar from '@/components/BuyerSidebar';

export default async function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireBuyer();
  checkUserStatus(user);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BuyerSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

