import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getVendorTransactions } from '@/services/commission.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'seller') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const transactions = await getVendorTransactions(user.id);
  const totalRevenue = transactions.reduce(
    (sum: number, t: any) => sum + Number(t.amount || 0) - Number(t.commission_amount || 0),
    0
  );

  return NextResponse.json({
    commissions: transactions,
    totalRevenue,
  });
}
