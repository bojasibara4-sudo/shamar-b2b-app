import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function HostPaymentsRedirectPage() {
  redirect('/dashboard/host/finance');
}
