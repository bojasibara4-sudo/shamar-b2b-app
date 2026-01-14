import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { submitShopForVerification } from '@/services/shop.service';
import { updateVendorStatusAuto } from '@/services/vendorStatus.service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const user = getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'seller') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { shopId } = body;

    if (!shopId) {
      return NextResponse.json(
        { error: 'L\'ID de la boutique est requis' },
        { status: 400 }
      );
    }

    const shop = await submitShopForVerification(user.id, shopId);

    if (!shop) {
      return NextResponse.json(
        { error: 'Erreur lors de la soumission de la boutique' },
        { status: 500 }
      );
    }

    // Mettre à jour automatiquement le statut du vendor
    await updateVendorStatusAuto(user.id);

    return NextResponse.json({ shop });
  } catch (error) {
    console.error('Error in POST /api/seller/shop/submit:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la soumission de la boutique' },
      { status: 500 }
    );
  }
}
