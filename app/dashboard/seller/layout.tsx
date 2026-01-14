import { requireSeller, checkSellerStatus } from '@/lib/auth-guard';
import SellerSidebar from '@/components/SellerSidebar';

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = requireSeller();
  checkSellerStatus(user);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SellerSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
