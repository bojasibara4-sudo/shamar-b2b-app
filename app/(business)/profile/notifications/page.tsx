import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * Notifications — sous « Pour moi » (spec: /profile/notifications)
 * Redirige vers les préférences notifications existantes.
 */
export default async function ProfileNotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  redirect('/settings/notifications');
}
