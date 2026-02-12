import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import NegociationClient from '@/components/marketplace/NegociationClient';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function NegociationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const { id } = await params;
  const supabase = await createClient();

  const { data: offer, error } = await (supabase as any)
    .from('offers')
    .select(`
      *,
      product:products(id, name, description, price, currency, image_url, seller_id),
      buyer:users!offers_buyer_id_fkey(id, email, full_name, company_name),
      seller:users!offers_seller_id_fkey(id, email, full_name, company_name)
    `)
    .eq('id', id)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .single();

  if (error || !offer) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <Link href="/dashboard/buyer/offers" className="text-shamar-small font-medium text-gray-500 hover:text-primary-600">
          ← Mes offres
        </Link>
        <h1 className="text-shamar-h1 text-gray-900 tracking-tight">
          Négociation — {offer.product?.name || 'Produit'}
        </h1>
        <NegociationClient
          offerId={id}
          initialOffer={offer}
          currentUserId={user.id}
        />
      </div>
      </div>
    </div>
  );
}
