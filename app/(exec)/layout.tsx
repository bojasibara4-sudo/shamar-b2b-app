import { requireOwnerExecOrRoot } from '@/lib/auth-guard';
import { OwnerLayoutClient } from '@/components/owner/OwnerLayoutClient';

export const dynamic = 'force-dynamic';

export default async function ExecLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireOwnerExecOrRoot();
  return (
    <OwnerLayoutClient mode="exec" userEmail={user.email}>
      {children}
    </OwnerLayoutClient>
  );
}
