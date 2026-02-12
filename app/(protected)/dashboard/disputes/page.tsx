import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

/**
 * Redirect /dashboard/disputes → /disputes (centre de litiges)
 * Alignement spec Module Airbnb : route /dashboard/disputes
 */
export default function DashboardDisputesRedirectPage() {
  redirect('/disputes');
}
