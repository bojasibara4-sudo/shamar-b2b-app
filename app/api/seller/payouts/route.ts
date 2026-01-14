import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getVendorPayouts, calculateVendorPendingAmount } from '@/services/payout.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = getCurrentUser();

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
