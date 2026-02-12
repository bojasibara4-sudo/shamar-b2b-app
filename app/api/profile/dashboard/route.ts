/**
 * GET /api/profile/dashboard — Résumé pour le hub « Pour moi »
 * Solde wallet, commandes en cours, livraisons actives, litiges ouverts
 */
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { calculateVendorPendingAmount } from '@/services/payout.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const supabase = await createClient();

  let wallet = { available: 0, blocked: 0, currency: 'FCFA' };
  if (user.role === 'seller' || user.role === 'admin') {
    const pending = await calculateVendorPendingAmount(user.id);
    const { data: escrows } = await (supabase as any)
      .from('escrows')
      .select('amount')
      .eq('seller_id', user.id)
      .in('status', ['CREATED', 'HOLD', 'SHIPPED', 'DELIVERED']);
    const blocked = (escrows || []).reduce((s: number, e: any) => s + Number(e.amount || 0), 0);
    wallet = { available: pending, blocked, currency: 'FCFA' };
  } else {
    const { data: escrows } = await (supabase as any)
      .from('escrows')
      .select('amount')
      .eq('buyer_id', user.id)
      .in('status', ['CREATED', 'HOLD', 'SHIPPED']);
    const blocked = (escrows || []).reduce((s: number, e: any) => s + Number(e.amount || 0), 0);
    wallet = { available: 0, blocked, currency: 'FCFA' };
  }

  const isSeller = user.role === 'seller' || user.role === 'admin';
  const ordersQuery = isSeller
    ? (supabase as any).from('orders').select('id', { count: 'exact', head: true }).eq('seller_id', user.id).in('status', ['PENDING', 'PAID', 'SHIPPED', 'PROCESSING'])
    : (supabase as any).from('orders').select('id', { count: 'exact', head: true }).eq('buyer_id', user.id).in('status', ['PENDING', 'PAID', 'SHIPPED', 'PROCESSING']);

  let deliveriesActive = 0;
  if (isSeller) {
    const [resSeller, resVendor] = await Promise.allSettled([
      (supabase as any).from('deliveries').select('id', { count: 'exact', head: true }).eq('seller_id', user.id).in('status', ['pending', 'shipped']),
      (supabase as any).from('deliveries').select('id', { count: 'exact', head: true }).eq('vendor_id', user.id).in('status', ['pending', 'shipped']),
    ]);
    const countSeller = resSeller.status === 'fulfilled' && resSeller.value?.count != null ? Number(resSeller.value.count) : 0;
    const countVendor = resVendor.status === 'fulfilled' && resVendor.value?.count != null ? Number(resVendor.value.count) : 0;
    deliveriesActive = Math.max(countSeller, countVendor);
  } else {
    const { count } = await (supabase as any).from('deliveries').select('id', { count: 'exact', head: true }).eq('buyer_id', user.id).in('status', ['pending', 'shipped']);
    deliveriesActive = count ?? 0;
  }

  const [{ count: ordersInProgress }, { count: disputesOpen }] = await Promise.all([
    ordersQuery,
    (supabase as any).from('disputes').select('id', { count: 'exact', head: true }).or(`raised_by.eq.${user.id},against_user.eq.${user.id}`).eq('status', 'open'),
  ]);

  return NextResponse.json({
    wallet,
    ordersInProgress: ordersInProgress ?? 0,
    deliveriesActive,
    disputesOpen: disputesOpen ?? 0,
  });
}
