import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import InvoicePrint from '@/components/finance/InvoicePrint';

export const dynamic = 'force-dynamic';

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const supabase = await createClient();
  const { data: order, error } = await (supabase as any)
    .from('orders')
    .select(`
      *,
      order_items:order_items(*, product:products(id, name, price, currency)),
      buyer:users!orders_buyer_id_fkey(email, full_name, company_name),
      seller:users!orders_seller_id_fkey(email, full_name, company_name)
    `)
    .eq('id', id)
    .single();

  if (error || !order) notFound();

  const isBuyer = order.buyer_id === user.id;
  const isSeller = order.seller_id === user.id;
  if (!isBuyer && !isSeller && user.role !== 'admin') notFound();

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto py-shamar-24 px-4">
      <div className="flex items-center justify-between mb-shamar-24 print:hidden">
        <Link href="/payments" className="text-gray-600 font-medium hover:text-primary-600 text-shamar-body">← Paiements</Link>
      </div>
      <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-32 print:shadow-none print:border">
        <InvoicePrint order={order} />
      </div>
      <p className="print:hidden mt-shamar-16 text-center text-shamar-small text-gray-500 font-medium">
        Utilisez le bouton ci‑dessus ou Ctrl+P pour imprimer ou enregistrer en PDF.
      </p>
      </div>
    </div>
  );
}
