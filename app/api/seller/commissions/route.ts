import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { commissionsDB } from '@/lib/mock-data';

export async function GET() {
  const user = getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'seller') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const commissions = commissionsDB.getBySellerId(user.id);
  const totalRevenue = commissionsDB.getTotalBySellerId(user.id);

  return NextResponse.json({ commissions, totalRevenue });
}

