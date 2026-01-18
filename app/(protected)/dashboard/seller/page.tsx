import { requireSeller } from '@/lib/auth-guard';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';
import SellerDashboardClient from '@/components/seller/SellerDashboardClient';

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
    redirect('/dashboard/seller/onboarding');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                Tableau de bord <span className="text-indigo-600">Vendeur</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium">
                Bienvenue, <span className="font-black text-slate-900">{user.email}</span>
              </p>
              <p className="text-sm text-slate-400 mt-1 font-medium">
                Gérez vos produits, commandes et ventes
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <SellerDashboardClient />
      </div>
    </div>
  );
}

