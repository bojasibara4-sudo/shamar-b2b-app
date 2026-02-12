import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

/** Écran KYC = étape documents de l'onboarding. Redirige vers onboarding avec step documents. */
export default function SellerKycPage() {
  redirect('/dashboard/onboarding-vendeur?step=documents');
}
