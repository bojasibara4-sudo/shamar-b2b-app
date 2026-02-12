import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { calculateVendorPendingAmount, getVendorPayouts } from '@/services/payout.service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/finance/dashboard — Synthèse finance (revenus, escrow, commissions, graphiques)
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const supabase = await createClient();
  const currency = 'FCFA';

  if (user.role === 'seller') {
    const pending = await calculateVendorPendingAmount(user.id);
    const payouts = await getVendorPayouts(user.id);
    const sentPayouts = payouts.filter((p) => p.status === 'sent');
    const totalWithdrawn = sentPayouts.reduce((s, p) => s + Number(p.amount || 0), 0);

    const { data: escrows } = await (supabase as any)
      .from('escrows')
      .select('id, amount, status, created_at')
      .eq('seller_id', user.id)
      .in('status', ['CREATED', 'HOLD', 'SHIPPED', 'DELIVERED']);
    const escrowActiveCount = (escrows || []).length;
    const escrowActiveAmount = (escrows || []).reduce((s: number, e: any) => s + Number(e.amount || 0), 0);

    const { data: payments } = await (supabase as any)
      .from('payments')
      .select('seller_amount, commission_amount, created_at')
      .eq('seller_id', user.id)
      .eq('status', 'paid');
    let totalRevenue = 0;
    let totalCommissions = 0;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    let monthlyRevenue = 0;
    (payments || []).forEach((p: any) => {
      const v = Number(p.seller_amount || 0);
      const c = Number(p.commission_amount || 0);
      totalRevenue += v;
      totalCommissions += c;
      const d = new Date(p.created_at);
      if (d >= startOfMonth) monthlyRevenue += v;
    });

    return NextResponse.json({
      role: 'seller',
      available: pending,
      blocked: escrowActiveAmount,
      total_revenue: totalRevenue,
      monthly_revenue: monthlyRevenue,
      total_withdrawn: totalWithdrawn,
      commissions_paid: totalCommissions,
      escrow_active_count: escrowActiveCount,
      escrow_active_amount: escrowActiveAmount,
      currency,
    });
  }

  if (user.role === 'buyer') {
    const { data: escrows } = await (supabase as any)
      .from('escrows')
      .select('amount')
      .eq('buyer_id', user.id)
      .in('status', ['CREATED', 'HOLD', 'SHIPPED']);
    const blocked = (escrows || []).reduce((s: number, e: any) => s + Number(e.amount || 0), 0);
    const { data: orders } = await (supabase as any)
      .from('orders')
      .select('total_amount')
      .eq('buyer_id', user.id)
      .eq('payment_status', 'paid');
    const totalSpent = (orders || []).reduce((s: number, o: any) => s + Number(o.total_amount || 0), 0);
    return NextResponse.json({
      role: 'buyer',
      total_spent: totalSpent,
      blocked,
      currency,
    });
  }

  return NextResponse.json({ role: user.role, currency });
}
