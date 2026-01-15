import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import SettingsForm from '@/components/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="mt-2 text-gray-600">
          Gérez vos préférences et paramètres de compte
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <SettingsForm user={user} />
      </div>
    </div>
  );
}
