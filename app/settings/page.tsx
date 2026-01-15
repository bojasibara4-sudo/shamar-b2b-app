import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import SettingsForm from '@/components/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="mt-2 text-gray-600">Gérez les préférences de votre compte.</p>
      </div>
      <SettingsForm user={user} />
    </div>
  );
}
