import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getVendorPayouts, calculateVendorPendingAmount, createPayout } from '@/services/payout.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'seller') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  try {
    const payouts = await getVendorPayouts(user.id);
    const pendingAmount = await calculateVendorPendingAmount(user.id);

    return NextResponse.json({ payouts, pendingAmount });
  } catch (error) {
    console.error('Error in GET /api/seller/payouts:', error);
    return NextResponse.json({ payouts: [], pendingAmount: 0 });
  }
}

/** Demande de retrait (création d'un payout en pending) */
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  if (user.role !== 'seller') return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });

  let body: { amount?: number; method?: string; currency?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body JSON invalide' }, { status: 400 });
  }
  const amount = Number(body.amount);
  if (!amount || amount <= 0) return NextResponse.json({ error: 'Montant invalide' }, { status: 400 });

  const pending = await calculateVendorPendingAmount(user.id);
  if (amount > pending) return NextResponse.json({ error: 'Montant supérieur au solde disponible' }, { status: 400 });

  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const periodEnd = now.toISOString().slice(0, 10);
  const payout = await createPayout(user.id, amount, periodStart, periodEnd, body.currency || 'FCFA');
  if (!payout) return NextResponse.json({ error: 'Impossible de créer la demande' }, { status: 500 });
  return NextResponse.json({ payout });
}
