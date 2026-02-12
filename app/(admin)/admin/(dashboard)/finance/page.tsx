import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function AdminFinancePage() {
  redirect('/dashboard/admin/finance');
}
