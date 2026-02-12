import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getProductsForBuyer } from '@/services/product.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'buyer') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const products = await getProductsForBuyer();
  return NextResponse.json({ products });
}
