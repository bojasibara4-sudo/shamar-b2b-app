import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function AdminSecurityAlertsPage() {
  redirect('/dashboard/admin/security/alerts');
}
