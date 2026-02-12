import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function AdminSecurityUsersPage() {
  redirect('/dashboard/admin/security/users');
}
