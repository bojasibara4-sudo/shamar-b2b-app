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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
            <span className="text-emerald-600">Paramètres</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Gérez vos préférences et votre compte
          </p>
        </div>
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
          <SettingsForm user={user} />
        </div>
      </div>
    </div>
  );
}
