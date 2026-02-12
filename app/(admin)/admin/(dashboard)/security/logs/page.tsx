import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function AdminSecurityLogsPage() {
  redirect('/dashboard/admin/security/logs');
}
