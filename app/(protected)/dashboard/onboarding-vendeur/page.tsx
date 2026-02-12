import { requireAuth } from '@/lib/auth-guard';
import SellerOnboardingContent from '@/components/seller/SellerOnboardingContent';

export const dynamic = 'force-dynamic';

export default async function OnboardingVendeurPage() {
  await requireAuth();
  return <SellerOnboardingContent />;
}
