import { requireOwnerRoot } from '@/lib/auth-guard';
import { OwnerLayoutClient } from '@/components/owner/OwnerLayoutClient';

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireOwnerRoot();
  return (
    <OwnerLayoutClient mode="root" userEmail={user.email}>
      {children}
    </OwnerLayoutClient>
  );
}
