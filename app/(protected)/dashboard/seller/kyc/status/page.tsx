import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

/** Écran statut KYC = étape validation de l'onboarding. */
export default function SellerKycStatusPage() {
  redirect('/dashboard/onboarding-vendeur?step=validation');
}
