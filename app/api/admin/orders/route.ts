import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { ordersDB } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const orders = ordersDB.getAll();
  return NextResponse.json({ orders });
}

