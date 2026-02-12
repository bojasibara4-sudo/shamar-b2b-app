import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth-guard';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  await requireAdmin();
  redirect('/dashboard/admin/users');
}
