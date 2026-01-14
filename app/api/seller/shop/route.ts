import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getShopByUserId } from '@/services/shop.service';

export async function GET() {
  const user = getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'seller') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  try {
    const shop = await getShopByUserId(user.id);
    return NextResponse.json({ shop });
  } catch (error) {
    console.error('Error in GET /api/seller/shop:', error);
    return NextResponse.json({ shop: null });
  }
}
