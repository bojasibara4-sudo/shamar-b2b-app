import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BusinessOnboardingPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  if (user.role === 'seller') {
    redirect('/dashboard/onboarding-vendeur');
  }

  return (
    <div className="max-w-shamar-container mx-auto px-4 py-shamar-24">
      <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
        <h1 className="text-shamar-h1 text-gray-900 mb-shamar-24 tracking-tight">
          Onboarding <span className="text-primary-600">Entreprise</span>
        </h1>

        <div className="bg-gray-50 rounded-shamar-md p-shamar-24 border border-gray-200">
          <p className="text-gray-600 leading-relaxed text-shamar-body">
            Complétez votre profil entreprise pour commencer à utiliser la plateforme.
          </p>
          <div className="mt-shamar-24 flex justify-end">
            <Link
              href="/profile/info"
              className="inline-flex items-center justify-center bg-primary-600 text-white font-semibold px-shamar-24 py-2.5 rounded-shamar-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Commencer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
