import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function AdminFinanceTransactionsPage() {
  redirect('/dashboard/admin/payments');
}
