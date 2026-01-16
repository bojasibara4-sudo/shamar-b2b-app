import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { updateShop } from '@/services/shop.service';
import { createClient } from '@/lib/supabase/server';
import { getVendorByUserId } from '@/services/vendor.service';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'seller') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, name, description, category, country } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'L\'ID de la boutique est requis' },
        { status: 400 }
      );
    }

    // Vérifier que la boutique appartient au seller
    const vendor = await getVendorByUserId(user.id);
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendeur non trouvé' },
        { status: 404 }
      );
    }

    const supabase = await createClient();

    const { data: existingShop } = await (supabase as any)
      .from('shops')
      .select('id, status')
      .eq('id', id)
      .eq('vendor_id', vendor.id)
      .single();

    if (!existingShop) {
      return NextResponse.json(
        { error: 'Boutique non trouvée' },
        { status: 404 }
      );
    }

    // Ne pas permettre la modification si la boutique est verified (seul l'admin peut)
    if (existingShop.status === 'verified') {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas modifier une boutique vérifiée. Contactez l\'administrateur.' },
        { status: 403 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (category !== undefined) updateData.category = category?.trim() || null;
    if (country !== undefined) updateData.country = country?.trim() || null;

    const shop = await updateShop(user.id, id, updateData);

    if (!shop) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de la boutique' },
        { status: 500 }
      );
    }

    return NextResponse.json({ shop });
  } catch (error) {
    console.error('Error in PUT /api/seller/shop/update:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la boutique' },
      { status: 500 }
    );
  }
}
