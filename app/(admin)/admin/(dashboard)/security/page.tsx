import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function AdminSecurityPage() {
  redirect('/dashboard/admin/security');
}
