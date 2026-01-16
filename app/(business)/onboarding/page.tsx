import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function BusinessOnboardingPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  // Rediriger vers le dashboard seller onboarding si seller
  if (user.role === 'seller') {
    redirect('/dashboard/seller/onboarding');
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Onboarding Entreprise
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">
          Complétez votre profil entreprise pour commencer à utiliser la plateforme.
        </p>
      </div>
    </div>
  );
}
