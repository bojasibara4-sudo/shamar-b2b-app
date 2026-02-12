import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/wallet/history — Historique des transactions (orders, payouts, escrow)
 * Query: period=30|90|365, type=all|payment|payout|order, module=all|marketplace|negoce|international|host
 */
export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const period = parseInt(searchParams.get('period') || '90', 10);
  const type = searchParams.get('type') || 'all';
  const since = new Date();
  since.setDate(since.getDate() - Math.min(period, 365));

  const supabase = await createClient();
  const transactions: { id: string; date: string; ref: string; module: string; type: string; amount: number; currency: string; status: string }[] = [];

  if (user.role === 'buyer' && (type === 'all' || type === 'order' || type === 'payment')) {
    const { data: orders } = await (supabase as any)
      .from('orders')
      .select('id, total_amount, currency, status, payment_status, created_at')
      .eq('buyer_id', user.id)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false })
      .limit(100);
    (orders || []).forEach((o: any) => {
      transactions.push({
        id: o.id,
        date: o.created_at,
        ref: `Commande #${o.id?.slice(0, 8)}`,
        module: 'Marketplace',
        type: 'paiement',
        amount: -Number(o.total_amount || 0),
        currency: o.currency || 'FCFA',
        status: o.payment_status === 'paid' ? 'payé' : o.status,
      });
    });
  }

  if (user.role === 'seller' && (type === 'all' || type === 'payout')) {
    const { data: payouts } = await (supabase as any)
      .from('payouts')
      .select('id, amount, currency, status, created_at')
      .eq('seller_id', user.id)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false })
      .limit(100);
    (payouts || []).forEach((p: any) => {
      transactions.push({
        id: p.id,
        date: p.created_at,
        ref: `Versement #${p.id?.slice(0, 8)}`,
        module: 'Marketplace',
        type: 'retrait',
        amount: Number(p.amount || 0),
        currency: p.currency || 'FCFA',
        status: p.status === 'sent' ? 'envoyé' : p.status,
      });
    });
  }

  if (user.role === 'seller' && (type === 'all' || type === 'order')) {
    const { data: orders } = await (supabase as any)
      .from('orders')
      .select('id, total_amount, currency, status, created_at')
      .eq('seller_id', user.id)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false })
      .limit(100);
    (orders || []).forEach((o: any) => {
      transactions.push({
        id: o.id,
        date: o.created_at,
        ref: `Commande #${o.id?.slice(0, 8)}`,
        module: 'Marketplace',
        type: 'revenu',
        amount: Number(o.total_amount || 0),
        currency: o.currency || 'FCFA',
        status: o.status,
      });
    });
  }

  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const unique = transactions.filter((t, i, arr) => arr.findIndex(x => x.id === t.id && x.type === t.type) === i);

  return NextResponse.json({ transactions: unique.slice(0, 100) });
}
