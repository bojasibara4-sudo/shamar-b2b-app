import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import RfqClient from '@/components/marketplace/RfqClient';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function RfqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const { id } = await params;
  const supabase = await createClient();

  const { data: rfq, error } = await (supabase as any)
    .from('product_rfqs')
    .select(`
      *,
      product:products(id, name, description, price, currency, image_url, seller_id),
      buyer:users!product_rfqs_buyer_id_fkey(id, email, full_name, company_name),
      seller:users!product_rfqs_seller_id_fkey(id, email, full_name, company_name)
    `)
    .eq('id', id)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .single();

  if (error || !rfq) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <Link href="/dashboard/buyer/offers" className="text-shamar-small font-medium text-gray-500 hover:text-primary-600">
          ← Retour
        </Link>
        <h1 className="text-shamar-h1 text-gray-900 tracking-tight">
          Demande de devis — {rfq.product?.name || 'Produit'}
        </h1>
        <RfqClient rfqId={id} initialRfq={rfq} currentUserId={user.id} />
      </div>
      </div>
    </div>
  );
}
