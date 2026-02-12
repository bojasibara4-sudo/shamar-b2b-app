import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function AdminLogsPage() {
  redirect('/dashboard/admin/security/logs');
}
