import { requireSeller } from '@/lib/auth-guard';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';
import SellerDashboardClient from '@/components/dashboard/SellerDashboardClient';

export const dynamic = 'force-dynamic';

export default async function SellerDashboardPage() {
  const user = await requireSeller();
  const supabase = await createClient();

  // Vérifier si le seller a une boutique
  const { data: shop, error: shopError } = await (supabase as any)
    .from('shops')
    .select('id, status')
    .eq('seller_id', user.id)
    .in('status', ['draft', 'pending', 'verified'])
    .limit(1)
    .single();

  // Si pas de boutique, rediriger vers l'onboarding
  if (!shop || shopError) {
    redirect('/dashboard/onboarding-vendeur');
  }

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-shamar-16">
            <div>
              <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
                Tableau de bord <span className="text-primary-600">Vendeur</span>
              </h1>
              <p className="text-shamar-body text-gray-600 font-medium flex items-center gap-2">
                Bienvenue, <span className="font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-shamar-md text-shamar-body">{user.email}</span>
              </p>
              <p className="text-shamar-small text-gray-500 mt-2 font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
                Gérez vos produits, commandes et ventes
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <SellerDashboardClient />
      </div>
    </div>
    </div>
  );
}

