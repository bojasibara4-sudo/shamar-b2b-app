import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getOrdersForAdmin } from '@/services/order.service';
import { isAdminLike } from '@/lib/owner-roles';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (!isAdminLike(user.role)) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const orders = await getOrdersForAdmin();
  return NextResponse.json({ orders });
}
