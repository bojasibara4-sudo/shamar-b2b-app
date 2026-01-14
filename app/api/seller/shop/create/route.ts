import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createShop } from '@/services/shop.service';
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
    const { name, description, category, country } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Le nom de la boutique est requis' },
        { status: 400 }
      );
    }

    const shop = await createShop(user.id, {
      name: name.trim(),
      description: description?.trim(),
      category: category?.trim(),
      country: country?.trim(),
    });

    if (!shop) {
      return NextResponse.json(
        { error: 'Erreur lors de la création de la boutique. Vous avez peut-être déjà une boutique active.' },
        { status: 400 }
      );
    }

    // Mettre à jour automatiquement le statut du vendor (sera pending car pas de documents)
    await updateVendorStatusAuto(user.id);

    return NextResponse.json({ shop }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/seller/shop/create:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la boutique' },
      { status: 500 }
    );
  }
}
