import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { calculateVendorPendingAmount } from '@/services/payout.service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/wallet — Solde et résumé (disponible, bloqué, en attente)
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const supabase = await createClient();

  if (user.role === 'seller') {
    const pending = await calculateVendorPendingAmount(user.id);
    const { data: escrows } = await (supabase as any)
      .from('escrows')
      .select('amount, currency, status')
      .eq('seller_id', user.id)
      .in('status', ['CREATED', 'HOLD', 'SHIPPED', 'DELIVERED']);
    const blocked = (escrows || []).reduce((s: number, e: any) => s + Number(e.amount || 0), 0);
    return NextResponse.json({
      available: pending,
      blocked,
      pending_amount: pending,
      currency: 'FCFA',
    });
  }

  if (user.role === 'buyer') {
    const { data: escrows } = await (supabase as any)
      .from('escrows')
      .select('amount, currency')
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
      available: 0,
      blocked,
      total_spent: totalSpent,
      currency: 'FCFA',
    });
  }

  return NextResponse.json({ available: 0, blocked: 0, currency: 'FCFA' });
}
